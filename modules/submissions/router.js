
'use strict';
const submissionsController = require('./submissions.controller');
const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    submissionsController.create(req, res);
});

module.exports = router;

