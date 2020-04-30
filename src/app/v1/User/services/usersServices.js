'use strict'

module.exports = {
	async messageValidEmailAndCpfCnpj(users, email, typePerson) {
		if (users.email === email) {
			return 'E-mail já registrado.';
		}
		return typePerson === 1 ? 'CPF já registrado.' : 'CNPJ já registrado.'
	},
	async constructorObjectUpdate(userdata) {
		let userUpdate = {};
		
		userdata.name !== undefined ? userUpdate.name = userdata.name.trim() : false;
		userdata.email !== undefined ? userUpdate.email = userdata.email.trim() : false;
		userdata.cpfCnpj !== undefined ? userUpdate.cpfCnpj = userdata.cpfCnpj : false;
		userdata.typePerson !== undefined ? userUpdate.typePerson = userdata.typePerson : false;
	
		return userUpdate;
	}
};