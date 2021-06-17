
'use strict';
const questionTypesController = require('./questionTypes.controller');
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    questionTypesController.findAll(req, res);
});

module.exports = router;

