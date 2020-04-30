'use strict'
const database = require('../../../../database/index');
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
		const users = await database('Users')
			.where('email', '=', email).orWhere('cpfCnpj', '=', cpfCnpj)
			.select('name', 'email','cpfCnpj')
			.first();

		return users;
	},

	async post(data) {
		const users = await database('Users').insert(data);

		return users;
	},

	async put(id, data) {
		console.log(data)
		const users = await database('Users')
			.where('id', '=', id)
			.update(data)
			.clearCounters();

		return users;
	},

	async delete(id) {
		const users = await database('Users')
			.where('id', id)
			.del();

		return users;
	}
};