'use strict'

const express = require('express');
const router = express.Router();
const controller = require('./controller/AuthUsersController');
const { celebrate, Segments, Joi } = require('celebrate');

router.post('/users/auth', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  })
}), controller.auth);

router.post('/users/auth/forgot', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
  })
}), controller.forgotPassword);

router.put('/users/auth/reset', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().required().email(),
    token: Joi.string().required(),
    password: Joi.string().required(),
  })
}), controller.resetPassword);

module.exports = router;
