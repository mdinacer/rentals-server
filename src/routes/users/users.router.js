const express = require('express');
const auth = require('../../middlewares/auth');
const {
  httpRegisterUser,
  httpUpdateUser,
  httpDeleteUser,
} = require('./users.controller');

const usersRouter = express.Router();

usersRouter.post('/', httpRegisterUser);
usersRouter.delete('/:id', auth, httpDeleteUser);

module.exports = usersRouter;
