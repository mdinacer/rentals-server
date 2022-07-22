const express = require('express');

const {
  httpGetWilayas,
  httpGetDairas,
  httpGetCommunes,
} = require('./addresses.controller');

const addressesRouter = express.Router();

addressesRouter.get('/wilaya', httpGetWilayas);
addressesRouter.get('/:id/daira', httpGetDairas);
addressesRouter.get('/:id/commune', httpGetCommunes);

module.exports = addressesRouter;
