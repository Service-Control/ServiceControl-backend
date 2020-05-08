'use strict'
const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const router = express.Router();
const userController = require('./controller/UserController');
const userFilterController = require('./controller/UserFilterController');

const authMiddleware = require('../../../middlewares/Auth');
const authSuperuserMiddleware = require('../../../middlewares/AuthSuperuser');

router.get('/',
  authMiddleware,
  userController.index
);
router.get('/filter/:status',
  authMiddleware,
  authSuperuserMiddleware,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      status: Joi.number().required(),
    }),
  }),
  userFilterController.indexStatus
);

router.get('/profile',
  authMiddleware,
  userController.indexProfile
);

router.get('/filter',
  authMiddleware,
  authSuperuserMiddleware,
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      name: Joi.string(),
      email: Joi.string(),
      cpfCnpj: Joi.string(),
      status: Joi.string(),
    }),
  }),
  userFilterController.index
);

router.post('/',
  authMiddleware,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      cpfCnpj: Joi.number().required(),
      type: Joi.number().required(),
      typePerson: Joi.number().required(),
      password: Joi.string().required().min(6),
    })
  }),
  userController.create
);

router.delete('/:id',
  authMiddleware,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  userController.delete
);

router.put('/:id',
  authMiddleware,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  userController.update
);

module.exports = router;
