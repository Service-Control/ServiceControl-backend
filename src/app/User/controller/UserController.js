'use strict'
const repository = require('../repository/UsersRepository');
const { messageValidRegister } = require('../services/usersServices');
const bcrypt = require('bcryptjs');
const mailer = require('../../../modules/mailer');

module.exports = {
  async create(request, response) {
    try {
      const data = {
        name: request.body.name.trim(),
        email: request.body.email.trim(),
        cpfCnpj: request.body.cpfCnpj,
        typePerson: request.body.typePerson,
        password: request.body.password.trim()
      };
      const name = data.name;
      const userToken = request.userToken.user;

      const users = await repository.getValidRegister(data.email, data.cpfCnpj)

      if (users) {
        let menssageError = await messageValidRegister(users, data.email, data.typePerson);
        return response.status(400).json({ error: menssageError })
      };

      data.password = await bcrypt.hash(data.password, 10);

      userToken.type === 1 ? data.type = request.body.type : data.type = 2;

      const user = await repository.post(data);

      if (!user) {
        return response.status(400).json({ error: 'Erro ao realizar registro de usuário.' });
      }

      mailer.sendMail({
        to: `${email};datatongji@gmail.com`,
        from: '"Data Tongjì 统计" <no-reply@datatongji.com>',
        subject: 'subject Data Tongjì',
        template: 'auth/talkwithus_tks',
        context: {
          name
        },
      }, (err) => {
        if (err)
          return response.status(400).send({
            error: 'rr.message'
          });
      });

      return response.json({ success: 'Usuário registrado com sucesso.' });
    } catch (error) {
      return response.status(400).json({ error: `Erro ao realizar registro de usuário. Detalhes:${error}` })
    }
  },

  async index(request, response) {
    try {
      const userToken = request.userToken.user;
      if (userToken.type === 1) {
        return response.json(await repository.get());
      }
      return response.json(await repository.get(userToken.id));

    } catch (error) {
      return response.status(400).json({ error: `Erro ao realizar a listagem de usuários. Detalhes: ${error}` });
    }
  },

  async update(request, response) {
    try {
      const data = {
        name: request.body.name,
        email: request.body.email,
        cpfCnpj: request.body.cpfCnpj,
        typePerson: request.body.type,
        type: request.body.type,
      };
      const userToken = request.userToken.user;
      const { id } = request.params;


      if (!data) {
        return response.status(400).json({ error: 'Não existem parametros para serem atualizados' });
      };

      const user = await repository.get(id);
      if (!user) {
        return response.status(400).json({ error: 'Usuário não encontrado.' });
      };

      if (userToken.type === 1 || user.id === userToken.id) {
        await repository.put(id, data);
        return response.json({ success: 'Usuário atualizado com sucesso.' });
      }

      return response.status(401).json({ error: 'Seu usuário não pussui a permisão para atualizar outros usuários.' });

    } catch (error) {
      return response.status(400).json({ error: `Erro ao atualizar usuário. Detalhes: ${error}` });
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
      return response.status(400).json({ error: `Erro ao deletar usuário. Detalhes: ${error}` });
    }
  },
};