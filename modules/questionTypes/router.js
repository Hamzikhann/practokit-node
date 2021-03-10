
'use strict';
const questionTypesController = require('./questionTypes.controller');
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    if (req.role == 'Admin') {
        questionTypesController.create(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/', (req, res) => {
    questionTypesController.findAll(req, res);
});
router.get('/type/:id', (req, res) => {
    questionTypesController.findbyId(req, res);
});
router.put('/:id', (req, res) => {
    if (req.role == 'Admin') {
        questionTypesController.update(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.delete('/:id', (req, res) => {
    if (req.role == 'Admin') {
        questionTypesController.delete(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});

module.exports = router;

