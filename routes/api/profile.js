const path = require('path');

const express = require('express');
const router = express.Router();
const multer = require('multer');
const passport = require('passport');

const AWS = require('aws-sdk');
const storage = multer.memoryStorage()
const upload = multer({storage: storage});

const RANDOM_COLORS = require('../../utils/randomColor');

// Load Profile Model
const Profile = require('../../models/Profile');
// Load User Model
const User = require('../../models/User');
// Load Post Model
const Post = require('../../models/Post');

// Validation
const validatePostInput = require('../../validation/post');
const validateProfileInput = require('../../validation/profile');

// File storage config

/*const storageDir = path.join(path.dirname(require.main.filename), '/storage');

const storageConfig =  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, storageDir)
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname))
    }
  });

const upload = multer({
    storage: storageConfig,
    limits: {fileSize: 10000000}
});
*/

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

router.get('/test', (req, res) => {
  res.json({
    
    msg:"Profile Works"
  })
});


// Get user info and posts
router.get('/', passport.authenticate('jwt', { session: false }),(req, res) => {

  Profile.findOne({user: req.user.id})
    .then(profile => {

      if(!profile){
        return res.status(404).json({ noprofilefound: 'No profile found' })
      }

      Post.find({user: req.user.id})
        .then(posts => {

          if(!posts){
            return res.status(404).json({ nopostsfound: 'No posts found' })
          }

          res.json({
            user: req.user,
            profile,
            posts
          });

        })
        .catch( e => {
          res.status(400).json(e);
        });
        

    })
    .catch( e => {
      res.status(400).json(e);
    });
});

// Get user info and posts by id
router.get('/:username', passport.authenticate('jwt', { session: false }),(req, res) => {

  User.findOne({username: req.params.username})
    .then(user => {
      if(!user){
        return res.status(404).json({ nouserfound: 'No user found' })
      }

      Profile.findOne({user: user.id})
        .then(profile => {

          if(!profile){
            return res.status(404).json({ noprofilefound: 'No profile found' })
          }

          Post.find({user: user.id})
            .then(posts => {

              if(!posts){
                return res.status(404).json({ nopostsfound: 'No posts found' })
              }

              res.json({
                user,
                profile,
                posts
              });

            })
            .catch( e => {
              res.status(400).json(e);
            });
            

        })
        .catch( e => {
          res.status(400).json(e);
        });

    })
    .catch( e => {
      res.status(400).json(e);
    });

});

// Profile picture upload route
router.post('/profile_picture/upload',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  (req, res) => {

    const { errors, isValid } = validatePostInput(req);

    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const filename =  req.user.id + "-" + Date.now() + path.extname(req.file.originalname);

    uploadParams.Key = filename;
    uploadParams.Body = req.file.buffer;

    s3Client.upload(uploadParams, (err, data) => {
        if (err) {
            res.status(500).json({error:"Error -> " + err});
        }
        
        User.findByIdAndUpdate(req.user.id,
          {
            $set:{
              avatar: data.Location
            }
          }, 
          {new: true})
          .then((user) => {
    
            if(!user){
              return res.status(404).json({ nouserfound: 'No user found' })
            }
            res.json(user);
          })
          .catch( e => {
            res.status(400).json(e);
        });
    

    });
    

});

// Profile picture remove route
router.post('/profile_picture/remove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
  
  // Generate avatar by name 
  const randomNumber = Math.floor(Math.random() * 58); 
  const color = RANDOM_COLORS[randomNumber];
  let name = req.user.name.trim();
  
  const temp = name.split(" ");
  const length = temp.length;
  name = temp.join('+');

  const url = `https://ui-avatars.com/api/?name=${name}&size=160&uppercase=true&bold=true&background=${color}&color=fff&length=${length}`;
                  
    User.findByIdAndUpdate(req.user.id,
      {
        $set:{
          avatar: url
        }
      }, 
      {new: true})
      .then((user) => {

        if(!user){
          return res.status(404).json({ nouserfound: 'No user found' })
        }
        res.json(user);
      })
      .catch( e => {
        res.status(400).json(e);
    });

});

router.post('/update',
 passport.authenticate('jwt', { session: false }), 
 (req, res) => {

  const { errors, isValid } = validateProfileInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  } 

  User.findOne({ username: req.body.username })
    .then(user => {
      if(user.name !== req.user.name){
        errors.username = 'Username already exists';
        return res.status(400).json(errors);
      }
      else{console.log(req.body.website);

        User.findByIdAndUpdate(req.user.id, {
          $set:{
            name: req.body.name,
            username: req.body.username
          }
        }, {new: true})
          .then(user => {

            if(!user){
              return res.status(404).json({ nouserfound: 'No user found' })
            }

            Profile.findOneAndUpdate({user: req.user.id},{
              $set:{
                website: req.body.website,
                bio: req.body.bio
              }
            } , { new: true})
            .then(profile => {
              if(!profile){
                return res.status(404).json({ noprofilefound: 'No profile found' })
              }
              res.json({
                user,
                profile
              });
            })
            .catch(err => {
              res.status(400).json(err);
            });

          })
          .catch(err => {
            res.status(400).json(err);
          });

      }
    })
    .catch(err => console.log(err))

});

module.exports = router;
