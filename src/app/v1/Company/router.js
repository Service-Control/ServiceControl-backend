'use strict'
const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const router = express.Router();
const companyController = require('./controller/CompanyController');
// const companyFilterController = require('./controller/UserFilterController');

const authMiddleware = require('../../../middlewares/Auth');
const authSuperuserMiddleware = require('../../../middlewares/AuthSuperuser');

router.get('/',
  authMiddleware,
  authSuperuserMiddleware,
  companyController.index
);

// router.get('/filter/:status',
//   authMiddleware,
//   authSuperuserMiddleware,
//   celebrate({
//     [Segments.PARAMS]: Joi.object().keys({
//       status: Joi.number().required(),
//     }),
//   }),
//   companyFilterController.indexStatus
// );

// router.get('/filter',
//   authMiddleware,
//   authSuperuserMiddleware,
//   celebrate({
//     [Segments.QUERY]: Joi.object().keys({
//       name: Joi.string(),
//       email: Joi.string(),
//       cpfCnpj: Joi.string(),
//       status: Joi.string(),
//     }),
//   }),
//   companyFilterController.index
// );

router.post('/',
  authMiddleware,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      tradingName: Joi.string().required(),
      email: Joi.string().required().email(),
      cpfCnpj: Joi.number().required(),
      typeCompany: Joi.number().required(),
    })
  }),
  companyController.create
);

router.delete('/:id',
  authMiddleware,
  authSuperuserMiddleware,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  companyController.delete
);

router.put('/:id',
  authMiddleware,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  companyController.update
);

module.exports = router;
