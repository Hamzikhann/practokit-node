
'use strict';
const questionsController = require('./questions.controller');
const express = require('express')
const router = express.Router()

const fileUpload = require("../../utils/fileUpload");
const { upload } = fileUpload("questions");

router.post('/', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
		console.log('somtething');
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
router.get('/find/:questionId', (req, res) => {
    questionsController.findQuestion(req, res);
});
router.get('/', (req, res) => {
    questionsController.findAll(req, res);
});
router.get('/course/:courseId', (req, res) => {
    questionsController.findQuestionsOfCourse(req, res);
});
router.delete('/:questionId', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        questionsController.delete(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});

module.exports = router;

