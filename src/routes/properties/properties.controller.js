const {
  ListProperties,
  ListUserProperties,
  GetProperty,
  CreateProperty,
  UpdateProperty,
  DeleteProperty,
  SetFavorite,
  SetAvailability,
  DeleteImages,
} = require('../../models/property/property.model');

const { getPagination, setPaginationHeader } = require('../../services/query');

async function httpListProperties(req, res) {
  console.log(req.query);
  const { paginated, pageNumber, pageSize, ...params } = req.query;
  const { skip, limit } = getPagination({ pageNumber, pageSize });
  const { totalCount, items } = await ListProperties(skip, limit, params);

  setPaginationHeader(req, totalCount, res);

  return res.status(200).json(items);
}

async function httpListUserProperties(req, res) {
  const result = await ListUserProperties(req.user);
  return res.status(200).json(result);
}

async function httpGetProperty(req, res) {
  const property = await GetProperty(req.params.slug);
  return res.status(200).json(property);
}

async function httpCreateProperty(req, res) {
  const { cover, images } = req.files;
  const property = await CreateProperty(req.user, req.body, cover, images);
  return res.status(201).json(property);
}

async function httpUpdateProperty(req, res) {
  let cover = req.files.cover || null;
  let images = req.files.images || null;
  const propertyId = req.params.id;
  const property = await UpdateProperty(
    req.user,
    propertyId,
    req.body,
    cover,
    images
  );
  return res.status(200).json(property);
}

async function httpDeleteProperty(req, res) {
  const propertyId = req.params.id;
  const result = await DeleteProperty(propertyId, req.user);
  return res.status(200).json(result);
}

async function httpSetFavorite(req, res) {
  const propertyId = req.params.id;
  const isFavorite = await SetFavorite(propertyId, req.user);
  return res.status(200).json({ isFavorite });
}

async function httpSetAvailability(req, res) {
  const propertyId = req.params.id;
  const result = await SetAvailability(req.user, propertyId, req.body);
  return res.status(200).json(result);
}

async function httpDeleteImages(req, res) {
  const propertyId = req.params.id;
  const result = await DeleteImages(req.user, propertyId, req.body);
  return res.status(200).json(result);
}

module.exports = {
  httpListProperties,
  httpListUserProperties,
  httpGetProperty,
  httpCreateProperty,
  httpUpdateProperty,
  httpDeleteProperty,
  httpSetFavorite,
  httpSetAvailability,
  httpDeleteImages,
};
