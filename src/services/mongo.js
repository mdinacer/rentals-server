const mongoose = require('mongoose');
const logger = require('./logger');

require('dotenv').config();

// Update below to match your own MongoDB connection string.
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
  logger.info('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
  logger.error(err);
});

async function mongoConnect() {
  await mongoose.connect(
    MONGO_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => console.log(' Mongoose is connected')
  );
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
