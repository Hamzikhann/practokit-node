
'use strict';
const questionTypesController = require('./questionTypes.controller');
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        questionTypesController.findAll(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});

module.exports = router;

