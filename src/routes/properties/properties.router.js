const express = require('express');

const auth = require('../../middlewares/auth');
const { UploadMemory: upload } = require('../../services/multer');

const uploadFields = [
  {
    name: 'cover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 10,
  },
];

const {
  httpListProperties,
  httpListUserProperties,
  httpGetProperty,
  httpCreateProperty,
  httpUpdateProperty,
  httpDeleteProperty,
  httpSetFavorite,
  httpSetAvailability,
  httpDeleteImages,
} = require('./properties.controller');

const propertiesRouter = express.Router();

propertiesRouter.get('/', httpListProperties);
propertiesRouter.get('/me', auth, httpListUserProperties);
propertiesRouter.get('/:slug', httpGetProperty); // property slug
propertiesRouter.post(
  '/',
  [auth, upload.fields(uploadFields)],
  httpCreateProperty
);
propertiesRouter.put(
  '/:id',
  [auth, upload.fields(uploadFields)],
  httpUpdateProperty
); // propertyId
propertiesRouter.delete('/:id', auth, httpDeleteProperty); // propertyId
propertiesRouter.put('/:id/favorite', auth, httpSetFavorite); // propertyId
propertiesRouter.put('/:id/deleteImages', auth, httpDeleteImages); // propertyId
propertiesRouter.put('/:id/availability', auth, httpSetAvailability); // propertyId

module.exports = propertiesRouter;
