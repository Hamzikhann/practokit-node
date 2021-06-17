
'use strict';
const questionDifficultiesController = require('./questionDifficulties.controller');
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    questionDifficultiesController.findAll(req, res);
});

module.exports = router;

