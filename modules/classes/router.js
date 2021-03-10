
'use strict';
const classesController = require('./class.controller')
const express = require('express')
const router = express.Router()


router.post('/', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        classesController.create(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/', (req, res) => {
    classesController.findAllClasses(req, res);
});
router.get('/:classId', (req, res) => {
    classesController.findClassById(req, res);
});
router.put('/:classId', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        classesController.update(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.delete('/:classId', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        classesController.delete(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
module.exports = router;

