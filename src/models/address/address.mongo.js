const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
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

addressSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

const wilayaSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  nameAr: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  code: {
    type: Number,
    required: true,
    default: 0,
  },
});

wilayaSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = doc._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

const dairaSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  nameAr: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },

  wilaya: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Wilaya',
  },
});

dairaSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = doc._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

const communeSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  nameAr: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
  },
  wilaya: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Wilaya',
  },
  daira: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Daira',
  },
});

communeSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    ret.id = doc._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

module.exports.addressSchema = addressSchema;

module.exports.Wilaya = mongoose.model('Wilaya', wilayaSchema);
module.exports.Daira = mongoose.model('Daira', dairaSchema);
module.exports.Commune = mongoose.model('Commune', communeSchema);
