const mongoose = require('mongoose');
const Joi = require('joi');

const reviewSchema = new mongoose.Schema({
  hostName: {
    type: String,
  },
  creationDate: {
    type: Date,
    default: Date.now(),
  },

  lastUpdate: {
    type: Date,
  },

  modified: {
    type: Boolean,
    default: false,
  },

  deleted: {
    type: Boolean,
    default: false,
  },

  body: {
    type: String,
  },

  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },

  host: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Profile',
  },

  property: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Property',
  },
});

const Review = mongoose.model('Review', reviewSchema);

function validateReview(values) {
  const schema = Joi.object({
    body: Joi.string(),
    rating: Joi.number().min(0).max(5),
  });

  return schema.validate(values);
}

module.exports = {
  Review,
  validateReview,
};
