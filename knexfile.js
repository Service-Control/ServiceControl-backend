'use strict';

module.exports = {
  test: {
    client: 'pg',
    connection: process.env.POSTGRES_CONNECTION,
    migrations: {
      directory: `${__dirname}/src/database/migrations`,
    }
  },
  development: {
    client: 'pg',
    connection: process.env.POSTGRES_CONNECTION,
    migrations: {
      directory: `${__dirname}/src/database/migrations`,
    }
  },
  production: {
    client: 'pg',
    connection: process.env.POSTGRES_CONNECTION,
    migrations: {
      directory: `${__dirname}/src/database/migrations`,
    }
  }
};