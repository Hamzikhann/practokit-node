
'use strict';
const rolesController = require('./roles.controller');
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    rolesController.findAll(req, res);
});

module.exports = router;

