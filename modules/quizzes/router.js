
'use strict';
const quizzesController = require('./quizzes.controller');
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    if(req.role == 'Student') {
        quizzesController.create(req, res);
    } else if(req.role == 'Teacher') {
        quizzesController.createByTeacher(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.post('/assign/:quizId', (req, res) => {
    if(req.role == 'Teacher') {
        quizzesController.assignQuizToStudent(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/', (req, res) => {
    if(req.role == 'Teacher') {
        quizzesController.findAllForTeacher(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/:quizId', (req, res) => {
    if(req.role == 'Student') {
        quizzesController.findQuizById(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/:quizId/wrong/Questions', (req, res) => {
    if(req.role == 'Student') {
        quizzesController.findQuizWrongQuestions(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/:quizId/result', (req, res) => {
    if(req.role == 'Student') {
        quizzesController.findQuizResultById(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
module.exports = router;

