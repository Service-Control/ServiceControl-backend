'use strict'
const repository = require('../repository/UsersRepository');
const { messageValidEmailAndCpfCnpj, constructorObjectUpdate } = require('../services/usersServices');
const bcrypt = require('bcryptjs');
const mailer = require('../../../../modules/mailer');

module.exports = {
  async create(request, response) {
    try {
      const data = {
        name: request.body.name.trim(),
        email: request.body.email.trim(),
        cpfCnpj: request.body.cpfCnpj,
        typePerson: request.body.typePerson,
        password: request.body.password.trim(),
        status: 0
      };

    'status 0 = pendente';
    'status 1 = Ativo';
    'status 2 = Bloqueado';

      const name = data.name;
      const userToken = request.userToken.user;

      const users = await repository.getValidRegister(data.email, data.cpfCnpj);

      if (users) {
        let menssageError = await messageValidEmailAndCpfCnpj(users, data.email, data.typePerson);
        return response.status(400).json({ error: menssageError })
      };

      data.password = await bcrypt.hash(data.password, 10);

      'The type 1 administrator can register another administrator'
      userToken.type === 1 ? data.type = request.body.type : data.type = 2;

      const user = await repository.post(data);

      if (!user) {
        return response.status(400).json({ error: 'Erro ao realizar registro de usuário.' });
      };

      mailer.sendMail({
        to: `${user.email}, ${process.env.GMAIL_USER}`,
        from: '"Service Control" <service.controlLDC@gmail.com>',
        subject: `Obrigado ${name}, por fazer parte dessa plataforma!`,
        template: 'subs/subscription',
        context: {
          name
        },
      });

      return response.json({ success: 'Usuário registrado com sucesso.' });
    } catch (error) {
      return response.status(400).json({
        error: `Erro ao realizar registro de usuário. Detalhes:${error}`
      });
    };
  },

  async index(request, response) {
    try {
      const userToken = request.userToken.user;
      if (userToken.type === 1) {
        return response.json(await repository.get());
      }
      return response.json(await repository.get(userToken.id));

    } catch (error) {
      return response.status(400).json({
        error: `Erro ao realizar a listagem de usuários. Detalhes: ${error}`
      });
    }
  },

  async update(request, response) {
    try {
      const { name, email, cpfCnpj, typePerson, status } = request.body
      const userToken = request.userToken.user;
      const { id } = request.params;

      if (!{ name, email, cpfCnpj, typePerson, status }) {
        return response.status(400).json({
          error:
            'Não existem parametros para serem atualizados.'
        });
      };

      const user = await repository.get(id);
      if (!user) {
        return response.status(400).json({ error: 'Usuário não encontrado.' });
      };

      const userUpdate = await constructorObjectUpdate({ name, email, cpfCnpj, typePerson, status });

      if (userToken.type === 1 || user.id === userToken.id) {
        await repository.put(id, userUpdate);

        return response.json({ success: 'Usuário atualizado com sucesso.' });
      }

      return response.status(401).json({
        error:
          'Seu usuário não pussui a permisão para atualizar outros usuários.'
      });

    } catch (error) {
      return response.status(400).json({
        error:
          `Erro ao atualizar usuário. Detalhes: ${error}`
      });
    }
  },

  async delete(request, response) {
    try {
      const { id } = request.params;
      const userToken = request.userToken.user;


      const user = await repository.get(id);
      if (!user) {
        return response.status(400).json({ error: 'Usuário não encontrado.' });
      };

      if (userToken.type === 1 || user.id === userToken.id) {
        await repository.delete(id);
        return response.status(204).json();
      };

      return response.status(401).json({
        error: 'Seu usuário não pussui a permissão para deletar outros usuário.'
      });

    } catch (error) {
      return response.status(400).json({
        error: `Erro ao deletar usuário. Detalhes: ${error}`
      });
    };
  },
};