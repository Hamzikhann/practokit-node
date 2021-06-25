
'use strict';
const coursesController = require('./course.controller');
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    if (req.role == 'Admin') {
        coursesController.create(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        coursesController.findAll(req, res);
    } else if (req.role == 'Teacher') {
        coursesController.findAllForTeacher(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/:classId', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
    coursesController.findAllByClass(req, res);
    } else if (req.role == 'Teacher') {
        coursesController.findAllByClassForTeacher(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.put('/:courseId', (req, res) => {
    if (req.role == 'Admin') {
        coursesController.update(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.delete('/:courseId', (req, res) => {
    if (req.role == 'Admin') {
        coursesController.delete(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});

module.exports = router;

