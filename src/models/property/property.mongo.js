const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const Joi = require('joi');

const { Schema: imageSchema } = require('../shared/image.mongo');
const {
  propertyDetailsSchema,
  detailsValidationSchema,
} = require('./propertyDetails.mongo');

const {
  propertyServicesSchema,
  servicesValidationSchema,
} = require('./propertyServices.mongo');

const {
  propertyAddressSchema,
  addressValidationSchema,
} = require('./propertyAddress.mongo');

mongoose.plugin(slug);

const propertySchema = new mongoose.Schema({
  creationDate: {
    type: Date,
    default: Date.now(),
  },

  lastUpdate: {
    type: Date,
    default: Date.now(),
  },

  type: {
    type: String,
    enum: ['apartment', 'house'],
    default: 'apartment',
  },

  owner: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Profile',
  },

  title: {
    type: String,
    required: true,
    min: 5,
    max: 255,
  },

  slug: {
    type: String,
    slug: 'title',
    unique: true,
  },

  description: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    default: 0,
  },

  price: {
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },

    installment: {
      type: Boolean,
      default: false,
    },

    duration: {
      type: String,
      enum: ['day', 'week', 'month', 'year'],
      default: 'day',
      required: true,
    },
  },

  available: {
    type: Boolean,
    default: true,
  },

  availableFrom: {
    type: Date,
  },

  // RELATIVE OBJECTS

  cover: {
    type: imageSchema,
  },

  images: {
    type: [imageSchema],
  },

  address: propertyAddressSchema,

  details: propertyDetailsSchema,

  services: propertyServicesSchema,

  reviews: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Review',
    },
  ],
});

propertySchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

function validateProperty(values) {
  const schema = Joi.object({
    type: Joi.string().min(5).max(255).required(),
    title: Joi.string().min(5).max(255).required(),
    description: Joi.string(),
    available: Joi.boolean().optional(),
    availableFrom: Joi.date().optional(),
    price: Joi.object({
      amount: Joi.number().min(0).required(),
      duration: Joi.string().required(),
      installment: Joi.boolean(),
    }),
    address: addressValidationSchema,
    details: detailsValidationSchema,
    services: servicesValidationSchema,
  });

  return schema.validate(values);
}

const Property = mongoose.model('Property', propertySchema);

module.exports = {
  Property,
  validateProperty,
};
