
'use strict';
const reportAProblemController = require('./reportAProblem.controller');
const express = require('express')
const router = express.Router()

router.post('/report', (req, res) => {
    reportAProblemController.create(req, res);
});
router.get('/', (req, res) => {
    if (req.role == 'Admin') {
        reportAProblemController.findAll(req, res);
    } else if (req.role == 'Student') {
        reportAProblemController.findAllForStudent(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.post('/:problemId/status/update', (req, res) => {
    if (req.role == 'Admin') {
        reportAProblemController.updateStatus(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});

module.exports = router;

