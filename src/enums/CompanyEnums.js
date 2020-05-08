'use strict'

module.exports = {
  UseCompanyEnum() {
    return {
      status: {
        pending: 0,
        active: 1,
        blocked: 2,
      },
      typeCompany: {
        fisical: 1,
        legal: 2,
      }
    };
  }
};