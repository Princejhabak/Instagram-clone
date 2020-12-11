const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
  let errors = {};
 
 // data.path = !isEmpty(data.path) ? data.path : '';

  if (!data.file) {
    errors.imageUrl = 'Please select an image to post';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
