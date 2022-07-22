const mongoose = require('mongoose');
const Joi = require('joi');

const propertyDetailsSchema = new mongoose.Schema({
  area: {
    type: Number,
  },

  baths: {
    type: Number,
    min: 1,
    default: 1,
  },

  beds: {
    type: Number,
    min: 1,
    default: 1,
  },

  floors: {
    type: Number,
  },

  gardens: {
    type: Number,
    min: 0,
    default: 0,
  },

  kitchens: {
    type: Number,
    min: 1,
    default: 1,
  },

  parkings: {
    type: Number,
    min: 0,
    default: 0,
  },

  pools: {
    type: Number,
    min: 0,
    default: 0,
  },

  rooms: {
    type: Number,
    min: 1,
    default: 1,
  },
});

propertyDetailsSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

const detailsValidationSchema = Joi.object({
  area: Joi.number().min(0).required(),
  baths: Joi.number().min(0).max(50),
  beds: Joi.number().min(0).max(50),
  floors: Joi.number().min(0).max(50),
  gardens: Joi.number().min(0).max(50),
  kitchens: Joi.number().min(0).max(50),
  parkings: Joi.number().min(0).max(50),
  pools: Joi.number().min(0).max(50),
  rooms: Joi.number().min(0).max(50),
});

module.exports = {
  propertyDetailsSchema,
  detailsValidationSchema,
};
