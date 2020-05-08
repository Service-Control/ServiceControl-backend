'use strict'
const database = require('../../../../database/index');

module.exports = {
  async testBoom(response) {
    return response.boom.notFound();

  }
    
};