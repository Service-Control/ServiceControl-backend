'use strict'
require('dotenv/config');
const { UseUserEnum } = require('../enums/UserEnums');
const userEnum = UseUserEnum();

module.exports = {
  async messageValidEmailAndCpfCnpj(usersEmail, email, typePerson) {
    let message;
    usersEmail?  message = 'E-mail já registrado.'
    :
    typePerson === userEnum.typePerson.fisical ?
     message = 'CPF já registrado.'
     :
     message = 'CNPJ já registrado.';
    return message;
  }
};
