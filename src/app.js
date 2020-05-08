'use strict'

require('dotenv/config');
const envFile = process.env.NODE_ENV === 'development' ? `.env.dev` : '.env';
require("dotenv").config({ path: `./env/${envFile}` });

const express = require('express');
const cors = require('cors');
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { errors } = require('celebrate');

const app = express();

const swaggerDefinition = require('./swagger.json');

const swaggerOptions = {
      swaggerDefinition,
      apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.get('/api-doc.json', function (req, res) {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec,  {
      explorer: false,
      customCss: '.swagger-ui .topbar {display :none} ',
      customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.1/themes/3.x/theme-material.css',
      customSiteTitle: 'Service Control - API Documentation',
}));

app.use(express.json());
app.use(cors());
app.use(errors());

app.use('/api/v1/', require('./routes/copyright'));
app.use('/api/v1/users/', require('./app/v1/User/router'));
app.use('/api/v1/users/auth', require('./app/v1/AuthUser/router'));
app.use('/api/v1/company', require('./app/v1/Company/router'));

app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-access-token');
      res.header('Access-Contryarn deol-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      next();
});

module.exports = app;
