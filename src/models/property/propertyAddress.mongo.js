const mongoose = require('mongoose');
const Joi = require('joi');

const propertyAddressSchema = new mongoose.Schema({
  wilaya: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  daira: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  commune: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  address1: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  address2: {
    type: String,
    lowercase: true,
    trim: true,
  },
  location: {
    long: String,
    lat: String,
  },
});

propertyAddressSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

const addressValidationSchema = Joi.object({
  wilaya: Joi.string().min(2).max(255).required(),
  daira: Joi.string().min(2).max(255).required(),
  commune: Joi.string().min(2).max(255).required(),
  address1: Joi.string().min(2).max(255).required(),
  address2: Joi.string().min(2).max(255).optional().allow(''),
  location: Joi.object({
    long: Joi.string().optional().allow(''),
    lat: Joi.string().optional().allow(''),
  }),
});

module.exports = {
  propertyAddressSchema,
  addressValidationSchema,
};
