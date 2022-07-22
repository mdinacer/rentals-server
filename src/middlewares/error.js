const logger = require('../services/logger');

module.exports = function (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  logger.error(err.message, err);
  res.status(err.statusCode || 500).json({ error: err.message });
};
