const fs = require('fs');
const _ = require('lodash');

const { Wilaya, Daira, Commune } = require('../models/address/address.mongo');

async function readCities() {
  let rawData = fs.readFileSync('./cities_data.json');
  let data = JSON.parse(rawData);

  if (Array.isArray(data) && data.length > 0) {
    for (const item of data) {
      await addItem(item);
    }
  }
}

module.exports = {
  readCities,
};

async function addItem(item) {
  let wilaya = await Wilaya.findOne({ code: item.wilaya_code });

  if (!wilaya) {
    wilaya = await Wilaya.create({
      name: item.wilaya_name_ascii,
      nameAr: item.wilaya_name,
      code: item.wilaya_code,
    });
  }

  let daira = await Daira.findOne({ name: item.daira_name_ascii });

  if (!daira) {
    daira = await Daira.create({
      name: item.daira_name_ascii,
      nameAr: item.daira_name,
      wilaya: wilaya._id,
    });
  }

  let commune = await Commune.findOne({ name: item.commune_name_ascii });

  if (!commune) {
    commune = await Commune.create({
      name: item.commune_name_ascii,
      nameAr: item.commune_name,
      wilaya: wilaya._id,
      daira: daira._id,
    });
  }
}
