const { Property, validateProperty } = require('./property.mongo');
const { Review } = require('../review/review.mongo');
const { Country, Province, City } = require('../address/address.mongo');
const { SaveImage, DeleteImage } = require('../../services/cloudinary');

async function ListProperties(skip, limit, params) {
  const { orderBy, ...rest } = params;
  const filters = setFilters(rest);

  const properties = await Property.find(filters)
    .sort({
      orderBy: 1,
    })
    .skip(skip)
    .limit(limit)
    .select({
      owner: 0,
      images: 0,

      services: 0,
    });

  const totalCount = await Property.countDocuments(filters);
  return { items: properties, totalCount };
}

async function ListUserProperties(user) {
  const properties = await Property.find({ owner: user.profile._id })
    .sort({ title: 1 })
    .select({
      owner: 0,
      images: 0,
      details: 0,
      services: 0,
    });

  return properties;
}

async function GetProperty(slug) {
  const property = await Property.findOne({ slug: slug }).populate([
    {
      path: 'owner',
    },
    {
      path: 'reviews',
      select: { creationDate: 1, host: 1, hostName: 1, rating: 1, body: 1 },
    },
  ]);

  if (!property) {
    const error = Error('No matching property found');
    error.statusCode = 404;
    throw error;
  }

  return property;
}

async function CreateProperty(user, data, cover, images) {
  validate(data);

  const property = new Property(data);
  property.set({ owner: user.profile._id });

  if (cover && cover.length > 0) {
    try {
      const result = await SaveImage(cover[0].buffer, 'properties');
      property.set({ cover: result });
    } catch (ex) {
      const error = Error(ex);
      error.statusCode = 400;
      throw error;
    }
  }

  if (images && images.length > 0) {
    try {
      const results = [];
      for (const image of images) {
        const result = await SaveImage(image.buffer, 'properties');
        results.push(result);
      }
      property.set({ images: results });
    } catch (ex) {
      const error = Error(ex);
      error.statusCode = 400;
      throw error;
    }
  }

  // if (property.address) {
  //   await AddAddress(property.address);
  // }

  await property.save();
  return property;
}

async function UpdateProperty(user, propertyId, data, cover, images) {
  validate(data);

  const property = await Property.findOne({
    _id: propertyId,
    owner: user.profile,
  });

  if (!property) {
    const error = Error('No matching property found');
    error.statusCode = 404;
    throw error;
  }

  if (cover && cover.length > 0) {
    try {
      if (property.cover?.publicId) {
        await DeleteImage(property.cover.publicId);
      }
      const result = await SaveImage(cover[0].buffer, 'properties');
      data.cover = result;
    } catch (ex) {
      const error = Error(ex);
      error.statusCode = 400;
      throw error;
    }
  }
  const imagesResults = [];
  if (images && images.length > 0) {
    try {
      for (const image of images) {
        const result = await SaveImage(image.buffer, 'properties');
        imagesResults.push(result);
      }
    } catch (ex) {
      const error = Error(ex);
      error.statusCode = 400;
      throw error;
    }
  }

  await property.updateOne({
    ...data,
    $push: { images: imagesResults },
  });

  return Property.findById(propertyId);
}

async function DeleteProperty(user, propertyId) {
  const property = await Property.findOne({
    _id: propertyId,
    owner: user.profile,
  });

  if (!property) {
    const error = Error('No matching property found');
    error.statusCode = 404;
    throw error;
  }

  try {
    if (property.cover?.publicId) {
      await DeleteImage(property.cover.publicId);
    }

    if (property.images.length > 0) {
      for (const image of property.images) {
        await DeleteImage(image.publicId);
      }
    }
  } catch (ex) {
    const error = Error(ex);
    error.statusCode = 400;
    throw error;
  }

  if (property.review.length > 0) {
  }

  await Property.findOneAndDelete({ _id: property._id });
  await Review.deleteMany({ property: property._id });
}

async function SetFavorite(propertyId, user) {
  const property = await Property.findById(propertyId);

  if (!property) {
    const error = Error('No matching property found');
    error.statusCode = 404;
    throw error;
  }

  const isFavorite = user.profile.favorites.includes(propertyId);

  if (isFavorite) {
    await user.profile.updateOne({ $pull: { favorites: propertyId } });
    return false;
  } else {
    await user.profile.updateOne({ $push: { favorites: propertyId } });
    return true;
  }
}

async function SetAvailability(user, propertyId, data) {
  const { available, availableFrom } = data;

  let property = await Property.findOne({
    _id: propertyId,
    owner: user.profile._id,
  });

  if (!property) {
    const error = Error('No matching property found');
    error.statusCode = 404;
    throw error;
  }

  if (available === true) {
    await property.updateOne({ available, availableFrom: null });
  }

  if (!available && availableFrom) {
    await property.updateOne({ available, availableFrom });
  }

  property = await Property.findById(propertyId);

  return {
    available: property.available,
    availableFrom: property.availableFrom,
  };
}

async function DeleteImages(user, propertyId, data) {
  const property = await Property.findOne({
    _id: propertyId,
    owner: user.profile._id,
  });

  if (!property) {
    const error = Error('No matching property found');
    error.statusCode = 404;
    throw error;
  }

  let { images } = data;

  if (images && images.length > 0) {
    for (const imageId of images) {
      const response = await DeleteImage(imageId);
      if (response.result === 'ok') {
        await property.updateOne({
          $pull: {
            images: { publicId: imageId },
          },
        });
        images = images.filter((i) => i !== imageId);
      }
    }
  }
  return images.length <= 0;
}

function validate(values) {
  const { error: validationError } = validateProperty(values);

  if (validationError) {
    const error = Error(validationError.details[0].message);
    error.statusCode = 400;
    throw error;
  }
}

async function AddAddress(address) {
  let country = await Country.findOne({ name: address.country });
  if (!country) {
    country = await Country.create({ name: address.country });
  }

  let province = await Province.findOne({
    name: address.province,
    country: country._id,
  });
  if (!province) {
    province = await Province.create({
      name: address.province,
      country: country._id,
    });
  }

  let city = await City.findOne({ name: address.city, province: province._id });
  if (!city) {
    city = await City.create({
      name: address.city,
      province: province._id,
    });
  }
}

function setFilters(values) {
  const { minPrice, maxPrice, ...rest } = values;
  let filters = { ...rest };

  if (minPrice) {
    filters['price.amount'] = { $gte: minPrice };
  }

  if (maxPrice) {
    filters['price.amount'] = { $lte: maxPrice };
  }

  return filters;
}

module.exports = {
  ListProperties,
  ListUserProperties,
  GetProperty,
  CreateProperty,
  UpdateProperty,
  DeleteProperty,
  SetFavorite,
  SetAvailability,
  DeleteImages,
};
