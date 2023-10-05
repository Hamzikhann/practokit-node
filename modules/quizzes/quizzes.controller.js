const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const { Sequelize } = require("sequelize");

const Users = db.users;
const Questions = db.questions;
const QuestionsAttributes = db.questionsAttributes;
const QuestionDifficulties = db.questionDifficulties;
const QuestionsOptions = db.questionsOptions;
const QuestionTags = db.questionTags;
const QuestionType = db.questionType;
const Quizzes = db.quizzes;
const QuizSubmissions = db.quizSubmissions;
const QuizSubmissionResponse = db.quizSubmissionResponse;
const Courses = db.courses;
const Classes = db.classes;
const AssignTo = db.assignTo;
const Tags = db.tags;
const Teaches = db.teaches;

const Joi = require("@hapi/joi");
const Op = db.Sequelize.Op;
const { sequelize } = require("../../models");

// Create and Save a new Quiz
exports.create = async (req, res) => {
	try {
		// Validate request
		const joiSchema = Joi.object({
			questions: Joi.array().items(
				Joi.object().keys({
					difficultyId: Joi.string().required(),
					count: Joi.number()
						.integer()
						.required()
				})
			),
			courseId: Joi.string().required(),
			tagsIdList: Joi.array().items(Joi.string().required())
		}).prefs({ convert: false });
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			emails.errorEmail(req, error);

			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			const courseId = crypto.decrypt(req.body.courseId);
			const questionTagsIdList = [];

			req.body.tagsIdList.forEach((element) => {
				questionTagsIdList.push(+crypto.decrypt(element));
			});
			req.body.questions.forEach((element, index) => {
				req.body.questions[index].difficultyId = crypto.decrypt(element.difficultyId);
			});

			const [qp0, qp1, qp2, qp3, qp4] = await Promise.all([
				Questions.findAll({
					where: {
						questionDifficultyId: req.body.questions[0].difficultyId,
						coursesId: courseId,
						isActive: "Y"
					},
					include: [
						{
							model: QuestionTags,
							where: { isActive: "Y", tagsId: questionTagsIdList },
							attributes: []
						}
					],
					order: Sequelize.literal("rand()"),
					limit: req.body.questions[0].count,
					attributes: ["id"]
				}),
				Questions.findAll({
					where: {
						questionDifficultyId: req.body.questions[1].difficultyId,
						coursesId: courseId,
						isActive: "Y"
					},
					include: [
						{
							model: QuestionTags,
							where: { isActive: "Y", tagsId: questionTagsIdList },
							attributes: []
						}
					],
					order: Sequelize.literal("rand()"),
					limit: req.body.questions[1].count,
					attributes: ["id"]
				}),
				Questions.findAll({
					where: {
						questionDifficultyId: req.body.questions[2].difficultyId,
						coursesId: courseId,
						isActive: "Y"
					},
					include: [
						{
							model: QuestionTags,
							where: { isActive: "Y", tagsId: questionTagsIdList },
							attributes: []
						}
					],
					order: Sequelize.literal("rand()"),
					limit: req.body.questions[2].count,
					attributes: ["id"]
				}),
				Questions.findAll({
					where: {
						questionDifficultyId: req.body.questions[3].difficultyId,
						coursesId: courseId,
						isActive: "Y"
					},
					include: [
						{
							model: QuestionTags,
							where: { isActive: "Y", tagsId: questionTagsIdList },
							attributes: []
						}
					],
					order: Sequelize.literal("rand()"),
					limit: req.body.questions[3].count,
					attributes: ["id"]
				}),
				Questions.findAll({
					where: {
						questionDifficultyId: req.body.questions[4].difficultyId,
						coursesId: courseId,
						isActive: "Y"
					},
					include: [
						{
							model: QuestionTags,
							where: { isActive: "Y", tagsId: questionTagsIdList },
							attributes: []
						}
					],
					order: Sequelize.literal("rand()"),
					limit: req.body.questions[4].count,
					attributes: ["id"]
				})
			]);

			var QuestionsPool = await [...qp0, ...qp1, ...qp2, ...qp3, ...qp4];

			var questionsIds = QuestionsPool.map((e) => {
				return e.id;
			}).sort();
			var levelCountList = req.body.questions.map((e) => {
				return e.count;
			});

			const quiz = await Quizzes.create({
				questionTagsIdList: JSON.stringify(questionTagsIdList),
				courseId: courseId,
				createdBy: crypto.decrypt(req.userId),
				questionDifficultiesCount: JSON.stringify(levelCountList),
				questionsPool: JSON.stringify(questionsIds)
			});

			res.status(200).send({ quizId: crypto.encrypt(quiz.id), message: "Quiz Created." });
		}
	} catch (err) {
		emails.errorEmail(req, err);
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};
// Create a new Quiz by teacher
exports.createByTeacher = async (req, res) => {
	try {
		// Validate request
		const joiSchema = Joi.object({
			title: Joi.string().required(),
			courseId: Joi.string().required(),
			tagsIdList: Joi.array().items(Joi.string().required()),
			questionsIds: Joi.array().items(Joi.string().required())
		}).prefs({ convert: false });
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			emails.errorEmail(req, error);

			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			const tagsIdList = req.body.tagsIdList.map((e) => +crypto.decrypt(e)).sort();
			const questionsIds = req.body.questionsIds.map((e) => +crypto.decrypt(e)).sort();

			const quiz = await Quizzes.create({
				title: req.body.title,
				courseId: crypto.decrypt(req.body.courseId),
				questionTagsIdList: JSON.stringify(tagsIdList),
				questionsPool: JSON.stringify(questionsIds),
				createdBy: crypto.decrypt(req.userId)
			});

			res.status(200).send({ quizId: crypto.encrypt(quiz.id), message: "Assessment Created." });
		}
	} catch (err) {
		emails.errorEmail(req, err);
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Assign Quiz to students
exports.assignQuizToStudent = async (req, res) => {
	try {
		// Validate request
		const joiSchema = Joi.object({
			studentList: Joi.array().items(Joi.string().required())
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			emails.errorEmail(req, error);

			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			const quizId = crypto.decrypt(req.params.quizId);
			const ids = req.body.studentList.map((e) => {
				return +crypto.decrypt(e);
			});

			var assign = [];
			ids.forEach((user) => {
				assign.push({
					quizId: quizId,
					userId: user
				});
			});

			let transaction = await sequelize.transaction();
			AssignTo.bulkCreate(assign, { transaction })
				.then(async (assignRes) => {
					var emailsList = await Users.findAll({
						where: { id: ids },
						attributes: ["email"]
					});
					emailsList = emailsList.map((e) => {
						return e.email;
					});
					const result = emails.assignQuiz(emailsList, quizId);
					console.log(emailsList);
					await transaction.commit();
					res.status(200).send(emailsList);
				})
				.catch(async (err) => {
					if (transaction) await transaction.rollback();

					emails.errorEmail(req, err);
					res.status(500).send({
						message: err.message || "Some error occurred while creating the Quiz Submission."
					});
				});
		}
	} catch (err) {
		emails.errorEmail(req, err);
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Retrieve All Assessments for Admin.
exports.findAllForAdmin = (req, res) => {
	// console.log(req.body);
	// title: { [Op.ne]: null }
	try {
		Quizzes.findAll({
			where: { isActive: "Y" },
			include: [
				{
					model: Courses,
					where: { isActive: "Y" },
					include: [
						{
							model: Classes,
							attributes: ["id", "title"],
							where: { isActive: "Y" }
						}
					],
					attributes: ["id", "title"]
				},
				{
					model: AssignTo,
					required: false,
					include: [
						{
							model: Users,
							where: { isActive: "Y" },
							attributes: ["firstName", "lastName", "email"]
						}
					],
					where: { isActive: "Y" },
					attributes: ["id", "userId", "quizId"]
				},
				{
					model: QuizSubmissions,
					required: false,
					include: [
						{
							model: Users,
							where: { isActive: "Y" },
							attributes: ["firstName", "lastName", "email"]
						}
					],
					where: { isActive: "Y" },
					attributes: ["id", "userId"]
				}
			],
			order: [["id", "DESC"]],
			attributes: { exclude: ["isActive"] }
		})
			.then(async (quiz) => {
				// console.log(quiz);
				res.send(encryptHelper(quiz));
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: err.message || "Some error occurred while retrieving all Quizzes."
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Retrieve All Assessments created by teacher.
exports.findAllForTeacher = (req, res) => {
	try {
		console.log(req.body);
		Quizzes.findAll({
			where: { createdBy: crypto.decrypt(req.userId), isActive: "Y" },
			include: [
				{
					model: Courses,
					where: { isActive: "Y" },
					include: [
						{
							model: Classes,
							attributes: ["id", "title"],
							where: { isActive: "Y" }
						},
						{
							model: Teaches,
							where: {
								isActive: "Y",
								userId: crypto.decrypt(req.userId)
							}
						}
					],
					attributes: ["id", "title"]
				},
				{
					model: AssignTo,
					required: false,
					include: [
						{
							model: Users,
							where: { isActive: "Y" },
							attributes: ["firstName", "lastName", "email"]
						}
					],
					where: { isActive: "Y" },
					attributes: ["id", "userId", "quizId"]
				},
				{
					model: QuizSubmissions,
					required: false,
					include: [
						{
							model: Users,
							where: { isActive: "Y" },
							attributes: ["firstName", "lastName", "email"]
						}
					],
					where: { isActive: "Y" },
					attributes: ["id", "userId"]
				}
			],
			order: [["id", "DESC"]],
			attributes: { exclude: ["isActive"] }
		})
			.then(async (quiz) => {
				// console.log(quiz);
				res.send(encryptHelper(quiz));
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: err.message || "Some error occurred while retrieving Quiz by Id."
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Retrieve All Assessments created by students.
exports.findAllForStudent = async (req, res) => {
	try {
		const userId = crypto.decrypt(req.userId);
		// console.log(userId);

		const [selfCreated, teacherCreated] = await Promise.all([
			Quizzes.findAll({
				where: { isActive: "Y", createdBy: userId },
				include: [
					{
						model: Users,
						// where: { isActive: "Y" },
						attributes: ["id", "firstName", "lastName", "email"]
					},
					{
						model: Courses,
						where: { isActive: "Y" },
						include: [
							{
								model: Classes,
								attributes: ["id", "title"],
								where: { isActive: "Y" }
							}
						],
						attributes: ["id", "title"]
					},
					{
						model: QuizSubmissions,
						required: false,
						where: { isActive: "Y" },
						attributes: ["id", "userId"]
					}
				],
				attributes: { exclude: ["isActive"] }
			}),
			Quizzes.findAll({
				where: { isActive: "Y" },
				include: [
					{
						model: Users,
						where: { isActive: "Y" },
						attributes: ["id", "firstName", "lastName", "email"]
					},
					{
						model: Courses,
						where: { isActive: "Y" },
						include: [
							{
								model: Classes,
								attributes: ["id", "title"],
								where: { isActive: "Y" }
							}
						],
						attributes: ["id", "title"]
					},
					{
						model: AssignTo,
						where: { isActive: "Y", userId: userId },
						required: true,
						attributes: []
					},
					{
						model: QuizSubmissions,
						required: false,
						include: [
							{
								model: Users,
								where: { isActive: "Y" },
								attributes: ["firstName", "lastName", "email"]
							}
						],
						where: { isActive: "Y" },
						attributes: ["id", "userId"]
					}
				],
				attributes: { exclude: ["isActive"] }
			})
		]);

		var quizzes = await [...selfCreated, ...teacherCreated];
		res.send(encryptHelper(quizzes));
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Retrieve Quiz by Id.
exports.findQuizById = async (req, res) => {
	try {
		const quizId = crypto.decrypt(req.params.quizId);
		const userId = crypto.decrypt(req.userId);

		Quizzes.findOne({
			where: { id: quizId, isActive: "Y" },
			include: [
				{
					model: Courses,
					where: { isActive: "Y" },
					include: [
						{
							model: Classes,
							where: { isActive: "Y" },
							attributes: ["id", "title"]
						}
					],
					attributes: ["id", "title"]
				},
				{
					model: QuizSubmissions,
					required: false,
					include: [
						{
							model: QuizSubmissionResponse,
							where: { isActive: "Y" }
						},
						{
							model: Users,
							where: { isActive: "Y" },
							attributes: ["id", "firstName", "lastName", "email"]
						}
					],
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "updatedAt"] }
				}
			],
			attributes: ["id", "questionsPool", "title", "questionTagsIdList"]
		})
			.then(async (quiz) => {
				const questionsIds = JSON.parse(quiz.questionsPool);
				const questionsTags = JSON.parse(quiz.questionTagsIdList);

				const tags = await Tags.findAll({
					where: { id: questionsTags, isActive: "Y" },
					attributes: ["id", "title"]
				});
				const questionsPool = await Questions.findAll({
					where: { id: questionsIds, isActive: "Y" },
					attributes: ["id", "statement", "duration", "points"],
					include: [
						{
							model: QuestionsOptions,
							where: { isActive: "Y" },
							required: false,
							attributes: ["id", "title", "image", "imageSource", "correct"]
						},
						{
							model: QuestionsAttributes,
							where: { isActive: "Y" },
							required: false,
							attributes: [
								"id",
								"statementImage",
								"statementImageSource",
								"hint",
								"hintFile",
								"hintFileSource",
								"solutionFile",
								"solutionFileSource"
							]
						},
						{
							model: QuestionType,
							where: { isActive: "Y" },
							attributes: ["title"]
						},
						{
							model: QuestionDifficulties,
							where: { isActive: "Y" },
							attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
						},
						{
							model: QuestionTags,
							where: { isActive: "Y" },
							include: [
								{
									model: Tags,
									where: { isActive: "Y" },
									attributes: ["id", "title"]
								}
							],
							attributes: ["id", "isActive", "questionId"]
						},
						{
							model: Courses,
							where: { isActive: "Y" },
							attributes: ["id", "title"],
							include: [
								{
									model: Classes,
									where: { isActive: "Y" },
									attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
								}
							]
						}
					]
				});

				res.send({
					id: crypto.encrypt(quiz.id),
					title: quiz.title,
					courseId: crypto.encrypt(quiz.course.id),
					courseTitle: quiz.course.title,
					classId: crypto.encrypt(quiz.course.class.id),
					classTitle: quiz.course.class.title,
					quizSubmissions: encryptHelper(quiz.quizSubmissions),
					questionsPool: encryptHelper(questionsPool),
					tags: encryptHelper(tags)
				});
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: err.message || "Some error occurred while retrieving Quiz by Id."
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Retrieve Quiz by Id.
exports.findQuizByIdForStudent = async (req, res) => {
	try {
		const quizId = crypto.decrypt(req.params.quizId);
		const userId = crypto.decrypt(req.userId);

		var canAccess = "";

		if (req.role == "Student") {
			canAccess = await AssignTo.findOne({
				where: {
					isActive: "Y",
					quizId: quizId,
					userId: userId
				}
			});
			if (!canAccess) {
				canAccess = await Quizzes.findOne({
					where: {
						isActive: "Y",
						id: quizId,
						createdBy: userId
					}
				});
			}
		} else {
			canAccess = "Go On";
		}

		if (!canAccess) {
			res.status(403).send({ message: "Forbidden Access" });
		} else {
			Quizzes.findOne({
				where: { id: quizId, isActive: "Y" },
				include: [
					{
						model: Courses,
						where: { isActive: "Y" },
						include: [
							{
								model: Classes,
								where: { isActive: "Y" },
								attributes: ["id", "title"]
							}
						],
						attributes: ["id", "title"]
					},
					{
						model: QuizSubmissions,
						required: false,
						include: [
							{
								model: QuizSubmissionResponse,
								where: { isActive: "Y" }
							},
							{
								model: Users,
								where: { isActive: "Y" },
								attributes: ["id", "firstName", "lastName", "email"]
							}
						],
						where: { isActive: "Y" },
						attributes: { exclude: ["isActive", "updatedAt"] }
					}
				],
				attributes: ["id", "questionsPool", "title", "questionTagsIdList"]
			})
				.then(async (quiz) => {
					const questionsIds = JSON.parse(quiz.questionsPool);
					const questionsTags = JSON.parse(quiz.questionTagsIdList);

					const tags = await Tags.findAll({
						where: { id: questionsTags, isActive: "Y" },
						attributes: ["id", "title"]
					});
					const questionsPool = await Questions.findAll({
						where: { id: questionsIds, isActive: "Y" },
						attributes: ["id", "statement", "duration", "points"],
						include: [
							{
								model: QuestionsOptions,
								where: { isActive: "Y" },
								required: false,
								attributes: ["id", "title", "image", "imageSource"]
							},
							{
								model: QuestionsAttributes,
								where: { isActive: "Y" },
								required: false,
								attributes: [
									"id",
									"statementImage",
									"statementImageSource",
									"hint",
									"hintFile",
									"hintFileSource",
									"solutionFile",
									"solutionFileSource"
								]
							},
							{
								model: QuestionType,
								where: { isActive: "Y" },
								attributes: ["title"]
							},
							{
								model: QuestionDifficulties,
								where: { isActive: "Y" },
								attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
							},
							{
								model: QuestionTags,
								where: { isActive: "Y" },
								include: [
									{
										model: Tags,
										where: { isActive: "Y" },
										attributes: ["id", "title"]
									}
								],
								attributes: ["id", "isActive", "questionId"]
							},
							{
								model: Courses,
								where: { isActive: "Y" },
								attributes: ["id", "title"],
								include: [
									{
										model: Classes,
										where: { isActive: "Y" },
										attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
									}
								]
							}
						]
					});

					res.send({
						id: crypto.encrypt(quiz.id),
						title: quiz.title,
						courseId: crypto.encrypt(quiz.course.id),
						courseTitle: quiz.course.title,
						classId: crypto.encrypt(quiz.course.class.id),
						classTitle: quiz.course.class.title,
						quizSubmissions: encryptHelper(quiz.quizSubmissions),
						questionsPool: encryptHelper(questionsPool),
						tags: encryptHelper(tags)
					});
				})
				.catch((err) => {
					emails.errorEmail(req, err);
					res.status(500).send({
						message: err.message || "Some error occurred while retrieving Quiz by Id."
					});
				});
		}
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Retrieve Quiz Detal by Id for student.
exports.findQuizDetailForStudent = async (req, res) => {
	try {
		const quizId = crypto.decrypt(req.params.quizId);

		Quizzes.findOne({
			where: { id: quizId, isActive: "Y" },
			include: [
				{
					model: Courses,
					where: { isActive: "Y" },
					include: [
						{
							model: Classes,
							where: { isActive: "Y" },
							attributes: ["id", "title"]
						},
						{
							model: Users,
							where: { isActive: "Y" },
							attributes: ["id", "firstName", "lastName", "email"]
						}
					],
					attributes: ["id", "title"]
				}
			]
		}).then(async (quiz) => {
			const questionsIds = JSON.parse(quiz.questionsPool);
			const questionsTags = JSON.parse(quiz.questionTagsIdList);

			const tags = await Tags.findAll({
				where: { id: questionsTags, isActive: "Y" },
				attributes: ["id", "title"]
			});
			const questionsPool = await Questions.findAll({
				where: { id: questionsIds, isActive: "Y" },
				attributes: ["id", "statement", "duration", "points"],
				include: [
					{
						model: QuestionType,
						where: { isActive: "Y" }
					}
				]
			});

			encryptHelper(quiz);
			var questionsType = [];
			var totalTime = 0;
			var totalMarks = 0;

			questionsPool.forEach((q) => {
				if (!questionsType.includes(q.questionType.title)) {
					questionsType.push(q.questionType.title);
				}
				totalMarks += q.points;
				totalTime += q.duration;
			});
			res.send({
				id: quiz.id,
				title: quiz.title,
				course: quiz.course,
				createdAt: quiz.createdAt,
				createdBy: quiz.user,
				tags: encryptHelper(tags),
				types: questionsType,
				totalTime: Math.floor(totalTime / 60) + " min " + Math.floor(totalTime % 60) + " sec",
				totalMarks: totalMarks,
				totalQuestions: questionsPool.length
			});
		});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Retrieve Wrong questions of quiz by Quiz Id.
exports.findQuizWrongQuestions = (req, res) => {
	try {
		Quizzes.findOne({
			where: { id: crypto.decrypt(req.params.quizId), isActive: "Y" },
			include: [
				{
					model: Courses,
					where: { isActive: "Y" },
					include: [
						{
							model: Classes,
							where: { isActive: "Y" },
							attributes: ["title"]
						}
					],
					attributes: ["title"]
				},
				{
					model: QuizSubmissions,
					attributes: ["id"]
				}
			],
			attributes: ["id", "courseId"]
		})
			.then(async (quiz) => {
				const quizResponse = await QuizSubmissionResponse.findOne({
					where: { quizSubmissionId: quiz.quizSubmissions[0].id },
					order: [["createdAt", "DESC"]],
					limit: 1,
					attributes: ["response"]
				});

				const response = JSON.parse(quizResponse.response);
				var questionsPool = [];
				response.forEach((question) => {
					if (question.isWrong) {
						questionsPool.push(question);
					}
				});

				res.send({
					id: crypto.encrypt(quiz.id),
					courseTitle: quiz.course.title,
					classTitle: quiz.course.class.title,
					questionsPool: questionsPool
				});
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: err.message || "Some error occurred while retrieving Quiz by Id."
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Retrieve Quiz Result of quiz bu quiz Id.
exports.findQuizResultById = (req, res) => {
	try {
		const quizId = crypto.decrypt(req.params.quizId);
		const userId = crypto.decrypt(req.userId);
		// console.log(quizId, userId);
		QuizSubmissions.findOne({
			where: { isActive: "Y", quizzId: quizId, userId: userId },
			include: [
				{
					model: Quizzes,
					where: { isActive: "Y" },
					include: [
						{
							model: Courses,
							where: { isActive: "Y" },
							include: [
								{
									model: Classes,
									where: { isActive: "Y" },
									attributes: ["title"]
								}
							],
							attributes: ["title"]
						}
					],
					attributes: ["courseId"]
				}
			],
			attributes: ["id", "result", "totalMarks", "wrong", "totalQuestions", "timeSpend", "createdAt"]
		})
			.then(async (quiz) => {
				if (quiz) {
					const count = await QuizSubmissionResponse.count({
						where: { quizSubmissionId: quiz.id, isActive: "Y" }
					});

					res.send({
						result: quiz.result,
						totalMarks: quiz.totalMarks,
						wrong: quiz.wrong,
						totalQuestions: quiz.totalQuestions,
						timeSpend: quiz.timeSpend,
						courseTitle: quiz.quiz.course.title,
						gradeTitle: quiz.quiz.course.class.title,
						tries: count
						// quiz: quiz
					});
				} else {
					res.send(null);
				}
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: err.message || "Some error occurred while retrieving Quiz by Id."
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Update Quiz
exports.updateQuiz = async (req, res) => {
	try {
		// Validate request
		const joiSchema = Joi.object({
			title: Joi.string().required(),
			tagsIdList: Joi.array().items(Joi.string().required()),
			questionsIds: Joi.array().items(Joi.string().required())
		}).prefs({ convert: false });
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			emails.errorEmail(req, error);

			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			const quizId = crypto.decrypt(req.params.quizId);
			const userId = crypto.decrypt(req.userId);

			const tagsIdList = req.body.tagsIdList.map((e) => +crypto.decrypt(e)).sort();
			const questionsIds = req.body.questionsIds.map((e) => +crypto.decrypt(e)).sort();

			Quizzes.update(
				{
					title: req.body.title,
					questionTagsIdList: JSON.stringify(tagsIdList),
					questionsPool: JSON.stringify(questionsIds)
				},
				{
					where: {
						id: quizId,
						createdBy: userId,
						isActive: "Y"
					}
				}
			)
				.then((quiz) => {
					res.status(200).send({ quizId: crypto.encrypt(quizId), message: "Assessment Updated." });
				})
				.catch((err) => {
					emails.errorEmail(req, err);
					res.status(500).send({
						message: err.message || "Some error occurred while updating Quiz."
					});
				});
		}
	} catch (err) {
		emails.errorEmail(req, err);
		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Delete specified id assessment in the request
exports.deleteQuiz = (req, res) => {
	try {
		Quizzes.update(
			{ isActive: "N" },
			{
				where: { id: crypto.decrypt(req.params.quizId), isActive: "Y" }
			}
		)
			.then((num) => {
				if (num == 1) {
					res.send({
						message: "Quiz was deleted successfully."
					});
				} else {
					res.send({
						message: `Cannot delete quiz. Maybe Quiz was not found or req.body is empty!`
					});
				}
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: "Error updating Quiz"
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};
