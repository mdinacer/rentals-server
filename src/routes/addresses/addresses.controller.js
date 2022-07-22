const {
  GetWilayas,
  GetDairas,
  GetCommunes,
} = require('../../models/address/address.model');

async function httpGetWilayas(req, res) {
  const result = await GetWilayas();
  return res.status(200).json(result);
}

async function httpGetDairas(req, res) {
  const countryId = req.params.id;
  const result = await GetDairas(countryId);
  return res.status(200).json(result);
}

async function httpGetCommunes(req, res) {
  const provinceId = req.params.id;
  const result = await GetCommunes(provinceId);
  return res.status(200).json(result);
}

module.exports = {
  httpGetWilayas,
  httpGetDairas,
  httpGetCommunes,
};
