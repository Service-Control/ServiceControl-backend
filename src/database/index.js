'use strict'
const knex = require('knex');
const configuration = require('../../knexfile');

const config = process.env.NODE_ENV === 'test' ? configuration.test : configuration.development;

const connectionDatabase = knex(config);

module.exports = connectionDatabase;