"use strict";
const dashboardController = require("./dashboard.controller");
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	console.log(req.role);
	if (req.role == "Admin") {
		dashboardController.findAll(req, res);
	} else if (req.role == "Editor") {
		dashboardController.findAllForEditor(req, res);
	} else if (req.role == "Teacher") {
		dashboardController.findAllForTeacher(req, res);
	} else if (req.role == "Student") {
		dashboardController.findAllForStudent(req, res);
	} else {
		res.status(403).send({ message: "Forbidden Access" });
	}
});
router.get("/editor/:editorId", (req, res) => {
	if (req.role == "Admin") {
		dashboardController.findEditorStats(req, res);
	} else {
		res.status(403).send({ message: "Forbidden Access" });
	}
});
router.get("/teacher/:teacherId", (req, res) => {
	if (req.role == "Admin") {
		dashboardController.findTeacherStats(req, res);
	} else {
		res.status(403).send({ message: "Forbidden Access" });
	}
});
module.exports = router;
