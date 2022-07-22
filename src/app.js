const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
var bodyParser = require('body-parser');

const errorMiddleware = require('./middlewares/error');

const api = require('./routes/api');

const app = express();

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'img-src': ["'self'", 'data:', 'https://res.cloudinary.com'],
    },
  })
);

app.use(
  cors({
    origin: '*', //'http://localhost:3000/',
    optionsSuccessStatus: 200,
    exposedHeaders: ['Pagination'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    preflightContinue: true,
  })
);

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }));

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }));

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/v1', api);

app.use(errorMiddleware);

module.exports = app;
