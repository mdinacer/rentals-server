const express = require('express');

const authRouter = require('./auth/auth.router');
const usersRouter = require('./users/users.router');
const propertiesRouter = require('./properties/properties.router');
const profilesRouter = require('./profiles/profiles.router');
const reviewsRouter = require('./reviews/reviews.router');
const addressesRouter = require('./addresses/addresses.router');

const api = express.Router();

api.use('/auth', authRouter);
api.use('/users', usersRouter);
api.use('/profiles', profilesRouter);
api.use('/properties', propertiesRouter);
api.use('/reviews', reviewsRouter);
api.use('/addresses', addressesRouter);

module.exports = api;
