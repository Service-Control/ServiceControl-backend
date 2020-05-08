'use strict'
var knex = require('../../../../database');

const Companies = () => {
	return knex('companies');
};

module.exports = {

	async get() {
		return await Companies()
			.select('id', 'name', 'email', 'cpfCnpj', 'typeCompany', 'status')
			.orderBy('name');

	},

	async getStatus(status) {
		const companies = await Companies()
			.where('status', '=', status)
			.select('id', 'name', 'email', 'cpfCnpj', 'typeCompany', 'type', 'status')

		return companies;
	},

	async getFilter(where, data) {
		const companies = await Companies()
			.where(where, 'ILIKE', `%${data}%`)
			.select('id', 'name', 'email', 'cpfCnpj', 'typeCompany', 'type', 'status')

		return companies;
	},

	async getByCpfCnpj(cpfCnpj) {
		const companies = await Companies()
			.where('cpfCnpj', '=', cpfCnpj)
			.select('name', 'email', 'cpfCnpj')
			.first();

		return companies;
	},

	async post(data) {
		const companies = await Companies().insert(data);

		return companies;
	},

	async put(id, data) {
		const companies = await Companies()
			.where('id', '=', id)
			.update(data)
			.clearCounters();

		return companies;
	},

	async delete(id) {
		const companies = await Companies()
			.where('id', id)
			.del();

		return companies;
	}
};