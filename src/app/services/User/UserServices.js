'use strict';
const userRepository = require('../../repository/User/UserRepository');
const validate = require('../../validations/Validate');

module.exports = {
    async get() {
        return await userRepository.getAll();
    },

    async post(data) {

        if (!validate.validateEmailAddress(data.email))
            return res.status(400).send({
                error: "Email inválido!"
            });

        if (!validate.validateCnpj(data.cpf))
            return res.status(400).send({
                error: "cpf inválido!"
            });

        const userEmail = await userRepository.getEmail(data.email);
        if (userEmail)
            return res.status(400).send({
                error: "Email já cadastrado!"
            });

        const userCpf = await userRepository.getCpf(data.cpf);
        if (userCpf)
            return res.status(400).send({
                error: "Cpf já cadastrado!"
            });

        const user = await userRepository.post(data.name, data.email, data.cpf, data.password);
        return user;
    }
};