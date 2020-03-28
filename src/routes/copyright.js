'use strict'
const express = require('express');
const router = express.Router();

const object = {
    name: 'Lucas Damas Corrêa',
    age: '19',
    occupation: 'Developer'
};

module.exports = router.get('/', (req, res) => {
    res.json(
        object
    );
});
