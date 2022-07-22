const express = require('express');
const auth = require('../../middlewares/auth');

const {
  httpGetPropertyReviews,
  httpCreateReview,
  httpEditReview,
  httpDeleteReview,
} = require('./reviews.controller');

const reviewsRouter = express.Router();

reviewsRouter.get('/:id', httpGetPropertyReviews);
reviewsRouter.post('/:id', auth, httpCreateReview);
reviewsRouter.put('/:id', auth, httpEditReview);
reviewsRouter.delete('/:id', auth, httpDeleteReview);

module.exports = reviewsRouter;
