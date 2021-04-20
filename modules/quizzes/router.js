
'use strict';
const quizzesController = require('./quizzes.controller');
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        quizzesController.create(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
module.exports = router;

