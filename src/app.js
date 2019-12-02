'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors());


require('./config/database');
require('./config/dotenv');

// Carrega as rotas
const copyright = require('./routes/copyright.js');
const user = require('./routes/User/UserRoutes');

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use('/', copyright);
app.use('/user', user);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
});