
'use strict';

exports.generateToken = async (params = {}) => {
    return jwt.sign(params, process.env.AUTH, {
        expiresIn: 43200
    });
};
