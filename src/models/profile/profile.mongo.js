const mongoose = require('mongoose');
const Joi = require('joi');

const { Schema: imageSchema } = require('../shared/image.mongo');
const { addressSchema } = require('../address/address.mongo');

const profileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    min: 3,
    max: 255,
    required: true,
  },

  lastName: {
    type: String,
    min: 3,
    max: 255,
    required: true,
  },

  email: {
    type: String,
  },

  image: {
    type: imageSchema,
  },

  phone: {
    type: String,
  },

  mobile: {
    type: String,
    required: true,
  },

  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },

  address: {
    type: addressSchema,
  },

  favorites: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'House',
    },
  ],
});

profileSchema
  .virtual('fullName')
  .get(() => `${this.firstName} ${this.lastName}`);

profileSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = doc._id;
    ret.image = doc.image?.pictureUrl || '';
    ret.fullName = `${doc.firstName} ${doc.lastName}`;

    // delete ret.firstName;
    // delete ret.lastName;

    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

function validateProfile(values) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(255).required(),
    lastName: Joi.string().min(3).max(255).required(),
    phone: Joi.string().optional().allow(''),
    mobile: Joi.string().required(),
    address: Joi.object({
      wilaya: Joi.string().required(),
      daira: Joi.string().required(),
      commune: Joi.string().required(),
      address1: Joi.string().required(),
      address2: Joi.string().optional().allow(''),
    }),
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
    },
  });

  return schema.validate(values);
}

module.exports = {
  Profile: mongoose.model('Profile', profileSchema),
  validateProfile,
};
