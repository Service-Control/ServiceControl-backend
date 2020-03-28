'use strict'

module.exports = {
	async messageValidRegister(users, email, typePerson) {
		if (users.email === email) {
			return 'E-mail já registrado.';
		}
		return typePerson === 1 ? 'CPF já registrado.' : 'CNPJ já registrado.'
	}
};