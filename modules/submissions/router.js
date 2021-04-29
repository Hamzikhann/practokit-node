
'use strict';
const submissionsController = require('./submissions.controller');
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    submissionsController.create(req, res);
});
router.get('/', (req, res) => {
    submissionsController.findAll(req, res);
});
router.get('/submission/:id', (req, res) => {
    submissionsController.findById(req, res);
});
router.get('/user/:id', (req, res) => {
    submissionsController.findByUserId(req, res);
});
router.get('/course/:id', (req, res) => {
    submissionsController.findByCourseId(req, res);
});
router.delete('/:id', (req, res) => {
    if (req.role == 'Admin' || req.role == 'User') {
        submissionsController.delete(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});

module.exports = router;

