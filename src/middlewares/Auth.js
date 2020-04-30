
require('dotenv/config');
const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    const authorization = request.headers.authorization;

    if (!authorization){
        return response.status(401).json({
            error: 'No token provided.'
        })
    }
        
    jwt.verify(authorization, process.env.AUTH, (err, decoded) => {
        if (err) return response.status(401).json({
            error: 'Token invalid.'
        });
        request.userToken = decoded;
        return next();
    });
};