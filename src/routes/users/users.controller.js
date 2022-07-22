const pick = require('lodash/pick');

const {
  RegisterUser,
  UpdateUser,
  DeleteUser,
} = require('../../models/user/user.model');

async function httpRegisterUser(req, res) {
  let user = await RegisterUser(req.body);
  const token = user.generateAuthToken();
  user = pick(user, ['_id', 'username', 'email']);
  return res.header('x-auth-token', token).status(201).json(user);
}

async function httpUpdateUser(req, res) {
  const user = req.body;
  const result = await UpdateUser(user, req.body);
  return res.status(201).json(result);
}

async function httpDeleteUser(req, res) {
  const id = req.params.id;
  const result = await DeleteUser(id);
  return res.status(201).json(result);
}

module.exports = {
  httpRegisterUser,
  httpUpdateUser,
  httpDeleteUser,
};
