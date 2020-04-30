'use strict'
require('dotenv/config');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const authRepository = require('../repository/AuthUsersRepository');
const { generateToken } = require('../../../../helpers/jwtServices');
const mailer = require('../../../../modules/mailer');

module.exports = {
  async auth(request, response) {
    try {
      const data = {
        email: request.body.email.trim(),
        password: request.body.password.trim(),
      };

      const user = await authRepository.getUserByEmail(data.email);
      if (!user)
        return response.status(400).json({
          error: 'E-mail ou senha inválidos!'
        });


      if (!await bcrypt.compare(data.password, user.password))
        return response.status(400).json({
          error: 'E-mail ou senha inválidos!'
        });

      user.password = undefined;

      const token = await generateToken({ user: user });

      return response.status(200).json({
        token: token,
        name: user.name,
        email: user.email,
        type: user.type,
      });
    } catch (error) {
      return response.status(400).json({
        error: error
      });
    }
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
        {
          id: user.id, data: {
            passwordResetToken: token,
            passwordResetExpires: now,
          }
        }
      );

      const name = user.name;
      mailer.sendMail({
        to: `${user.email}, ${process.env.GMAIL_USER}`,
        from: '"Service Control" <service.controlLDC@gmail.com>',
        subject: `Ei, ${name}, você precisa alterar sua senha?`,
        template: 'auth/forgotPassword',
        context: {
          name,
          token
        },
      });

      return response.status(200).json({
        success: `Enviamos o token de autorização para o e-mail ${data.email}`
      });

    } catch (error) {
      return response.status(400).json({ error: `Erro ao solicitar troca de senha ${error}` });
    };
  },

  async update(request, response) {
    try {
      const data = {
        email: request.body.email.trim(),
        token: request.body.token.trim(),
        password: request.body.password.trim(),
      };
      const now = new Date();
      const user = await authRepository.getUserByEmail(data.email);

      if (!user)
        return response.status(400).json({ error: 'Usuário não encontrado.' });

      if (data.token !== user.passwordResetToken)
        return response.status(400).json({ error: 'Token inválido.' });

      if (!now > user.passwordResetExpires)
        return response.status(400).json({ error: 'Token expirado.' });

      if (await bcrypt.compare(data.password, user.password))
        return response.status(400).json({ error: 'Utilize uma senha diferente da atual!' });

      data.password = await bcrypt.hash(data.password, 10);

      await authRepository.put(
        {
          id: user.id, data: {
            password: data.password,
            passwordResetToken: null,
            passwordResetExpires: null,
          }
        });

      user.password = undefined;

      return response.status(200).json({ success: 'Senha atualizada com sucesso.' });
    } catch (error) {
      response.status(400).json({ error: `Erro ao resetar senha: ${error}` });
    }
  }
};