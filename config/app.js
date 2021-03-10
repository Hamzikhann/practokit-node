const expressConfig = require('./express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
// const swaggerUI = require('swagger-ui-express');
// import { swaggerDocument } from "../swagger";
class AppConfig {
    constructor(app) {
        dotenv.config();
        this.app = app;
    }
    includeConfig(io) {
        global.crypto = require("../utils/crypto")
        global.helper = require("../utils/helper")
        this.app.use(bodyParser.json())
        this.app.use(cors())
        this.app.use((req, res, next) => {
            console.log("__________________________________");
            console.log(`${new Date()} ${req.originalUrl}`);
            console.log("Request Params: ", req.params);
            console.log("Request Body: ", req.body);

            req.io = io;
            return next();
        });
        new expressConfig(this.app);
    }
}
module.exports = AppConfig;