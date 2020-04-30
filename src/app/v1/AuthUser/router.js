'use strict'
const express = require('express');
const router = express.Router();
const controller = require('./controller/AuthUsersController');
const { celebrate, Segments, Joi } = require('celebrate');

router.post('/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
    })
  }), controller.auth);

router.post('/forgot',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
    })
  }), controller.forgotPassword);

router.put('/',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().required().email(),
      token: Joi.string().required(),
      password: Joi.string().required().min(6),
    })
  }), controller.update);

module.exports = router;
