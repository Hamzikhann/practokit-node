
'use strict';
const usersController = require('./user.controller')
const express = require('express')
const router = express.Router()


router.post('/', (req, res) => {
    if (req.role == 'Admin') {
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
router.put('/:userId', (req, res) => {
    if (req.role == 'Admin') {
        usersController.update(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.put('/profile/edit', (req, res) => {
    usersController.updatePassword(req, res);
});
router.put('/reset/password', (req, res) => {
    usersController.changePassword(req, res);
});
router.delete('/:userId', (req, res) => {
    if (req.role == 'Admin') {
        usersController.delete(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
module.exports = router;

