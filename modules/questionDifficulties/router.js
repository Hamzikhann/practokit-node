
'use strict';
const questionDifficultiesController = require('./questionDifficulties.controller');
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        questionDifficultiesController.create(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/', (req, res) => {
    questionDifficultiesController.findAll(req, res);
});
router.get('/difficulty/:id', (req, res) => {
    questionDifficultiesController.findbyId(req, res);
});
router.put('/:id', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        questionDifficultiesController.update(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.delete('/:id', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        questionDifficultiesController.delete(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});

module.exports = router;

