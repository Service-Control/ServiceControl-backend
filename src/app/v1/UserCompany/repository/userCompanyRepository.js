'use strict'
var knex = require('../../../../database');

const UserCompany = () => {
	return knex('userCompany');
};

module.exports = {
	async getByUserIdandConpanyId(userId, companyId) {
		const userCompany = await UserCompany()
			.where('userId', '=', userId).andWhere('companyId', '=', companyId)
			.select('status', 'userId', 'cpfCcompanyIdnpj')
			.first();

		return userCompany;
	},

	async post(data) {
		const userCompany = await UserCompany().insert(data);

		return userCompany;
	},

	async put(id, data) {
		const userCompany = await UserCompany()
			.where('id', '=', id)
			.update(data)
			.clearCounters();

		return userCompany;
	},

	async delete(id) {
		const userCompany = await UserCompany()
			.where('id', id)
			.del();

		return userCompany;
	}
};