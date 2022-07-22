const { GetCurrentUser, LoginUser } = require('../../models/user/user.model');

async function httpGetCurrentUser(req, res) {
    const user = await GetCurrentUser(req.user);
    return res.status(200).json(user);
}

async function httpLoginUser(req, res) {
    const result = await LoginUser(req.body);
    return res.status(201).json(result);
}

module.exports = {
    httpGetCurrentUser,
    httpLoginUser,
};
