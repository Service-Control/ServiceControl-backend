
const userService = require('../../services/User/UserServices');

module.exports = {
    async getAll(req, res) {
        const users = userService.get();
        
        return res.json(users);
    },

    async regiter(req, res) {
        const { name, email, cpf, password } = req.body;
        const data = { name, email, cpf, password };
        const user = userService.post(data);

        return res.json(user);
    },
};