
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
router.get('/:quizId', (req, res) => {
    quizzesController.findQuizById(req, res);
});
router.get('/:quizId/wrong/Questions', (req, res) => {
    quizzesController.findQuizWrongQuestions(req, res);
});
router.get('/:quizId/result', (req, res) => {
    quizzesController.findQuizResultById(req, res);
});
module.exports = router;

