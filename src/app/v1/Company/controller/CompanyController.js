'use strict';
const repository = require('../repository/CompanyRepository');
const userRepository = require('../../User/repository/UsersRepository');
const userCompanyRepository = require('../../UserCompany/repository/userCompanyRepository');
const service = require('../services/CompanyServices');

const { messageValidEmailAndCpfCnpj } = require('../../../../validations/Validate');
const { UseCompanyEnum } = require('../../../../enums/CompanyEnums');
const { UseUserEnum } = require('../../../../enums/UserEnums');

const companyEnum = UseCompanyEnum();
const userEnum = UseUserEnum();

module.exports = {
  async create(request, response) {
    try {
      const companyRequest = {
        name: request.body.name.trim().toLowerCase(),
        tradingName: request.body.tradingName.trim().toLowerCase(),
        email: request.body.email.trim(),
        cpfCnpj: request.body.cpfCnpj,
        typeCompany: await service.validTypePerson(request.body.typePerson),
      };
      const userToken = await userRepository.get(request.userToken.user.id);

      const companys = await repository
        .getByCpfCnpj(
          companyRequest.cpfCnpj,
        );

      if (companys) {
        let menssageError = await messageValidEmailAndCpfCnpj(
          '',
          companyRequest.email,
          companyRequest.typePerson
        );
        return response.status(400).json({ message: menssageError })
      };

      if (! await service.validateUserregisterCompany(userToken.type)) {
        return response.status(400).json({
          message: 'Seu usuário não tem permissão para registrar uma empresa.'
        });
      }

      const company = await repository.post(companyRequest);
      if (!company) {
        return response.status(400).json({ message: 'Erro ao realizar registro de empresa.' });
      };

      // const name = companyRequest.name;
      // mailer.sendMail({
      //   to: `${company.email}, ${process.env.GMAIL_company}`,
      //   from: '"Service Control" <service.controlLDC@gmail.com>',
      //   subject: `Obrigado ${name}, por fazer parte dessa plataforma!`,
      //   template: 'subs/subscription',
      //   context: {
      //     name
      //   },
      // });

      return response.json(userCompany, { message: 'Empresa registrada com sucesso.'
     });
    } catch (error) {

      return response.status(400).json({
        message: `Erro ao realizar registro de empresa. Detalhes: ${error}`
      });
    };
  },

  async index(request, response) {
    try {
      const userToken = await userRepository.get(request.userToken.user.id);

      return response.json(await repository.get());

    } catch (error) {

      return response.status(400).json({
        message: `Erro ao realizar a listagem de usuários. Detalhes: ${error}`
      });
    }
  },

  async update(request, response) {
    try {
      const { name, email, cpfCnpj, typePerson, status } = request.body
      const userToken = request.userToken.company;
      const { id } = request.params;

      if (!{ name, email, cpfCnpj, typePerson, status }) {

        return response.status(400).json({
          message: 'Não existem parametros para serem atualizados.'
        });
      };

      const company = await repository.get(id);
      if (!company) {

        return response.status(400).json({ message: 'Usuário não encontrado.' });
      };

      const companyUpdate = await service.constructorObjectUpdate({ name, email, cpfCnpj, typePerson, status });
      if (userToken.type === companyEnum.type.supercompany || company.id === userToken.id) {
        await repository.put(id, companyUpdate);

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
      const userToken = request.userToken.company;

      const company = await repository.get(id);
      if (!company) {

        return response.status(400).json({ message: 'Usuário não encontrado.' });
      };

      if (userToken.type === companyEnum.type.supercompany || company.id === userToken.id) {
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