
require('dotenv/config');
const { UseUserEnum } = require('../enums/UserEnums');
const userEnum = UseUserEnum();

module.exports = (request, response, next) => {
    const userToken = request.userToken.user;

    if (request.userToken.user.type !== userEnum.type.superUser)
        return response.status(401).json({
            message: 'Você não possui permissão para realizar essa ação'
        })

    return next();
};