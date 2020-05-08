'use strict';
const repository = require('../repository/UsersRepository');
const services = require('../services/usersServices');
const { messageValidEmailAndCpfCnpj } = require('../../../../validations/Validate');

const bcrypt = require('bcryptjs');
const mailer = require('../../../../modules/mailer');

const { UseUserEnum } = require('../../../../enums/UserEnums');
const userEnum = UseUserEnum();


module.exports = {
  async create(request, response) {
    try {
      const userPost = {
        name: request.body.name.trim().toLowerCase(),
        email: request.body.email.trim(),
        cpfCnpj: request.body.cpfCnpj,
        typePerson: await services.validTypePerson(request.body.typePerson),
        type: request.body.type,
        password: request.body.password.trim(),
      };
      // const userToken = await repository.get(request.userToken.user.id);

      const users = await repository.getByEmailAndCpfCnpj(userPost.email, userPost.cpfCnpj);
      if (users) {
        const menssageError = await messageValidEmailAndCpfCnpj(
          users.email,
          userPost.email,
          userPost.typePerson
        );

        return response.status(400).json({ message: menssageError })
      };

      // if (!await services.validPostType(userPost.type)) {
      //   return response.status(400).json({ message: 'Tipo de usuário invalido.' })
      // };

      // if (!await services.validateUserRegistrationType(userToken.type, userPost.type)) {
      //   return response.status(400).json({
      //     message: 'Voce não tem permissaõ para criar utros usuários.'
      //   });
      // };

      userPost.password = await bcrypt.hash(userPost.password, 10);

      const user = await repository.post(userPost);
      if (!user) {
        return response.status(400).json({
          message: 'Erro ao realizar registro de usuário.'
        });
      };

      // const name = userPost.name;
      // mailer.sendMail({
      //   to: `${user.email}, ${process.env.GMAIL_USER}`,
      //   from: '"Service Control" <service.controlLDC@gmail.com>',
      //   subject: `Obrigado ${name}, por fazer parte dessa plataforma!`,
      //   template: 'subs/subscription',
      //   context: {
      //     name
      //   },
      // });

      return response.json({ message: 'Usuário registrado com sucesso.' });
    } catch (error) {

      return response.status(400).json({
        message: `Erro ao realizar registro de usuário. Detalhes: ${error}`
      });
    };
  },

  async indexProfile(request, response) {
    try {
      let userToken = await repository.get(request.userToken.user.id);
      userToken.url = 'https://i.ibb.co/yk4PgbL/Lucas.jpg'
      userToken.bio = 'Develolper'
      return response.json(userToken);
    } catch (error) {

      return response.status(400).json({
        message: `Erro ao realizar a listagem de usuários. Detalhes: ${error}`
      });
    }
  },

  async index(request, response) {
    try {
      const userToken = await repository.get(request.userToken.user.id);


      if (userToken.type === userEnum.type.superUser) {
        return response.json(await repository.get());
      }
      return response.json([await repository.get(userToken.id)]);
    } catch (error) {

      return response.status(400).json({
        message: `Erro ao realizar a listagem de usuários. Detalhes: ${error}`
      });
    }
  },

  async update(request, response) {
    try {
      const { name, email, cpfCnpj, typePerson, status } = request.body
      const { id } = request.params;
      const userToken = await repository.get(request.userToken.user.id);

      if (!{ name, email, cpfCnpj, typePerson, status }) {

        return response.status(400).json({
          message: 'Não existem parametros para serem atualizados.'
        });
      };

      const user = await repository.get(id);
      if (!user) {

        return response.status(400).json({ message: 'Usuário não encontrado.' });
      };

      const userUpdate = await services.constructorObjectUpdate({ name, email, cpfCnpj, typePerson, status });
      await repository.put(id, userUpdate);
      if (userToken.type === userEnum.type.superUser || user.id === userToken.id) {
        await repository.put(id, userUpdate);

        return response.json({ message: 'Usuário atualizado com sucesso.' });
      }

      return response.status(401).json({
        message: 'Seu usuário não pussui a permisão para atualizar outros usuários.'
      });

    } catch (error) {

      return response.status(400).json({
        message: `Erro ao atualizar usuário. Detalhes: ${error}`
      });
    }
  },

  async delete(request, response) {
    try {
      const { id } = request.params;
      const userToken = await repository.get(request.userToken.user.id);

      const user = await repository.get(id);
      if (!user) {

        return response.status(400).json({ message: 'Usuário não encontrado.' });
      };

      if (userToken.type === userEnum.type.superUser || userToken.id === user.id) {
        await repository.delete(id);

        return response.status(204).json();
      };

      return response.status(401).json({
        message: 'Seu usuário não pussui a permissão para deletar outros usuário.'
      });

    } catch (error) {

      return response.status(400).json({
        message: `Erro ao deletar usuário. Detalhes: ${error}`
      });
    };
  },
};