'use strict'
const database = require('../../../database/index');

module.exports = {
	async getUserByEmail(email) {
    return await database('Users')
    .where('email', '=', email)
    .select('*')
    .first()
    },
    
    async put(id, data) {
		return await database('Users')
			.where('id', '=', id)
			.update(data)
			.clearCounters()
	},
};