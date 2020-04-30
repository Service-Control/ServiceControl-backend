'use strict'
const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const authMiddleware = require('../../../middlewares/Auth');
const router = express.Router();
const controller = require('./controller/UserController');

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
  controller.create
);

router.get('/',
  authMiddleware,
  controller.index
);

router.delete('/:id',
  authMiddleware,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
      }),
  }),
  controller.delete
);

router.put('/:id',
  authMiddleware,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
      }),
  }),
  controller.update
);

module.exports = router;
