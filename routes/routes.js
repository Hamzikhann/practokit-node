"use strict";
const jwt = require("../utils/jwt");

const authenticationRouteHandler = require("../modules/authentication/router");
const userRouteHandler = require("../modules/users/router");
const roleRouteHandler = require("../modules/roles/router");
const dashboardRouteHandler = require("../modules/dashboard/router");
const classRouteHandler = require("../modules/classes/router");
const courseRouteHandler = require("../modules/courses/router");
const tagRouteHandler = require("../modules/tags/router");
const questionDifficultyRouteHandler = require("../modules/questionDifficulties/router");
const questionTypesRouteHandler = require("../modules/questionTypes/router");
const questionRouteHandler = require("../modules/questions/router");
const quizzesRouteHandler = require("../modules/quizzes/router");
const submissionsRouteHandler = require("../modules/submissions/router");
const reportAProblemRouteHandler = require("../modules/reportAProblem/router");

class Routes {
	constructor(app) {
		this.app = app;
	}
	/* creating app Routes starts */
	appRoutes() {
		this.app.use("/api/v1/auth", authenticationRouteHandler);
		this.app.use("/api/v1/dashboard", jwt.protect, dashboardRouteHandler);
		this.app.use("/api/v1/users", jwt.protect, userRouteHandler);
		this.app.use("/api/v1/roles", jwt.protect, roleRouteHandler);
		this.app.use("/api/v1/classes", jwt.protect, classRouteHandler);
		this.app.use("/api/v1/courses", jwt.protect, courseRouteHandler);
		this.app.use("/api/v1/tags", jwt.protect, tagRouteHandler);
		this.app.use("/api/v1/questionDifficulties", jwt.protect, questionDifficultyRouteHandler);
		this.app.use("/api/v1/questionTypes", jwt.protect, questionTypesRouteHandler);
		this.app.use("/api/v1/questions", jwt.protect, questionRouteHandler);
		this.app.use("/api/v1/quizzes", jwt.protect, quizzesRouteHandler);
		this.app.use("/api/v1/submissions", jwt.protect, submissionsRouteHandler);
		this.app.use("/api/v1/problems", jwt.protect, reportAProblemRouteHandler);

		this.app.get("/", (req, res) => {
			res.send("Assessment Tool Server Running");
		});
		this.app.get("/api/v1/encrypt_f2uGgiRc/:val", (req, res) => {
			let encrypted = crypto.encrypt(req.params.val);
			res.json({
				encrypted: encrypted,
				message: "This is helper route to get encrypted value only in development mode"
			});
		});
		this.app.get("/api/v1/decrypt_f2uGgiRc/:val", (req, res) => {
			let decrypted = crypto.decrypt(req.params.val);
			res.json({
				decrypted: decrypted,
				message: "This is helper route to get decrypted value only in development mode"
			});
		});
	}
	routesConfig() {
		this.appRoutes();
	}
}
module.exports = Routes;
