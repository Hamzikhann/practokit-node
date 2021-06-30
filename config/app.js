const expressConfig = require('./express');
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const path = require("path");
const dotenv = require('dotenv');

class AppConfig {
    constructor(app) {
        dotenv.config();
        this.app = app;
    }
    includeConfig() {
        global.crypto = require("../utils/crypto")

        this.app.use(cors())
        this.app.use(bodyParser.json())
        this.app.use(express.static("./uploads"));
        this.app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
        this.app.use((req, res, next) => {
            console.log("__________________________________");
            console.log(`${new Date()} ${req.originalUrl}`);
            console.log("Request Params: ", req.params);
            console.log("Request Body: ", req.body);

            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            return next();
        })
        new expressConfig(this.app);
    }
}
module.exports = AppConfig;
