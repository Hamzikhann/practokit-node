
'use strict';
const usersController = require('./user.controller')
const express = require('express')
const router = express.Router()


router.post('/', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        usersController.create(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/', (req, res) => {
    usersController.findAllUsers(req, res);
});
router.get('/:classId', (req, res) => {
    usersController.findUserById(req, res);
});
router.put('/:classId', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        usersController.update(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.delete('/:classId', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        usersController.delete(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
module.exports = router;

