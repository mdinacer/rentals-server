const { Wilaya, Daira, Commune } = require('./address.mongo');

async function GetWilayas() {
  return await Wilaya.find().sort({ name: 1 });
}

async function GetDairas(wilayaId) {
  return await Daira.find({ wilaya: wilayaId }).sort({ name: 1 });
}

async function GetCommunes(dairaId) {
  return await Commune.find({ daira: dairaId }).sort({ name: 1 });
}

module.exports = {
  GetWilayas,
  GetDairas,
  GetCommunes,
};
