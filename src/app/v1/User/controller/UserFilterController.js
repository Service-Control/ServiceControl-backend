'use strict';
const repository = require('../repository/UsersRepository');
const {filterUserStatus} = require('../services/usersServices');
const { UseUserEnum } = require('../../../../enums/UserEnums');
const userEnum = UseUserEnum();

const { statusIsValid } = require('../services/usersServices');

module.exports = {
  async indexStatus(request, response) {
    try {
      const { status } = request.params;

      if (!await statusIsValid(status))
        return response.status(400).json({
          message: 'Status invalido.'
        });

      return response.json(await repository.getStatus(status));


    } catch (error) {

      return response.status(400).json({
        message: `Erro ao realizar a listagem de usuários. Detalhes: ${error}`
      });
    }
  },

  async index(request, response) {
    try {
      const { name, email, cpfCnpj, status } = request.query;
      let users = [];
    
      if (name) {
        users = await repository.getFilter('name', name.toLowerCase())
        if(status)users = await filterUserStatus(users, status)
        return response.json(users);
      };

      if (email) {
        users = await repository.getFilter('email', email.toLowerCase())
        console.log(status)
        if(status)users = await filterUserStatus(users, status)
        return response.json(users);
      };

      if (cpfCnpj) {
        users = await repository.getFilter('cpfCnpj', cpfCnpj)
        if(status)users = await filterUserStatus(users, status)
        return response.json(users);
      };

      return response.json(users);
    } catch (error) {

      return response.status(400).json({
        message: `Erro ao realizar a listagem de usuários. Detalhes: ${error}`
      });
    }
  },

};