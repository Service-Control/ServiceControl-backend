'use strict'
var knex = require('../../../../database');

const Users = () => {
	return knex('users');
};

module.exports = {

	async get(id) {
		let users;
		id ?
			users = await Users()
				.where('id', '=', id)
				.select('id', 'name', 'email', 'cpfCnpj', 'typePerson', 'type','status')
				.first()
			:
			users = await Users()
				.select('id', 'name', 'email', 'cpfCnpj', 'typePerson', 'type', 'status')
				.orderBy('name');

		return users;
	},

	async getStatus(status) {
		const users = await Users()
			.where('status', '=', status)
			.select('id', 'name', 'email', 'cpfCnpj', 'typePerson', 'type', 'status')

		return users;
	},

	async getFilter(where, data) {
		const users = await Users()
			.where(where, 'ILIKE', `%${data}%`)
			.select('id', 'name', 'email', 'cpfCnpj', 'typePerson', 'type', 'status')

		return users;
	},
	
	async getByEmailAndCpfCnpj(email, cpfCnpj) {
		const users = await Users()
			.where('email', '=', email).orWhere('cpfCnpj', '=', cpfCnpj)
			.select('name', 'email', 'cpfCnpj')
			.first();

		return users;
	},

	async post(data) {
		const users = await Users().insert(data);

		return users;
	},

	async put(id, data) {
		const users = await Users()
			.where('id', '=', id)
			.update(data)
			.clearCounters();

		return users;
	},

	async delete(id) {
		const users = await Users()
			.where('id', id)
			.del();

		return users;
	}
};