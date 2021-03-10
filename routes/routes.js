
'use strict';
const jwt = require('../utils/jwt');
const path = require("path");

const authenticationRouteHandler = require('../modules/authentication/router');
const classRouteHandler = require('../modules/classes/router');
const courseRouteHandler = require('../modules/courses/router');
const tagRouteHandler = require('../modules/tags/router');
const questionDifficultyRouteHandler = require('../modules/questionDifficulties/router');
const questionTypesRouteHandler = require('../modules/questionTypes/router');
const questionRouteHandler = require('../modules/questions/router');


class Routes {
    constructor(app) {
        this.app = app;
    }
    /* creating app Routes starts */
    appRoutes() {

        this.app.use("/api/v1/auth", authenticationRouteHandler)
        this.app.use("/api/v1/classes", jwt.protect, classRouteHandler)
        this.app.use("/api/v1/courses", jwt.protect, courseRouteHandler)
        this.app.use("/api/v1/tags", jwt.protect, tagRouteHandler)
        this.app.use("/api/v1/questionDifficulties", jwt.protect, questionDifficultyRouteHandler)
        this.app.use("/api/v1/questionTypes", jwt.protect, questionTypesRouteHandler)
        this.app.use("/api/v1/questions", jwt.protect, questionRouteHandler)
        

        this.app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../views/index.html'));
        }); 
    }
    routesConfig() {
        this.appRoutes();
    }
}
module.exports = Routes;