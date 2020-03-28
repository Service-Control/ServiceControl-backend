'use strict'
require('dotenv/config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const authRepository = require('../repository/AuthUsersRepository');
const jwtServices = require('../../helpers/jwtServices');
const mailer = require('../../../modules/mailer');

module.exports = {
  async auth(request, response) {
    const data = {
      email: request.body.email.trim(),
      password: request.body.password.trim(),
    };

    const user = await authRepository.getUserByEmail(data.email);

    if (!user) {
      return response.status(401).json({
        error: 'Usuário ou senha inválidos!'
      });
    }

    if (!await bcrypt.compare(data.password, user.password)) {
      return response.status(401).json({
        error: 'Usuário ou senha inválidos!'
      });
    }
    user.password = undefined;

    const token = await jwtServices.generateToken({ user: user });

    return response.status(200).json({
      token: token,
      name: user.name,
      email: user.email,
    });
  },

  async forgotPassword(request, response) {
    try {
      const data = {
        email: request.body.email.trim(),
      };

      const user = await authRepository.getUserByEmail(data.email);

      if (!user)
        return response.status(400).json({ error: 'Usuário não encontrado!' });

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();
      now.setHours(now.getHours() + 1);

      await authRepository.put(
        user.id,
        {
          passwordResetToken: token,
          passwordResetExpires: now,
        }
      );

      const name = user.name;
      mailer.sendMail({
        to: `${data.email};dot.hour@gmail.com`,
        from: '"Data Tongjì 统计" <no-reply@dot.hour.com>',
        subject: 'subject Data Tongjì',
        template: 'auth/forgot_password',
        context: {
          name,
          token
        },
      }, (err) => {
        if (err)
          return response.status(400).send({
            error: 'rr.message'
          });
      });

      return response.status(200).json({
        success: `Enviamos o token de autorização para o e-mail ${token}`
      });

    } catch (error) {
      return response.status(400).json({ error: `Erro ao solicitar troca de senha ${error}` });
    };
  },

  async resetPassword(request, response) {
    try {
      const data = {
        email: request.body.email.trim(),
        token: request.body.token.trim(),
        password: request.body.password.trim(),
      };
      const now = new Date();
      const user = await authRepository.getUserByEmail(data.email);

      if (!user)
        return response.status(400).json({ error: 'Usuário inválido!' });

      if (data.token !== user.passwordResetToken)
        return response.status(400).json({ error: 'Token inválido!' });

      if (!now > user.passwordResetExpires)
        return response.status(400).json({ error: 'Token expirado!' });

      if (await bcrypt.compare(data.password, user.password))
        return response.status(400).json({ error: 'Utilize uma senha diferente da atual!' });

      data.password = await bcrypt.hash(data.password, 10);

      await authRepository.put(
        user.id,
        {
          password: data.password,
          passwordResetToken: null,
          passwordResetExpires: null,
        });

      user.password = undefined

      return response.status(200).json({ success: 'Senha atualizada com sucesso.' });
    } catch (error) {
      response.status(400).json({ error: `Erro ao resetar senha: ${error}` });
    }
  }
};