const express = require('express');
const authenticated = require('../../middlewares/auth');
const { httpGetCurrentUser, httpLoginUser } = require('./auth.controller');

const usersRouter = express.Router();

usersRouter.get('/me', authenticated, httpGetCurrentUser);
usersRouter.post('/', httpLoginUser);

module.exports = usersRouter;
