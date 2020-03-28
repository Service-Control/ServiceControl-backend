'use strict'

const express = require('express');
const cors = require('cors');
const { errors } = require('celebrate');

const envFile = process.env.NODE_ENV === 'development' ? `.env.dev` : '.env';
require("dotenv").config({ path: `./env/${envFile}` });

const app = express();

app.use(express.json());
app.use(cors());
app.use(errors());


app.use('/api/v1/', require('./routes/copyright'));
app.use('/api/v1/', require('./app/User/router'));
app.use('/api/v1/', require('./app/AuthUser/router'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

module.exports = app;
