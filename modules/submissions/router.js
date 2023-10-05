"use strict";
const submissionsController = require("./submissions.controller");
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
	if (req.role == "Student") {
		submissionsController.create(req, res);
	} else {
		res.status(403).send({ message: "Forbidden Access" });
	}
});

router.get("", (req, res) => {
	if (req.role == "Student") {
		submissionsController.getAllSubmissionsForUser(req, res);
	} else {
		res.status(403).send({ message: "Forbidden Access" });
	}
});

router.get("/:quizId/:userId", (req, res) => {
	if (req.role == "Teacher" || req.role == "Admin") {
		submissionsController.getUserSubmission(req, res);
	} else if (req.role == "Student") {
		submissionsController.getUserResultForStudent(req, res);
	} else {
		res.status(403).send({ message: "Forbidden Access" });
	}
});

module.exports = router;
