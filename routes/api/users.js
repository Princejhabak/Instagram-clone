const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

const RANDOM_COLORS = require('../../utils/randomColor');

// Load User model
const User = require('../../models/User');
// Load Profile model
const Profile = require('../../models/Profile');

// Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

const path = require('path');
const AWS = require('aws-sdk');
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({storage: storage});


const s3Client = new AWS.S3({
  accessKeyId: 'YOUR_KEY',
  secretAccessKey: 'YOUR_KEY',
  region :'YOUR_REGION'
});

const uploadParams = {
  Bucket: 'BUCKET_NAME', 
  Key: '', // pass key
  Body: null, // pass file body
};


router.post('/test', passport.authenticate('jwt', { session: false }), upload.single("file"),(req, res) => {

    const filename =  req.user.id + "-" + Date.now() + path.extname(req.file.originalname);

    uploadParams.Key = filename;
    uploadParams.Body = req.file.buffer;

    s3Client.upload(uploadParams, (err, data) => {
        if (err) {
            res.status(500).json({error:"Error -> " + err});
        }
        res.json({message: 'File uploaded successfully','filename': 
        req.file.originalname, 'location': data.Location});
    });

});


router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } 
    else {

      User.findOne({ username: req.body.username }).then(user1 => {
        if(user1){
          errors.username = 'Username already exists';
          return res.status(400).json(errors);
        }
        else{

        // Generate avatar by name 
        const randomNumber = Math.floor(Math.random() * 58); 
        const color = RANDOM_COLORS[randomNumber];
        let name = req.body.name.trim();
        
        const temp = name.split(" ");
        const length = temp.length;
        name = temp.join('+');

        const url = `https://ui-avatars.com/api/?name=${name}&size=160&uppercase=true&bold=true&background=${color}&color=fff&length=${length}`;

          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            avatar: url,
            password: req.body.password
          });
    
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {

                  const profileFields = {};
                  profileFields.user = user.id;

                  new Profile(profileFields).save().then(profile => res.json({
                    user,
                    profile
                  }));
                  
                })
                .catch(err => console.log(err));
            });
          });

        }
      });
      
    }

  });

});


router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched
        const payload = { 
          id: user.id, 
          name: user.name,
          username: user.username, 
          avatar: user.avatar
        }; // Create JWT Payload

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});


router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

router.post('/search', (req, res) => {

  const {searchTerm} = req.body; 
  
  if(searchTerm === ''){
    return res.send([]);
  }

  User.find({
    $or: [
      {name: { $regex: searchTerm, $options: "gmi" }},
      {username: { $regex: searchTerm, $options: "gmi" }},
    ]
  }, function(err, docs) {
      if(!err) res.send(docs);
      else console.log(err);
  });

});


module.exports = router;