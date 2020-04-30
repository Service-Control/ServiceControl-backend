'use strict'
require('dotenv/config');
const jwt = require('jsonwebtoken');

module.exports = {
	async generateToken(params) {
		let test = jwt.sign(params, process.env.AUTH, {
			expiresIn: 43200
		});
		return test
	},
	async decoderToken(params) {
		return jwt.sign(params, process.env.AUTH, {
			expiresIn: 43200
		});
	}
};
