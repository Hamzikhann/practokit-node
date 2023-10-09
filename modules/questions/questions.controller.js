const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");

const Courses = db.courses;
const Classes = db.classes;
const Tags = db.tags;
const Questions = db.questions;
const QuestionsAttributes = db.questionsAttributes;
const QuestionsOptions = db.questionsOptions;
const QuestionTags = db.questionTags;
const QuestionTypes = db.questionType;
const QuestionDifficulties = db.questionDifficulties;
const Teaches = db.teaches;
const { uploadMultipleImages, downloadImage } = require("../../utils/dropbox");

const Joi = require("@hapi/joi");
const { sequelize } = require("../../models");

exports.getImage = async (req, res) => {
	try {
		const imageUrl = req.body.file;

		if (imageUrl) {
			console.log(imageUrl);
			let response = await downloadImage(imageUrl);
			console.log(response);
			res.contentType("image/png");
			const base64Image = Buffer.from(response.result.fileBinary, "binary").toString("base64");
			const dataUrl = `data:image/png;base64,${base64Image}`;

			res.json({ safeUrl: dataUrl });
		}
	} catch (error) {
		res.status(500).send({
			message: error.message || "Some error occurred."
		});
	}
};

// Create and Save a new Question
exports.create = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			statement: Joi.string().required(),
			duration: Joi.number()
				.integer()
				.required(),
			points: Joi.number()
				.integer()
				.required(),
			difficultyId: Joi.string().required(),
			typeId: Joi.string().required(),
			courseId: Joi.string().required(),
			statementImage: Joi.array()
				.items(Joi.any())
				.allow("")
				.optional(),
			statementFileName: Joi.string()
				.allow("")
				.optional(),
			statementImageSource: Joi.string().optional(),
			hint: Joi.string()
				.optional()
				.allow(""),
			hintFile: Joi.array()
				.items(Joi.any())
				.allow("")
				.optional(),
			hintFileName: Joi.string()
				.allow("")
				.optional(),
			hintFileSource: Joi.string().optional(),
			solutionFile: Joi.array()
				.items(Joi.any())
				.optional()
				.allow(""),
			solutionFileName: Joi.string()
				.allow("")
				.optional(),
			solutionFileSource: Joi.string().optional(),
			tagIds: Joi.array()
				.items(Joi.string().required())
				.min(1),
			options: Joi.array()
				.items(Joi.any())
				.min(1)
				.max(8),
			optionsLink: Joi.string().allow(""),
			hintLink: Joi.string().allow(""),
			soluctionLink: Joi.string().allow(""),
			statementLink: Joi.string().allow(""),
			"options-0": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-1": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-2": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-3": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-4": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-5": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-6": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-7": Joi.array().items(Joi.any().allow(""))
		});
		console.log(req.body);
		let tagIds = JSON.parse(req.body.tagIds);
		let optionsBody = JSON.parse(req.body.options);
		req.body.options = optionsBody;
		req.body.tagIds = tagIds;
		console.log(optionsBody);
		const { error, value } = joiSchema.validate(req.body);
		if (error) {
			emails.errorEmail(req, error);
			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message || "Some Error Occured"
			});
		} else {
			// console.log(req.body);
			console.log(req.files);
			// let body;

			const question = {
				statement: req.body.statement,
				duration: req.body.duration,
				points: req.body.points,
				questionDifficultyId: crypto.decrypt(req.body.difficultyId),
				questionTypeId: crypto.decrypt(req.body.typeId),
				coursesId: crypto.decrypt(req.body.courseId),
				createdBy: crypto.decrypt(req.userId)
			};
			const questionAttributes = {
				statementImageSource: req.body.statementImageSource,
				statementImage: null,
				statementFileName: null,
				hint: req.body.hint,
				hintFileSource: req.body.hintFileSource,
				hintFile: null,
				hintFileName: null,
				solutionFileSource: req.body.solutionFileSource,
				solutionFile: null,
				solutionFileName: null
			};

			// let optionsBody = JSON.parse(req.body.options);
			// console.log(optionsBody);

			const statementFile = req.files["statementImage"];
			const hintFile = req.files["hintFile"];
			const solutionFile = req.files["solutionFile"];
			const option0 = req.files["options-0"];
			const option1 = req.files["options-1"];
			const option2 = req.files["options-2"];
			const option3 = req.files["options-3"];
			const option4 = req.files["options-4"];
			const option5 = req.files["options-5"];
			const option6 = req.files["options-6"];
			const option7 = req.files["options-7"];
			// console.log(option0, 5555);
			// options
			if (option0) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option0, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[0].image = e.path_display;
								optionsBody[0].fileName = e.name;
							});
						} else {
							optionsBody[0].image = "";
							optionsBody[0].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}

			if (option1) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option1, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							// console.log(uploadedImages);
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[1].image = e.path_display;
								optionsBody[1].fileName = e.name;
							});
						} else {
							optionsBody[1].image = "";
							optionsBody[1].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}

			if (option2) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option2, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[2].image = e.path_display;
								optionsBody[2].fileName = e.name;
							});
						} else {
							optionsBody[2].image = "";
							optionsBody[2].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
			if (option3) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option3, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[3].image = e.path_display;
								optionsBody[3].fileName = e.name;
							});
						} else {
							optionsBody[3].image = "";
							optionsBody[3].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
			if (option4) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option4, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[4].image = e.path_display;
								optionsBody[4].fileName = e.name;
							});
						} else {
							optionsBody[4].image = "";
							optionsBody[4].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
			if (option5) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option5, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[5].image = e.path_display;
								optionsBody[5].fileName = e.name;
							});
						} else {
							optionsBody[5].image = "";
							optionsBody[5].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
			if (option6) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option6, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[6].image = e.path_display;
								optionsBody[6].fileName = e.name;
							});
						} else {
							optionsBody[6].image = "";
							optionsBody[6].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
			if (option7) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option7, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[7].image = e.path_display;
								optionsBody[7].fileName = e.name;
							});
						} else {
							optionsBody[7].image = "";
							optionsBody[7].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}

			// const statementImage = req.files['statementImage'];
			var body;

			if (statementFile) {
				let statementLink = req.body.statementLink;
				console.log(statementLink);
				await uploadMultipleImages(statementFile, statementLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								questionAttributes.statementImageSource = "dropbox";
								questionAttributes.statementImage = e.path_display;
								questionAttributes.statementFileName = e.name;
							});
						} else {
							questionAttributes.statementImageSource = "dropbox";
							questionAttributes.statementImage = "";
							questionAttributes.statementFileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}

			if (hintFile) {
				let hintLink = req.body.hintLink;
				console.log(hintLink);
				await uploadMultipleImages(hintFile, hintLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;

							body.forEach((e, index) => {
								questionAttributes.hintFileSource = "dropbox";
								questionAttributes.hintFile = e.path_display;
								questionAttributes.hintFileName = e.name;
							});
						} else {
							questionAttributes.hintFileSource = "dropbox";
							questionAttributes.hintFile = "";
							questionAttributes.hintFileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}

			if (solutionFile) {
				let soluctionLink = req.body.soluctionLink;
				console.log(soluctionLink);
				await uploadMultipleImages(solutionFile, soluctionLink)
					.then((uploadedImages) => {
						// console.log(uploadedImages, 444);
						let uu = uploadedImages == undefined;
						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								questionAttributes.solutionFileSource = "dropbox";
								questionAttributes.solutionFile = e.path_display;
								questionAttributes.solutionFileName = e.name;
							});
						} else {
							questionAttributes.solutionFileSource = "dropbox";
							questionAttributes.solutionFile = "";
							questionAttributes.solutionFileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}

			// console.log(optionsBody);

			let transaction = await sequelize.transaction();
			Questions.create(question, { transaction })
				.then(async (questionResult) => {
					// Question Tags
					var tags = [];
					// let tagIds = JSON.parse(req.body.tagIds);
					tagIds.forEach((tagId) => {
						tags.push({
							tagsId: crypto.decrypt(tagId),
							questionId: questionResult.id
						});
					});
					QuestionTags.bulkCreate(tags, { transaction })
						.then(async (tagsResult) => {
							// Question Attributes
							// if (req.body.statementImage || req.body.solutionFileName || req.body.statementFileName ||
							//     req.body.hint || req.body.hintFileName || req.body.solutionFile || req.body.hintFile) {
							questionAttributes.questionId = questionResult.id;
							var qaRes = await QuestionsAttributes.create(questionAttributes, { transaction });
							// }

							var options = [];
							// let optionsBody = JSON.parse(req.body.options);
							// image: option.image,
							// 		fileName: option.fileName,
							// 		imageSource: option.imageSource,

							// console.log(optionsBody);
							optionsBody.forEach((option) => {
								options.push({
									questionsId: questionResult.id,
									image: option.image,
									fileName: option.fileName,
									title: option.title,
									correct: option.correct
								});
							});
							const optionRes = await QuestionsOptions.bulkCreate(options, { transaction });

							await transaction.commit();
							res.status(200).send({
								message: "Question created successfully."
							});
						})
						.catch(async (err) => {
							if (transaction) await transaction.rollback();

							emails.errorEmail(req, err);
							res.status(500).send({
								message: err.message || "Some error occurred while Question Tags."
							});
						});
				})
				.catch(async (err) => {
					if (transaction) await transaction.rollback();

					emails.errorEmail(req, err);
					res.status(500).send({
						message: err.message || "Some error occurred while creating the Question."
					});
				});
		}
	} catch (err) {
		// emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred.",
			err
		});
	}
};

// Update a Quiz Quesion by the id in the request
exports.updateQuestion = async (req, res) => {
	try {
		const joiSchema = Joi.object({
			statement: Joi.string().required(),
			duration: Joi.number()
				.integer()
				.required(),
			points: Joi.number()
				.integer()
				.required(),
			difficultyId: Joi.string().required(),
			typeId: Joi.string().required(),
			courseId: Joi.string().required(),
			statementImage: Joi.array()
				.items(Joi.any())
				.allow("")
				.optional(),
			statementFileName: Joi.string()
				.allow("")
				.optional(),
			statementImageSource: Joi.string().optional(),
			hint: Joi.string()
				.optional()
				.allow(""),
			hintFile: Joi.array()
				.items(Joi.any())
				.allow("")
				.optional(),
			hintFileName: Joi.string()
				.allow("")
				.optional(),
			hintFileSource: Joi.string().optional(),
			solutionFile: Joi.array()
				.items(Joi.any())
				.optional()
				.allow(""),
			solutionFileName: Joi.string()
				.allow("")
				.optional(),
			solutionFileSource: Joi.string().optional(),
			tagIds: Joi.array()
				.items(Joi.string().required())
				.min(1),
			options: Joi.array()
				.items(Joi.any())
				.min(1)
				.max(8)
				.required(),
			optionsLink: Joi.string().allow(""),
			hintLink: Joi.string().allow(""),
			soluctionLink: Joi.string().allow(""),
			statementLink: Joi.string().allow(""),
			"options-0": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-1": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-2": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-3": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-4": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-5": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-6": Joi.array()
				.items(Joi.any())
				.allow(""),
			"options-7": Joi.array().items(Joi.any().allow(""))
		});
		const { error, value } = joiSchema.validate(req.body);

		if (error) {
			emails.errorEmail(req, error);
			const message = error.details[0].message.replace(/"/g, "");
			res.status(400).send({
				message: message
			});
		} else {
			const questionId = crypto.decrypt(req.params.questionId);

			const question = {
				statement: req.body.statement,
				duration: req.body.duration,
				points: req.body.points,
				questionDifficultyId: crypto.decrypt(req.body.difficultyId),
				questionTypeId: crypto.decrypt(req.body.typeId),
				coursesId: crypto.decrypt(req.body.courseId),
				updatedBy: crypto.decrypt(req.userId)
			};

			// const questionAttributes = {
			// 	questionId: questionId,
			// 	statementImageSource: req.body.statementImageSource,
			// 	statementImage: req.body.statementImage,
			// 	statementFileName: req.body.statementFileName,
			// 	hint: req.body.hint,
			// 	hintFile: req.body.hintFile,
			// 	hintFileSource: req.body.hintFileSource,
			// 	hintFileName: req.body.hintFileName,
			// 	solutionFileSource: req.body.solutionFileSource,
			// 	solutionFile: req.body.solutionFile,
			// 	solutionFileName: req.body.solutionFileName
			// };

			const questionAttributes = {
				questionId: questionId,
				statementImageSource: undefined,
				statementImage: undefined,
				statementFileName: undefined,
				hint: undefined,
				hintFile: undefined,
				hintFileSource: undefined,
				hintFileName: undefined,
				solutionFileSource: undefined,
				solutionFile: undefined,
				solutionFileName: undefined
			};

			let body;
			const statementFile = req.files["statementImage"];
			const hintFile = req.files["hintFile"];
			const solutionFile = req.files["solutionFile"];
			const option0 = req.files["options-0"];
			const option1 = req.files["options-1"];
			const option2 = req.files["options-2"];
			const option3 = req.files["options-3"];
			const option4 = req.files["options-4"];
			const option5 = req.files["options-5"];
			const option6 = req.files["options-6"];
			const option7 = req.files["options-7"];

			if (option0) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option0, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[0].image = e.path_display;
								optionsBody[0].fileName = e.name;
							});
						} else {
							optionsBody[0].image = "";
							optionsBody[0].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}

			if (option1) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option1, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							// console.log(uploadedImages);
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[1].image = e.path_display;
								optionsBody[1].fileName = e.name;
							});
						} else {
							optionsBody[1].image = "";
							optionsBody[1].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}

			if (option2) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option2, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[2].image = e.path_display;
								optionsBody[2].fileName = e.name;
							});
						} else {
							optionsBody[2].image = "";
							optionsBody[2].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
			if (option3) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option3, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[3].image = e.path_display;
								optionsBody[3].fileName = e.name;
							});
						} else {
							optionsBody[3].image = "";
							optionsBody[3].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
			if (option4) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option4, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[4].image = e.path_display;
								optionsBody[4].fileName = e.name;
							});
						} else {
							optionsBody[4].image = "";
							optionsBody[4].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
			if (option5) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option5, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[5].image = e.path_display;
								optionsBody[5].fileName = e.name;
							});
						} else {
							optionsBody[5].image = "";
							optionsBody[5].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
			if (option6) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option6, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[6].image = e.path_display;
								optionsBody[6].fileName = e.name;
							});
						} else {
							optionsBody[6].image = "";
							optionsBody[6].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}
			if (option7) {
				let optionsLink = req.body.optionsLink;
				await uploadMultipleImages(option7, optionsLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								optionsBody[7].image = e.path_display;
								optionsBody[7].fileName = e.name;
							});
						} else {
							optionsBody[7].image = "";
							optionsBody[7].fileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}

			// const statementImage = req.files['statementImage'];

			if (statementFile) {
				let statementLink = req.body.statementLink;
				console.log(statementLink);
				await uploadMultipleImages(statementFile, statementLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								questionAttributes.statementImageSource = "dropbox";
								questionAttributes.statementImage = e.path_display;
								questionAttributes.statementFileName = e.name;
							});
						} else {
							questionAttributes.statementImageSource = "dropbox";
							questionAttributes.statementImage = "";
							questionAttributes.statementFileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}

			if (hintFile) {
				let hintLink = req.body.hintLink;
				console.log(hintLink);
				await uploadMultipleImages(hintFile, hintLink)
					.then((uploadedImages) => {
						let uu = uploadedImages == undefined;

						if (!uu) {
							body = uploadedImages;

							body.forEach((e, index) => {
								questionAttributes.hintFileSource = "dropbox";
								questionAttributes.hintFile = e.path_display;
								questionAttributes.hintFileName = e.name;
							});
						} else {
							questionAttributes.hintFileSource = "dropbox";
							questionAttributes.hintFile = "";
							questionAttributes.hintFileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}

			if (solutionFile) {
				let soluctionLink = req.body.soluctionLink;
				console.log(soluctionLink);
				await uploadMultipleImages(solutionFile, soluctionLink)
					.then((uploadedImages) => {
						// console.log(uploadedImages, 444);
						let uu = uploadedImages == undefined;
						if (!uu) {
							body = uploadedImages;
							body.forEach((e, index) => {
								questionAttributes.solutionFileSource = "dropbox";
								questionAttributes.solutionFile = e.path_display;
								questionAttributes.solutionFileName = e.name;
							});
						} else {
							questionAttributes.solutionFileSource = "dropbox";
							questionAttributes.solutionFile = "";
							questionAttributes.solutionFileName = "";
						}
					})
					.catch((error) => {
						console.error(error);
					});
			}

			// console.log(questionAttributes);

			let transaction = await sequelize.transaction();
			Questions.update(question, {
				where: { id: questionId, isActive: "Y" },
				transaction
			})
				.then(async (num) => {
					if (num == 1) {
						var options = [];
						req.body.options.forEach((option) => {
							options.push({
								questionsId: questionId,
								title: option.title,
								image: option.image,
								fileName: option.fileName,
								imageSource: option.imageSource,
								correct: option.correct
							});
						});

						var tags = [];
						req.body.tagIds.forEach((tagId) => {
							tags.push({
								tagsId: crypto.decrypt(tagId),
								questionId: questionId
							});
						});

						// console.log(questionAttributes);
						QuestionsAttributes.update(questionAttributes, { where: { questionId: questionId }, transaction })
							.then(async (questionAttributesReult) => {
								if (questionAttributesReult == 1) {
									await QuestionsOptions.destroy({ where: { questionsId: questionId }, transaction });
									QuestionsOptions.bulkCreate(options, { transaction })
										.then(async (optionsResult) => {
											await QuestionTags.destroy({ where: { questionId: questionId }, transaction });
											QuestionTags.bulkCreate(tags, { transaction })
												.then(async (tagsResult) => {
													await transaction.commit();
													res.status(200).send({
														message: "Question updated successfully."
													});
												})
												.catch(async (err) => {
													if (transaction) await transaction.rollback();

													emails.errorEmail(req, err);
													res.status(500).send({
														message: err.message || "Some error occurred while Question Tags."
													});
												});
										})
										.catch(async (err) => {
											if (transaction) await transaction.rollback();

											emails.errorEmail(req, err);
											res.status(500).send({
												message: err.message || "Some error occurred while creating the Question Options."
											});
										});
								} else {
									res.send({
										message: `Cannot update Question Attributes.`
									});
								}
							})
							.catch(async (err) => {
								if (transaction) await transaction.rollback();

								emails.errorEmail(req, err);
								res.status(500).send({
									message: err.message || "Some error occurred while creating the Question Attributes."
								});
							});
					} else {
						res.send({
							message: `Cannot update Question!.`
						});
					}
				})
				.catch(async (err) => {
					if (transaction) await transaction.rollback();
					console.log(err);
					emails.errorEmail(req, err);
					res.status(500).send({
						message: "Error updating Quiz Question."
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

// Find All Questions for Admin
exports.findAll = async (req, res) => {
	try {
		// let attributes = await QuestionsAttributes.findAll();
		// console.log(attributes);

		Questions.findAll({
			where: { isActive: "Y" },
			include: [
				{
					model: QuestionsAttributes,
					required: false,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt", "questionId"] }
				},
				{
					model: QuestionsOptions,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt", "questionsId"] }
				},
				{
					model: QuestionTypes,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt"] }
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
							include: [
								{
									model: Courses,
									where: { isActive: "Y" },
									include: [
										{
											model: Classes,
											where: { isActive: "Y" },
											attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
										}
									],
									attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy", "classId"] }
								}
							],
							attributes: ["id", "title"]
						}
					],
					attributes: ["id", "isActive", "questionId"]
				},
				{
					model: Courses,
					where: { isActive: "Y" },
					include: [
						{
							model: Classes,
							where: { isActive: "Y" },
							attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
						}
					],
					attributes: ["id", "title"]
				}
			],
			attributes: ["id", "statement", "duration", "points", "createdBy"]
		})
			.then((data) => {
				encryptHelper(data);
				res.send(data);
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: err.message || "Some error occurred while retrieving questions."
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};
// Find All Questions for Editor
exports.findAllForEditor = async (req, res) => {
	try {
		// let attributes = await QuestionsAttributes.findAll();
		// console.log(attributes);

		Questions.findAll({
			where: { isActive: "Y", createdBy: crypto.decrypt(req.userId) },
			include: [
				{
					model: QuestionsAttributes,
					required: false,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt", "questionId"] }
				},
				{
					model: QuestionsOptions,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt", "questionsId"] }
				},
				{
					model: QuestionTypes,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt"] }
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
							include: [
								{
									model: Courses,
									where: { isActive: "Y" },
									include: [
										{
											model: Classes,
											where: { isActive: "Y" },
											attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
										}
									],
									attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy", "classId"] }
								}
							],
							attributes: ["id", "title"]
						}
					],
					attributes: ["id", "isActive", "questionId"]
				},
				{
					model: Courses,
					where: { isActive: "Y" },
					include: [
						{
							model: Classes,
							where: { isActive: "Y" },
							attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
						}
					],
					attributes: ["id", "title"]
				}
			],
			attributes: ["id", "statement", "duration", "points", "createdBy"]
		})
			.then((data) => {
				console.log(data);
				encryptHelper(data);
				res.send(data);
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: err.message || "Some error occurred while retrieving questions."
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};
// Find All Questions for Teacher
exports.findAllForTeacher = (req, res) => {
	try {
		Questions.findAll({
			where: { isActive: "Y" },
			include: [
				{
					model: QuestionsAttributes,
					required: false,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt", "questionId"] }
				},
				{
					model: QuestionsOptions,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt", "questionsId"] }
				},
				{
					model: QuestionTypes,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt"] }
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
							include: [
								{
									model: Courses,
									where: { isActive: "Y" },
									include: [
										{
											model: Classes,
											where: { isActive: "Y" },
											attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
										},
										{ model: Teaches, where: { isActive: "Y", userId: crypto.decrypt(req.userId) } }
									],
									attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy", "classId"] }
								}
							],
							attributes: ["id", "title"]
						}
					],
					attributes: ["id", "isActive", "questionId"]
				},
				{
					model: Courses,
					where: { isActive: "Y" },
					include: [
						{
							model: Classes,
							where: { isActive: "Y" },
							attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
						},
						{ model: Teaches, where: { isActive: "Y", userId: crypto.decrypt(req.userId) } }
					],
					attributes: ["id", "title"]
				}
			],
			attributes: ["id", "statement", "duration", "points", "createdBy"]
		})
			.then((data) => {
				encryptHelper(data);
				res.send(data);
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: err.message || "Some error occurred while retrieving questions."
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Find All Questions of course for Admin
exports.findAllCourseQuestionsForAdmin = (req, res) => {
	try {
		const courseId = crypto.decrypt(req.params.courseId);

		Questions.findAll({
			where: { isActive: "Y" },
			include: [
				{
					model: QuestionsAttributes,
					required: false,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt", "questionId"] }
				},
				{
					model: QuestionsOptions,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt", "questionsId"] }
				},
				{
					model: QuestionTypes,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt"] }
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
							include: [
								{
									model: Courses,
									where: { isActive: "Y" },
									include: [
										{
											model: Classes,
											where: { isActive: "Y" },
											attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
										}
									],
									attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy", "classId"] }
								}
							],
							attributes: ["id", "title"]
						}
					],
					attributes: ["id", "isActive", "questionId"]
				},
				{
					model: Courses,
					where: { id: courseId, isActive: "Y" },
					include: [
						{
							model: Classes,
							where: { isActive: "Y" },
							attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
						}
					],
					attributes: ["id", "title"]
				}
			],
			attributes: ["id", "statement", "duration", "points", "createdBy"]
		})
			.then((data) => {
				encryptHelper(data);
				res.send(data);
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: err.message || "Some error occurred while retrieving questions of courses."
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Find All Questions of course for Teacher
exports.findAllCourseQuestions = (req, res) => {
	try {
		const courseId = crypto.decrypt(req.params.courseId);

		Questions.findAll({
			where: { isActive: "Y" },
			include: [
				{
					model: QuestionsAttributes,
					required: false,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt", "questionId"] }
				},
				{
					model: QuestionsOptions,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt", "questionsId"] }
				},
				{
					model: QuestionTypes,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt"] }
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
							include: [
								{
									model: Courses,
									where: { isActive: "Y" },
									include: [
										{
											model: Classes,
											where: { isActive: "Y" },
											attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
										},
										{ model: Teaches, where: { isActive: "Y", userId: crypto.decrypt(req.userId) } }
									],
									attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy", "classId"] }
								}
							],
							attributes: ["id", "title"]
						}
					],
					attributes: ["id", "isActive", "questionId"]
				},
				{
					model: Courses,
					where: { id: courseId, isActive: "Y" },
					include: [
						{
							model: Classes,
							where: { isActive: "Y" },
							attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
						}
					],
					attributes: ["id", "title"]
				}
			],
			attributes: ["id", "statement", "duration", "points", "createdBy"]
		})
			.then((data) => {
				encryptHelper(data);
				res.send(data);
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: err.message || "Some error occurred while retrieving questions of courses."
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Find Single Questions
exports.findQuestion = (req, res) => {
	try {
		const questionId = crypto.decrypt(req.params.questionId);

		Questions.findOne({
			where: { id: questionId, isActive: "Y" },
			include: [
				{
					model: QuestionsAttributes,
					required: false,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt", "questionId"] }
				},
				{
					model: QuestionsOptions,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt", "questionsId"] }
				},
				{
					model: QuestionTypes,
					where: { isActive: "Y" },
					attributes: { exclude: ["isActive", "createdAt", "updatedAt"] }
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
							include: [
								{
									model: Courses,
									where: { isActive: "Y" },
									include: [
										{
											model: Classes,
											where: { isActive: "Y" },
											attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy"] }
										}
									],
									attributes: { exclude: ["isActive", "createdAt", "updatedAt", "createdBy", "classId"] }
								}
							],
							attributes: ["id", "title"]
						}
					],
					attributes: ["id"]
				},
				{
					model: Courses,
					where: { isActive: "Y" },
					include: {
						model: Classes,
						where: { isActive: "Y" },
						attributes: ["id", "title"]
					},
					attributes: ["id", "title"]
				}
			],
			attributes: ["id", "statement", "duration", "points", "createdBy"]
		})
			.then((data) => {
				encryptHelper(data);
				res.send(data);
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: err.message || "Some error occurred while retrieving question."
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Retrieve all questions count.
exports.findQuestionsCount = async (req, res) => {
	try {
		var veryEasy = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 1 }
		});
		var easy = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 2 }
		});
		var medium = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 3 }
		});
		var hard = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 4 }
		});
		var veryHard = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 5 }
		});

		res.send({
			veryEasy: veryEasy,
			easy: easy,
			medium: medium,
			hard: hard,
			veryHard: veryHard
		});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};
// Retrieve questions count for teacher.
exports.findQuestionsCountForTeacher = async (req, res) => {
	try {
		const userId = crypto.decrypt(req.userId);

		var veryEasy = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 1 },
			include: {
				model: Courses,
				where: { isActive: "Y" },
				include: [{ model: Teaches, where: { isActive: "Y", userId: userId } }]
			}
		});
		var easy = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 2 },
			include: {
				model: Courses,
				where: { isActive: "Y" },
				include: [{ model: Teaches, where: { isActive: "Y", userId: userId } }]
			}
		});
		var medium = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 3 },
			include: {
				model: Courses,
				where: { isActive: "Y" },
				include: [{ model: Teaches, where: { isActive: "Y", userId: userId } }]
			}
		});
		var hard = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 4 },
			include: {
				model: Courses,
				where: { isActive: "Y" },
				include: [{ model: Teaches, where: { isActive: "Y", userId: userId } }]
			}
		});
		var veryHard = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 5 },
			include: {
				model: Courses,
				where: { isActive: "Y" },
				include: [{ model: Teaches, where: { isActive: "Y", userId: userId } }]
			}
		});

		res.send({
			veryEasy: veryEasy,
			easy: easy,
			medium: medium,
			hard: hard,
			veryHard: veryHard
		});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};
// Retrieve questions count for student.
exports.findQuestionsCountForStudent = async (req, res) => {
	try {
		const userId = crypto.decrypt(req.userId);
		const courseId = crypto.decrypt(req.params.courseId);

		var veryEasy = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 1 },
			include: {
				model: Courses,
				where: { id: courseId, isActive: "Y" }
			}
		});
		var easy = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 2 },
			include: {
				model: Courses,
				where: { id: courseId, isActive: "Y" }
			}
		});
		var medium = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 3 },
			include: {
				model: Courses,
				where: { id: courseId, isActive: "Y" }
			}
		});
		var hard = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 4 },
			include: {
				model: Courses,
				where: { id: courseId, isActive: "Y" }
			}
		});
		var veryHard = await Questions.count({
			where: { isActive: "Y", questionDifficultyId: 5 },
			include: {
				model: Courses,
				where: { id: courseId, isActive: "Y" }
			}
		});

		res.send({
			veryEasy: veryEasy,
			easy: easy,
			medium: medium,
			hard: hard,
			veryHard: veryHard
		});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};

// Delete with the specified id in the request
exports.delete = (req, res) => {
	try {
		Questions.update(
			{ isActive: "N" },
			{
				where: { id: crypto.decrypt(req.params.questionId), isActive: "Y" }
			}
		)
			.then((num) => {
				if (num == 1) {
					res.send({
						message: "Question was deleted successfully."
					});
				} else {
					res.send({
						message: `Cannot delete question. Maybe question was not found or req.body is empty!`
					});
				}
			})
			.catch((err) => {
				emails.errorEmail(req, err);
				res.status(500).send({
					message: "Error updating tag"
				});
			});
	} catch (err) {
		emails.errorEmail(req, err);

		res.status(500).send({
			message: err.message || "Some error occurred."
		});
	}
};
