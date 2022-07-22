const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
  ],
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  },
});

// userSchema.options.toJSON = {
//   transform: function (doc, ret, options) {
//     ret.id = doc._id;

//     // delete ret._id;
//     delete ret.__v;
//     return ret;
//   },
// };

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, roles: this.roles.map((r) => r.name) },
    process.env.JWT_KEY
  );
};

const User = mongoose.model('User', userSchema);

function validateRegisterUser(values) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    email: Joi.string().email(),
    password: Joi.string().min(5).max(1024).required(),
    profile: Joi.objectId(),
  });

  return schema.validate(values);
}

function validateLoginUser(values) {
  const schema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(5).max(1024).required(),
  });

  return schema.validate(values);
}

exports.UserSchema = userSchema;
exports.User = User;
exports.validateRegister = validateRegisterUser;
exports.validateLogin = validateLoginUser;
