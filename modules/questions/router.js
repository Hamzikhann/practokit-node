
'use strict';
const questionsController = require('./questions.controller');
const express = require('express')
const router = express.Router()

const fileUpload = require("../../utils/fileUpload");
const { upload } = fileUpload("questions");

router.post('/', (req, res) => {
    if (req.role == 'Editor') {
        questionsController.create(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.put('/:questionId', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        questionsController.updateQuestion(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/', (req, res) => {
    if (req.role == 'Admin') {
        questionsController.findAll(req, res);
    } else if (req.role == 'Editor') {
        questionsController.findAllForEditor(req, res);
    } else if (req.role == 'Teacher') {
        questionsController.findAllForTeacher(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/:courseId', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Teacher') {
        questionsController.findAllCourseQuestions(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/find/:questionId', (req, res) => {
    questionsController.findQuestion(req, res);
});
router.get('/all/count', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        questionsController.findQuestionsCount(req, res);
    } else if (req.role == 'Teacher') {
        questionsController.findQuestionsCountForTeacher(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.delete('/:questionId', (req, res) => {
    if (req.role == 'Admin') {
        questionsController.delete(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});

module.exports = router;

