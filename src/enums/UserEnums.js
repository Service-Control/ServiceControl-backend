'use strict'

module.exports = {
  UseUserEnum() {
    return {
      status: {
        pending: 0,
        active: 1,
        blocked: 2,
      },
      type: {
        superUser: 1,
        admin: 2,
        user: 3,
        client: 4,
      },
      typePerson: {
        fisical: 1,
        legal: 2,
      }
    };
  }
};