"use strict";
const questionsController = require("./questions.controller");
const express = require("express");
const router = express.Router();

const fileUpload = require("../../utils/fileUpload");
const { upload } = fileUpload("questiones");

router.post("/image", (req, res) => {
	questionsController.getImage(req, res);
});

router.post(
	"/",
	upload.fields([
		{ name: "statementImage", maxCount: 10 }, // Allow up to 10 files for 'user_file'
		{ name: "hintFile", maxCount: 10 }, // Allow up to 10 files for 'hint'
		{ name: "solutionFile", maxCount: 10 },
		{ name: "options-0", maxCount: 10 },
		{ name: "options-1", maxCount: 10 },
		{ name: "options-2", maxCount: 10 },
		{ name: "options-3", maxCount: 10 },
		{ name: "options-4", maxCount: 10 },
		{ name: "options-5", maxCount: 10 },
		{ name: "options-6", maxCount: 10 },
		{ name: "options-7", maxCount: 10 }
		// { name: "options-", maxCount: 20 } // Allow up to 10 files for 'solution'
	]),
	(req, res) => {
		if (req.role == "Editor") {
			questionsController.create(req, res);
		} else {
			res.status(403).send({ message: "Forbidden Access" });
		}
	}
);
router.put("/:questionId", (req, res) => {
	if (req.role == "Admin" || req.role == "Editor") {
		questionsController.updateQuestion(req, res);
	} else {
		res.status(403).send({ message: "Forbidden Access" });
	}
});
router.get("/", (req, res) => {
	if (req.role == "Admin") {
		questionsController.findAll(req, res);
	} else if (req.role == "Editor") {
		questionsController.findAllForEditor(req, res);
	} else if (req.role == "Teacher") {
		questionsController.findAllForTeacher(req, res);
	} else {
		res.status(403).send({ message: "Forbidden Access" });
	}
});
router.get("/:courseId", (req, res) => {
	if (req.role == "Admin") {
		questionsController.findAllCourseQuestionsForAdmin(req, res);
	} else if (req.role == "Teacher") {
		questionsController.findAllCourseQuestions(req, res);
	} else {
		res.status(403).send({ message: "Forbidden Access" });
	}
});
router.get("/find/:questionId", (req, res) => {
	questionsController.findQuestion(req, res);
});
router.get("/all/count", (req, res) => {
	if (req.role == "Admin" || req.role == "Editor" || req.role == "Student") {
		questionsController.findQuestionsCount(req, res);
	} else if (req.role == "Teacher") {
		questionsController.findQuestionsCountForTeacher(req, res);
	} else {
		res.status(403).send({ message: "Forbidden Access" });
	}
});
router.get("/course/:courseId/count", (req, res) => {
	if (req.role == "Student") {
		questionsController.findQuestionsCountForStudent(req, res);
	} else {
		res.status(403).send({ message: "Forbidden Access" });
	}
});
router.delete("/:questionId", (req, res) => {
	if (req.role == "Admin") {
		questionsController.delete(req, res);
	} else {
		res.status(403).send({ message: "Forbidden Access" });
	}
});

module.exports = router;
