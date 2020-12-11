const path = require('path');
const fs = require('fs');

const express = require('express');
const router = express.Router();
const passport = require('passport');
const multer = require('multer');
const Validator = require('validator');

const AWS = require('aws-sdk');
const storage = multer.memoryStorage()
const upload = multer({storage: storage});


// Post model
const Post = require('../../models/Post');
// Profile model
//const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/post');

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

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .populate('user', ['username', 'avatar'])
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  upload.single('file'),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req);
    
    // Check Validation
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    let location = '';
    let description = '';

    if(req.body.location) location = req.body.location;
    if(req.body.description) description = req.body.description;

    const filename =  req.user.id + "-" + Date.now() + path.extname(req.file.originalname);

    uploadParams.Key = filename;
    uploadParams.Body = req.file.buffer;

    s3Client.upload(uploadParams, (err, data) => {
        if (err) {
            res.status(500).json({error:"Error -> " + err});
        }

        const newPost = new Post({
          imageUrl: data.Location,
          location,
          description,
          user: req.user.id
        });
    
        newPost.save().then(post => res.json(post));

    });
    
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }
  
          // Remove image from local storage
          const url = `/storage/${imageUrl}`;
          fs.unlink(url,function(err){

            if(err) return console.log(err);

            // Delete post from db
            post.remove().then(() => {
              res.json({ success: true })
            });
            
          }); 
          
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: 'User already liked this post' });
          }

          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
    
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: 'You have not yet liked this post' });
          }

          // Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          // Save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  
  }
);

router.get('/comments/:id', (req, res) => {
  Post.findById(req.params.id, {comments:1})
    .populate('comments.user', ['username', 'avatar'])
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ nopostfound: 'No post found with that ID' })
    );
});

// @route   POST api/posts/comment/:id
// @desc    Add comment to post
// @access  Private
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    
    //const { errors, isValid } = validatePostInput(req.body);
    let errors = {};

    // Check Validation
    if (!req.body.text) {
      errors.text = 'Text field is required';
      return res.status(400).json(errors);
    }

    if (!Validator.isLength(req.body.text, { min: 1, max: 100 })) {
      errors.text = 'Comment must be between 1 and 100 characters';
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          user: req.user.id
        };

        // Add to comments array
        post.comments.unshift(newComment);

        // Save
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    Remove comment from post
// @access  Private
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check to see if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res
            .status(404)
            .json({ commentnotexists: 'Comment does not exist' });
        }

        // Get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // Splice comment out of array
        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

module.exports = router;
