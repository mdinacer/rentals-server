const { Review, validateReview } = require('./review.mongo');
const { Property } = require('../property/property.mongo');

async function GetPropertyReviews(propertyId) {
  return await Review.find({ property: propertyId })
    .populate('host')
    .sort({ creationDate: -1 })
    .skip(skip)
    .limit(limit);
}

async function CreateReview(user, propertyId, data) {
  validate(data);
  const property = await Property.findById(propertyId);

  if (!property) {
    const error = Error('No matching property found');
    error.statusCode = 404;
    throw error;
  }
  const review = new Review({
    ...data,
    host: user.profile._id,
    hostName: `${user.profile.firstName} ${user.profile.lastName}`,
    property: property._id,
  });

  await review.save();
  await Property.findOneAndUpdate(
    { _id: property.id },
    {
      $set: {
        rating:
          property.rating > 0
            ? Math.ceil((property.rating + review.rating) / 2)
            : review.rating,
      },
      $push: {
        reviews: review._id,
      },
    }
  );

  // socketApi.io.emit('propertyRequired', propertyData);
  // socket.broadcast
  // .to(user.room)
  // .emit('message', { user: 'admin', text: `${user.name}, has joined` });

  return review;
}

async function EditReview(user, reviewId, data) {
  validate(data);

  let review = await Review.findOne({ _id: reviewId, host: user.profile._id });

  if (!review) {
    const error = Error('No matching review found');
    error.statusCode = 404;
    throw error;
  }
  await review.updateOne(data);
  return review;
}

async function DeleteReview(user, id) {
  validate(data);

  let review = await Review.findOne({ _id: id, host: user.profile._id });

  if (!review) {
    const error = Error('No matching review found');
    error.statusCode = 404;
    throw error;
  }
  return await review.updateOne({ deleted: true });
}

function validate(values) {
  const { error: validationError } = validateReview(values);

  if (validationError) {
    const error = Error(validationError.details[0].message);
    error.statusCode = 400;
    throw error;
  }
}

module.exports = {
  GetPropertyReviews,
  //GetReviewsByUser,
  CreateReview,
  EditReview,
  DeleteReview,
};
