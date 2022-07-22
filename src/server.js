const http = require('http');
const https = require('https');

const parser = require('./services/citiesParser');

// const fs = require('fs');

// const options = {
//   key: fs.readFileSync(__dirname + '/key.pem', 'utf8'),
//   cert: fs.readFileSync(__dirname + '/cert.pem', 'utf8'),
// };

require('express-async-errors');
require('dotenv').config();

const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const logger = require('./services/logger');
const socketApi = require('./services/socket');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);
//const sServer = https.createServer(options, app);

socketApi.io.attach(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

async function startServer() {
  await mongoConnect();

  parser.readCities();

  require('./services/validation')();

  if (!process.env.JWT_KEY) {
    logger.error('FATAL ERROR: JWT private key not defined.');
    process.exit(1);
  }

  server.listen(PORT, () => {
    logger.info(`Listening on port ${PORT}...`);
  });

  // sServer.listen(8443, () => {
  //   console.log('HTTPS Server running on port 443');
  // });
}

startServer();
