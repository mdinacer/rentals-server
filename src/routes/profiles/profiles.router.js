const express = require('express');

const auth = require('../../middlewares/auth');
const { UploadMemory: upload } = require('../../services/multer');

const {
  httpGetProfile,
  httpPostProfile,
  httpPutProfile,
} = require('./profiles.controller');

const profilesRouter = express.Router();

profilesRouter.get('/:id', httpGetProfile);
profilesRouter.post('/', [auth, upload.single('image')], httpPostProfile);
profilesRouter.put('/', [auth, upload.single('image')], httpPutProfile);

module.exports = profilesRouter;
