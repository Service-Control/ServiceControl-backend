const User = require('../../model/User');

module.exports = {
    async getAll() {

        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'cpf']
        });
        return users;
    },

    async getEmail(email) {
        const users = await User.findOne({
            where: {
              email: email
            }
        })

        return users;
    },

    async getCpf(cpf) {
        const users = await User.findOne({
            where: {
                cpf: cpf
            }
        })

        return users;
    },

    async post(name, email, cpf, password) {

        const user = await User.create({ name, email, cpf, password });

        return user;
    }
};