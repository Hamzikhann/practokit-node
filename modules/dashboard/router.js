
'use strict';
const dashboardController = require('./dashboard.controller')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    // if (req.role == 'Admin') {
        dashboardController.findAll(req, res);
    // } else if (req.role == 'Editor') {
    //     dashboardController.findAllForEditor(req, res);
    // }
});
module.exports = router;

