
'use strict';
const coursesController = require('./course.controller');
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        coursesController.create(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/', (req, res) => {
    coursesController.findAll(req, res);
});
router.get('/:classId', (req, res) => {
    coursesController.findAllByClass(req, res);
});
router.put('/:courseId', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        coursesController.update(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.delete('/:courseId', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        coursesController.delete(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});

module.exports = router;

