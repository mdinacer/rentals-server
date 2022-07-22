const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  pictureUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
});

imageSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
};

module.exports.Image = mongoose.model('Image', imageSchema);
module.exports.Schema = imageSchema;
