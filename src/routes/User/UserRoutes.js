'use strict'

const express = require('express');
const router = express.Router();
const controller = require('../../app/controllers/User/UserController');

router.post('/register', controller.regiter);
router.get('/', controller.getAll);

module.exports = router;
