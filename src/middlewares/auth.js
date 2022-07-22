const jwt = require('jsonwebtoken');

module.exports = async function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) return res.status(401).send('Access denied. No token provided');

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY);
    // req.user = await User.findById(payload._id)
    //   .populate([
    //     {
    //       path: 'profile',
    //     },
    //     {
    //       path: 'roles',
    //     },
    //   ])
    //   .select('-password');
    next();
  } catch (ex) {
    return res.status(400).send('Invalid token');
  }
};
