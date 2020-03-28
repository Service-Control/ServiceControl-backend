'use strict'
const database = require('../../../database/index');
module.exports = {

	async get(id) {
		let users;
		id ?
			users = await database('Users')
				.where('id', '=', id)
				.select('id', 'name', 'email','cpfCnpj', 'typePerson', 'type')
				.first()
			:
			users = await database('Users')
				.select('id', 'name', 'email','cpfCnpj', 'typePerson', 'type');

	return users;
	},
	
	async getValidRegister(email, cpfCnpj) {
		return await database('Users')
			.where('email', '=', email).orWhere('cpfCnpj', '=', cpfCnpj)
			.select('name', 'email','cpfCnpj')
			.first();
	},

	async post(data) {
		return await database('Users').insert(data);
	},

	async put(id, data) {
		return await database('Users')
			.where('id', '=', id)
			.update(data)
			.clearCounters()
	},

	async delete(id) {
		return await database('Users')
			.where('id', id)
			.del()
	}
};