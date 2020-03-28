'use strict'

const express = require('express');
const router = express.Router();
const controller = require('./controller/UserController');
const { celebrate, Segments, Joi } = require('celebrate');
const authMiddleware = require('../middlewares/Auth');

router.post('/users/register',
  authMiddleware,
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      cpfCnpj: Joi.number().required(),
      type: Joi.number().required(),
      typePerson: Joi.number().required(),
      password: Joi.string().required().min(6).max(10),
    })
  }),
  controller.create
);

router.get('/users',
  authMiddleware,
  controller.index
);

router.delete('/users/delete/:id',
  authMiddleware,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  controller.delete
);

router.put('/users/update/:id',
  authMiddleware,
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().required(),
    }),
  }),
  controller.update
);

module.exports = router;
