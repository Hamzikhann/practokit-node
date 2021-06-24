
'use strict';
const submissionsController = require('./submissions.controller');
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    if(req.role == 'Student') {
        submissionsController.create(req, res);
    } else {
        res.status(403).send({ message: 'Forbidden Access' });
    }
});

module.exports = router;

