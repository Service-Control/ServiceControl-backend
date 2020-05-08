'use strict';
const repository = require('../repository/userCompanyRepository');
const { messageValidEmailAndCpfCnpj } = require('../../../../validations/Validate');
const { UseUserEnum } = require('../../../../enums/UserEnums');
const bcrypt = require('bcryptjs');
const mailer = require('../../../../modules/mailer');
const userEnum = UseUserEnum();

module.exports = {
  async create(request, response) {
    try {
      const { userId, companyId } = request.body
      const userToken = await userRepository.get(request.userToken.user.id);

      if (userToken.type !== userEnum.type.superUser) {
        return response.status(400).json({
          message: 'Usuário sem permissão para relacionar empresas.'
        });
      };

      const userCompany = await repository.getByUserIdandConpanyId(userId, companyId);

      if (userCompany) {
        return response.status(400).json({ message: 'Usuário já relacionado a empresa.' })
      };

      const user = await repository.post(request.body);
      if (!user) {
        return response.status(400).json({ message: 'Erro ao realizar registro de usuário.' });
      };

      // const name = userRequest.name;
      // mailer.sendMail({
      //   to: `${user.email}, ${process.env.GMAIL_USER}`,
      //   from: '"Service Control" <service.controlLDC@gmail.com>',
      //   subject: `Obrigado ${name}, por fazer parte dessa plataforma!`,
      //   template: 'subs/subscription',
      //   context: {
      //     name
      //   },
      // });

      return response.json({ message: 'Relação criada com sucesso.' });
    } catch (error) {

      return response.status(400).json({
        message: `Erro ao realizar registro de relação usuário com empresa. Detalhes:${error}`
      });
    };
  },

  async index(request, response) {
    try {
      const userToken = request.userToken.user;

      if (userToken.type === userEnum.type.superUser) {
        return response.json(await repository.get());
      }

      return response.json(await repository.get(userToken.id));
    } catch (error) {

      return response.status(400).json({
        message: `Erro ao realizar a listagem de usuários. Detalhes: ${error}`
      });
    }
  },

  async delete(request, response) {
    try {
      const { id } = request.params;
      const userToken = request.userToken.user;

      const user = await repository.get(id);
      if (!user) {

        return response.status(400).json({ message: 'Usuário não encontrado.' });
      };

      if (userToken.type === userEnum.type.superUser || user.id === userToken.id) {
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