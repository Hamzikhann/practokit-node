
'use strict';
const quizzesController = require('./quizzes.controller');
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    quizzesController.create(req, res);
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

