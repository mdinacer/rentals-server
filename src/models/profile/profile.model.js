const { Profile, validateProfile } = require('./profile.mongo');
const { SaveImage, DeleteImage } = require('../../services/cloudinary');

async function GetProfile(userId) {
  const profile = await Profile.findOne({ user: userId });

  if (!profile) {
    const error = Error('No matching profile found');
    error.statusCode = 404;
    throw error;
  }

  return profile;
}

async function CreateProfile(user, data, file) {
  validateProfileData(data);

  if (user.profile) {
    const error = Error('This user already have a profile file');
    error.statusCode = 400;
    throw error;
  }

  const profile = new Profile(data);

  if (file) {
    const result = await SaveImage(file.buffer, 'profiles', 300, 300);

    profile.set({ image: result });
  }

  profile.set({ user: user._id, email: user.email });

  await profile.save();
  await user.updateOne({ profile: profile._id });

  return profile;
}

async function EditProfile(user, data, file) {
  validateProfileData(data);

  const profile = await Profile.findById(user.profile);

  if (!profile) {
    const error = Error('No matching profile found');
    error.statusCode = 404;
    throw error;
  }

  if (file) {
    if (profile.image.publicId) {
      await DeleteImage(profile.image.publicId);
    }
    const result = await SaveImage(file.buffer, 'profiles', 300, 300);
    data.image = result;
  }
  await profile.updateOne(data);
  return await Profile.findOne({ user: user._id });
}

function validateProfileData(values) {
  const { error: validationError } = validateProfile(values);

  if (validationError) {
    const error = Error(validationError.details[0].message);
    error.statusCode = 400;
    throw error;
  }
}

module.exports = {
  GetProfile,
  CreateProfile,
  EditProfile,
};
