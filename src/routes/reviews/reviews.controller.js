const {
  GetPropertyReviews,
  //GetReviewsByUser,
  CreateReview,
  EditReview,
  DeleteReview,
} = require('../../models/review/review.model');

const { getPagination, setPaginationHeader } = require('../../services/query');

async function httpGetPropertyReviews(req, res) {
  const houseId = req.params.id;
  const { pageNumber, pageSize } = req.query;
  const { skip, limit } = getPagination({ pageNumber, pageSize });
  const { totalCount, items } = await GetPropertyReviews(houseId, skip, limit);
  setPaginationHeader(req, totalCount, res);

  return res.status(200).json(items);
}

// async function httpGetReviewsByUser(req, res) {
//   const { pageNumber, pageSize } = req.query;
//   const { skip, limit } = getPagination({ pageNumber, pageSize });
//   const { totalCount, items } = await GetReviewsByUser(req.user, skip, limit);
//   setPaginationHeader(req, totalCount, res);

//   return res.status(200).json(items);
// }

async function httpCreateReview(req, res) {
  const houseId = req.params.id;
  const review = await CreateReview(req.user, houseId, req.body);

  return res.status(201).json(review);
}

async function httpEditReview(req, res) {
  const reviewId = req.params.id;
  const review = await EditReview(req.user, reviewId, req.body);

  return res.status(200).json(review);
}

async function httpDeleteReview(req, res) {
  const reviewId = req.params.id;
  const review = await DeleteReview(req.user, reviewId);

  return res.status(200).json(review);
}

module.exports = {
  httpGetPropertyReviews,

  httpCreateReview,
  httpEditReview,
  httpDeleteReview,
};
