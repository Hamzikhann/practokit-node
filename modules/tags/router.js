
'use strict';
const tagsController = require('./tags.controller');
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        tagsController.create(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.get('/', (req, res) => {
    tagsController.findAll(req, res);
});
router.get('/:courseId', (req, res) => {
    tagsController.findAllofCourse(req, res);
});
router.get('/tag/:tagId', (req, res) => {
    tagsController.findTag(req, res);
});
router.put('/:tagId', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        tagsController.update(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});
router.delete('/:tagId', (req, res) => {
    if (req.role == 'Admin' || req.role == 'Editor') {
        tagsController.delete(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});

module.exports = router;

