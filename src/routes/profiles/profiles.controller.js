const {
  GetProfile,
  CreateProfile,
  EditProfile,
} = require('../../models/profile/profile.model');

async function httpGetProfile(req, res) {
  const userId = req.params.id;
  const profile = await GetProfile(userId);
  return res.status(200).json(profile);
}

async function httpPostProfile(req, res) {
  const file = req.file;
  const data = req.body;
  const profile = await CreateProfile(req.user, data, file);
  return res.status(203).json(profile);
}

async function httpPutProfile(req, res) {
  const file = req.file;
  const data = req.body;
  const profile = await EditProfile(req.user, data, file);
  return res.status(200).json(profile);
}

module.exports = {
  httpGetProfile,
  httpPostProfile,
  httpPutProfile,
};
