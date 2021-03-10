
'use strict';
const questionsController = require('./questions.controller');
const express = require('express')
const router = express.Router()

const fileUpload = require("../../utils/fileUpload");
const { upload } = fileUpload("questions");

router.post('/', upload.fields([
    {
        name: 'statementImage'
    },
    {
        name: 'hintFile'
    },
    {
        name: 'solutionFile'
    }
]), (req, res) => {
    if (req.role == 'Admin') {
        questionsController.create(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/question/:questionId', (req, res) => {
    questionsController.findQuestion(req, res);
});
router.get('/', (req, res) => {
    questionsController.findAll(req, res);
});
router.get('/course/:courseId', (req, res) => {
    questionsController.findQuestionsOfCourse(req, res);
});
router.put('/:tagId', (req, res) => {
    if (req.role == 'Admin') {
        questionsController.update(req, res);
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

