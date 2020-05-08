'use strict'
const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const router = express.Router();
const usercompanyController = require('./controller/UserCompanyController');

const authMiddleware = require('../../../middlewares/Auth');
// const authSuperuserMiddleware = require('../../../middlewares/AuthSuperuser');

router.get('/',
  authMiddleware,
  usercompanyController.index
);
// router.get('/filter/:status',
//   authMiddleware,
//   authSuperuserMiddleware,
//   celebrate({
//     [Segments.PARAMS]: Joi.object().keys({
//       status: Joi.number().required(),
//     }),
//   }),
//   userFilterController.indexStatus
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
//   userFilterController.index
// );

router.post('/',
  authMiddleware,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      userId: Joi.number().required(),
      companyId: Joi.number().required(),
      type: Joi.number().required(),

    })
  }),
  usercompanyController.create
);

router.delete('/:id',
  authMiddleware,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  usercompanyController.delete
);

router.put('/:id',
  authMiddleware,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  usercompanyController.update
);

module.exports = router;
