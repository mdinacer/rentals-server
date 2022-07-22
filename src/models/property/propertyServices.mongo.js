const mongoose = require('mongoose');
const Joi = require('joi');

const propertyServicesSchema = new mongoose.Schema({
  accessibility: {
    type: Boolean,
    default: false,
  },

  airConditioner: {
    type: Boolean,
    default: false,
  },

  cityGas: {
    type: Boolean,
    default: false,
  },

  elevator: {
    type: Boolean,
    default: false,
  },

  furniture: {
    type: Boolean,
    default: false,
  },

  heater: {
    type: Boolean,
    default: false,
  },

  hotWater: {
    type: Boolean,
    default: false,
  },

  internet: {
    type: Boolean,
    default: false,
  },

  petsAllowed: {
    type: Boolean,
    default: false,
  },

  smokeFree: {
    type: Boolean,
    default: false,
  },
});

propertyServicesSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

const servicesValidationSchema = Joi.object({
  accessibility: Joi.boolean(),
  airConditioner: Joi.boolean(),
  cityGas: Joi.boolean(),
  elevator: Joi.boolean(),
  furniture: Joi.boolean(),
  heater: Joi.boolean(),
  hotWater: Joi.boolean(),
  internet: Joi.boolean(),
  internet: Joi.boolean(),
  petsAllowed: Joi.boolean(),
  smokeFree: Joi.boolean(),
});

module.exports = {
  propertyServicesSchema,
  servicesValidationSchema,
};
