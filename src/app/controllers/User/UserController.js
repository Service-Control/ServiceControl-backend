const userRepository = require('../../repository/User/UserRepository')

module.exports = {
    async getAll(req, res) {

        const users = await userRepository.getAll();

        return res.json(users);
    },

    async regiter(req, res) {
        const { name, email, cpf, password } = req.body;

        const userEmail = await userRepository.getEmail(email);
        console.log(userEmail)
        if (userEmail)
            return res.status(400).send({
                error: "Email já cadastrado!"
            });

        const userCpf = await userRepository.getCpf(cpf);
        if (userCpf)
            return res.status(400).send({
                error: "Cpf já cadastrado!"
            });


        const user = await userRepository.post(name, email, cpf, password);
        return res.json(user);
    },
};