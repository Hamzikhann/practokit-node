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

const Joi = require('@hapi/joi');
const { sequelize } = require("../../models");

// Create and Save a new Question
exports.create = async (req, res) => {
    console.log('entered create');

    try {
        const joiSchema = Joi.object({
            statement: Joi.string().required(),
            duration: Joi.number().integer().required(),
            points: Joi.number().integer().required(),
            difficultyId: Joi.string().required(),
            typeId: Joi.string().required(),
            courseId: Joi.string().required(),
            statementImage: Joi.string().required().allow(''),
            statementFileName: Joi.string().required().allow(''),
            statementImageSource: Joi.string().required(),
            hint: Joi.string().required().allow(''),
            hintFile: Joi.string().required().allow(''),
            hintFileName: Joi.string().required().allow(''),
            hintFileSource: Joi.string().required(),
            solutionFile: Joi.string().required().allow(''),
            solutionFileName: Joi.string().required().allow(''),
            solutionFileSource: Joi.string().required(),
            tagIds: Joi.array().items(Joi.string().required()).min(1),
            options: Joi.array().items(
                Joi.object().keys({
                    title: Joi.string().required(),
                    image: Joi.string().optional().allow(''),
                    imageSource: Joi.string().required().allow(''),
                    fileName: Joi.string().required().allow(''),
                    correct: Joi.boolean().required(),
                })
            ).min(1).max(8).required()
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);

            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
		console.log('joi veified');
            const question = {
                statement: req.body.statement,
                duration: req.body.duration,
                points: req.body.points,
                questionDifficultyId: crypto.decrypt(req.body.difficultyId),
                questionTypeId: crypto.decrypt(req.body.typeId),
                coursesId: crypto.decrypt(req.body.courseId),
                createdBy: crypto.decrypt(req.userId),
            };
            const questionAttributes = {
                statementImageSource: req.body.statementImageSource,
                statementImage: req.body.statementImage,
                statementFileName: req.body.statementFileName,
                hint: req.body.hint,
                hintFile: req.body.hintFile,
                hintFileSource: req.body.hintFileSource,
                hintFileName: req.body.hintFileName,
                solutionFileSource: req.body.solutionFileSource,
                solutionFile: req.body.solutionFile,
                solutionFileName: req.body.solutionFileName
            };

            let transaction = await sequelize.transaction();
            Questions.create(question, { transaction })
                .then(async questionResult => {

                    // Question Tags
                    var tags = [];
                    req.body.tagIds.forEach(tagId => {
                        tags.push({
                            tagsId: crypto.decrypt(tagId),
                            questionId: questionResult.id
                        });
                    })
                    QuestionTags.bulkCreate(tags, { transaction })
                        .then(async tagsResult => {

                            // Question Attributes
                            if (req.body.statementImage || req.body.solutionFileName || req.body.statementFileName ||
                                req.body.hint || req.body.hintFileName || req.body.solutionFile || req.body.hintFile) {
                                questionAttributes.questionId = questionResult.id;
                                var qaRes = await QuestionsAttributes.create(questionAttributes, { transaction })
                            }

                            var options = [];
                            req.body.options.forEach(option => {
                                options.push({
                                    questionsId: questionResult.id,
                                    title: option.title,
                                    image: option.image,
                                    fileName: option.fileName,
                                    imageSource: option.imageSource,
                                    correct: option.correct,
                                })
                            });
                            const optionRes = await QuestionsOptions.bulkCreate(options, { transaction })

                            await transaction.commit();
                            res.status(200).send({
                                message: "Question created successfully."
                            });

                        }).catch(async err => {
                            if (transaction) await transaction.rollback();

                            emails.errorEmail(req, err);
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while Question Tags."
                            });
                        });
                })
                .catch(async err => {
                    if (transaction) await transaction.rollback();

                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Question."
                    });
                });
        }
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Update a Quiz Quesion by the id in the request
exports.updateQuestion = async (req, res) => {

    try {
        const joiSchema = Joi.object({
            statement: Joi.string().required(),
            duration: Joi.number().integer().required(),
            points: Joi.number().integer().required(),
            difficultyId: Joi.string().required(),
            typeId: Joi.string().required(),
            courseId: Joi.string().required(),
            statementImage: Joi.string().required().allow(''),
            statementFileName: Joi.string().required().allow(''),
            statementImageSource: Joi.string().required(),
            hint: Joi.string().required().allow(''),
            hintFile: Joi.string().required().allow(''),
            hintFileName: Joi.string().required().allow(''),
            hintFileSource: Joi.string().required(),
            solutionFile: Joi.string().required().allow(''),
            solutionFileName: Joi.string().required().allow(''),
            solutionFileSource: Joi.string().required(),
            tagIds: Joi.array().items(Joi.string().required()).min(1),
            options: Joi.array().items(
                Joi.object().keys({
                    title: Joi.string().required(),
                    image: Joi.optional().allow(''),
                    imageSource: Joi.string().required(),
                    fileName: Joi.string().required().allow(''),
                    correct: Joi.boolean().required(),
                })
            ).min(2).max(8).required()
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);
            const message = error.details[0].message.replace(/"/g, '');
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

            const questionAttributes = {
                questionId: questionId,
                statementImageSource: req.body.statementImageSource,
                statementImage: req.body.statementImage,
                statementFileName: req.body.statementFileName,
                hint: req.body.hint,
                hintFile: req.body.hintFile,
                hintFileSource: req.body.hintFileSource,
                hintFileName: req.body.hintFileName,
                solutionFileSource: req.body.solutionFileSource,
                solutionFile: req.body.solutionFile,
                solutionFileName: req.body.solutionFileName
            };

            let transaction = await sequelize.transaction();
            Questions.update(question, {
                where: { id: questionId, isActive: 'Y' }, transaction
            })
                .then(async num => {
                    if (num == 1) {
                        var options = [];
                        req.body.options.forEach(option => {
                            options.push({
                                questionsId: questionId,
                                title: option.title,
                                image: option.image,
                                fileName: option.fileName,
                                imageSource: option.imageSource,
                                correct: option.correct,
                            })
                        });

                        var tags = [];
                        req.body.tagIds.forEach(tagId => {
                            tags.push({
                                tagsId: crypto.decrypt(tagId),
                                questionId: questionId
                            });
                        });

                        QuestionsAttributes.update(questionAttributes, { where: { questionId: questionId }, transaction })
                            .then(async questionAttributesReult => {
                                if (questionAttributesReult == 1) {

                                    await QuestionsOptions.destroy({ where: { questionsId: questionId }, transaction })
                                    QuestionsOptions.bulkCreate(options, { transaction })
                                        .then(async optionsResult => {

                                            await QuestionTags.destroy({ where: { questionId: questionId }, transaction })
                                            QuestionTags.bulkCreate(tags, { transaction })
                                                .then(async tagsResult => {

                                                    await transaction.commit();
                                                    res.status(200).send({
                                                        message: "Question updated successfully."
                                                    });

                                                }).catch(async err => {
                                                    if (transaction) await transaction.rollback();

                                                    emails.errorEmail(req, err);
                                                    res.status(500).send({
                                                        message:
                                                            err.message || "Some error occurred while Question Tags."
                                                    });
                                                });

                                        }).catch(async err => {
                                            if (transaction) await transaction.rollback();

                                            emails.errorEmail(req, err);
                                            res.status(500).send({
                                                message:
                                                    err.message || "Some error occurred while creating the Question Options."
                                            });
                                        });

                                } else {
                                    res.send({
                                        message: `Cannot update Question Attributes.`
                                    });
                                }
                            }).catch(async err => {
                                if (transaction) await transaction.rollback();

                                emails.errorEmail(req, err);
                                res.status(500).send({
                                    message:
                                        err.message || "Some error occurred while creating the Question Attributes."
                                });
                            });
                    } else {
                        res.send({
                            message: `Cannot update Question!.`
                        });
                    }
                })
                .catch(async err => {
                    if (transaction) await transaction.rollback();
                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message: "Error updating Quiz Question."
                    });
                });
        }
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Find All Questions for Admin
exports.findAll = (req, res) => {

    try {
        Questions.findAll({
            where: { isActive: 'Y' },
            include: [
                {
                    model: QuestionsAttributes,
                    required: false,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'questionId'] }
                },
                {
                    model: QuestionsOptions,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'questionsId'] }
                },
                {
                    model: QuestionTypes,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt'] }
                },
                {
                    model: QuestionDifficulties,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                },
                {
                    model: QuestionTags,
                    where: { isActive: 'Y' },
                    include: [
                        {
                            model: Tags,
                            where: { isActive: 'Y' },
                            include: [
                                {
                                    model: Courses,
                                    where: { isActive: 'Y' },
                                    include: [
                                        {
                                            model: Classes,
                                            where: { isActive: 'Y' },
                                            attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                                        }
                                    ],
                                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy', 'classId'] }
                                }
                            ],
                            attributes: ['id', 'title']
                        }
                    ],
                    attributes: ['id', 'isActive', 'questionId']
                },
                {
                    model: Courses,
                    where: { isActive: 'Y' },
                    include: [
                        {
                            model: Classes,
                            where: { isActive: 'Y' },
                            attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                        }
                    ],
                    attributes: ['id', 'title']
                }
            ],
            attributes: ['id', 'statement', 'duration', 'points', 'createdBy']
        })
            .then(data => {
                encryptHelper(data);
                res.send(data);
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving questions."
                });
            });
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};
// Find All Questions for Editor
exports.findAllForEditor = (req, res) => {

    try {
        Questions.findAll({
            where: { isActive: 'Y', createdBy: crypto.decrypt(req.userId) },
            include: [
                {
                    model: QuestionsAttributes,
                    required: false,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'questionId'] }
                },
                {
                    model: QuestionsOptions,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'questionsId'] }
                },
                {
                    model: QuestionTypes,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt'] }
                },
                {
                    model: QuestionDifficulties,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                },
                {
                    model: QuestionTags,
                    where: { isActive: 'Y' },
                    include: [
                        {
                            model: Tags,
                            where: { isActive: 'Y' },
                            include: [
                                {
                                    model: Courses,
                                    where: { isActive: 'Y' },
                                    include: [
                                        {
                                            model: Classes,
                                            where: { isActive: 'Y' },
                                            attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                                        }
                                    ],
                                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy', 'classId'] }
                                }
                            ],
                            attributes: ['id', 'title']
                        }
                    ],
                    attributes: ['id', 'isActive', 'questionId']
                },
                {
                    model: Courses,
                    where: { isActive: 'Y' },
                    include: [
                        {
                            model: Classes,
                            where: { isActive: 'Y' },
                            attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                        }
                    ],
                    attributes: ['id', 'title']
                }
            ],
            attributes: ['id', 'statement', 'duration', 'points', 'createdBy']
        })
            .then(data => {
                encryptHelper(data);
                res.send(data);
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving questions."
                });
            });
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};
// Find All Questions for Teacher
exports.findAllForTeacher = (req, res) => {

    try {
        Questions.findAll({
            where: { isActive: 'Y' },
            include: [
                {
                    model: QuestionsAttributes,
                    required: false,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'questionId'] }
                },
                {
                    model: QuestionsOptions,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'questionsId'] }
                },
                {
                    model: QuestionTypes,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt'] }
                },
                {
                    model: QuestionDifficulties,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                },
                {
                    model: QuestionTags,
                    where: { isActive: 'Y' },
                    include: [
                        {
                            model: Tags,
                            where: { isActive: 'Y' },
                            include: [
                                {
                                    model: Courses,
                                    where: { isActive: 'Y' },
                                    include: [
                                        {
                                            model: Classes,
                                            where: { isActive: 'Y' },
                                            attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                                        },
                                        { model: Teaches, where: { isActive: 'Y', userId: crypto.decrypt(req.userId) } }
                                    ],
                                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy', 'classId'] }
                                }
                            ],
                            attributes: ['id', 'title']
                        }
                    ],
                    attributes: ['id', 'isActive', 'questionId']
                },
                {
                    model: Courses,
                    where: { isActive: 'Y' },
                    include: [
                        {
                            model: Classes,
                            where: { isActive: 'Y' },
                            attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                        },
                        { model: Teaches, where: { isActive: 'Y', userId: crypto.decrypt(req.userId) } }
                    ],
                    attributes: ['id', 'title']
                }
            ],
            attributes: ['id', 'statement', 'duration', 'points', 'createdBy']
        })
            .then(data => {
                encryptHelper(data);
                res.send(data);
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving questions."
                });
            });
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Find All Questions of course for Teacher
exports.findAllCourseQuestions = (req, res) => {

    try {
        const courseId = crypto.decrypt(req.params.courseId)

        Questions.findAll({
            where: { isActive: 'Y' },
            include: [
                {
                    model: QuestionsAttributes,
                    required: false,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'questionId'] }
                },
                {
                    model: QuestionsOptions,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'questionsId'] }
                },
                {
                    model: QuestionTypes,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt'] }
                },
                {
                    model: QuestionDifficulties,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                },
                {
                    model: QuestionTags,
                    where: { isActive: 'Y' },
                    include: [
                        {
                            model: Tags,
                            where: { isActive: 'Y' },
                            include: [
                                {
                                    model: Courses,
                                    where: { isActive: 'Y' },
                                    include: [
                                        {
                                            model: Classes,
                                            where: { isActive: 'Y' },
                                            attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                                        },
                                        { model: Teaches, where: { isActive: 'Y', userId: crypto.decrypt(req.userId) } }
                                    ],
                                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy', 'classId'] }
                                }
                            ],
                            attributes: ['id', 'title']
                        }
                    ],
                    attributes: ['id', 'isActive', 'questionId']
                },
                {
                    model: Courses,
                    where: { id: courseId, isActive: 'Y' },
                    include: [
                        {
                            model: Classes,
                            where: { isActive: 'Y' },
                            attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                        }
                    ],
                    attributes: ['id', 'title']
                }
            ],
            attributes: ['id', 'statement', 'duration', 'points', 'createdBy']
        })
            .then(data => {
                encryptHelper(data);
                res.send(data);
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving questions of courses."
                });
            });
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Find Single Questions
exports.findQuestion = (req, res) => {

    try {
        const questionId = crypto.decrypt(req.params.questionId)

        Questions.findOne({
            where: { id: questionId, isActive: 'Y' },
            include: [
                {
                    model: QuestionsAttributes,
                    required: false,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'questionId'] }
                },
                {
                    model: QuestionsOptions,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'questionsId'] }
                },
                {
                    model: QuestionTypes,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt'] }
                },
                {
                    model: QuestionDifficulties,
                    where: { isActive: 'Y' },
                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                },
                {
                    model: QuestionTags,
                    where: { isActive: 'Y' },
                    include: [
                        {
                            model: Tags,
                            where: { isActive: 'Y' },
                            include: [
                                {
                                    model: Courses,
                                    where: { isActive: 'Y' },
                                    include: [
                                        {
                                            model: Classes,
                                            where: { isActive: 'Y' },
                                            attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy'] }
                                        }
                                    ],
                                    attributes: { exclude: ['isActive', 'createdAt', 'updatedAt', 'createdBy', 'classId'] }
                                }
                            ],
                            attributes: ['id', 'title']
                        }
                    ],
                    attributes: ['id']
                },
                {
                    model: Courses,
                    where: { isActive: 'Y' },
                    include: {
                        model: Classes,
                        where: { isActive: 'Y' },
                        attributes: ['id', 'title']
                    },
                    attributes: ['id', 'title']
                },

            ],
            attributes: ['id', 'statement', 'duration', 'points', 'createdBy']
        })
            .then(data => {
                encryptHelper(data);
                res.send(data);
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving question."
                });
            });
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Retrieve questions count.
exports.findQuestionsCount = async (req, res) => {
    try {
        var veryEasy = await Questions.count({
            where: { isActive: 'Y', questionDifficultyId: 1 }
        })
        var easy = await Questions.count({
            where: { isActive: 'Y', questionDifficultyId: 2 }
        })
        var medium = await Questions.count({
            where: { isActive: 'Y', questionDifficultyId: 3 }
        })
        var hard = await Questions.count({
            where: { isActive: 'Y', questionDifficultyId: 4 }
        })
        var veryHard = await Questions.count({
            where: { isActive: 'Y', questionDifficultyId: 5 }
        })

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
            message:
                err.message || "Some error occurred."
        });
    }
};
// Retrieve questions count.
exports.findQuestionsCountForTeacher = async (req, res) => {
    try {
        var veryEasy = await Questions.count({
            where: { isActive: 'Y', questionDifficultyId: 1 },
            include: {
                model: Courses, where: { isActive: 'Y' },
                include: [{ model: Teaches, where: { isActive: 'Y', userId: crypto.decrypt(req.userId) } }],
            },
        })
        var easy = await Questions.count({
            where: { isActive: 'Y', questionDifficultyId: 2 },
            include: {
                model: Courses, where: { isActive: 'Y' },
                include: [{ model: Teaches, where: { isActive: 'Y', userId: crypto.decrypt(req.userId) } }],
            },
        })
        var medium = await Questions.count({
            where: { isActive: 'Y', questionDifficultyId: 3 },
            include: {
                model: Courses, where: { isActive: 'Y' },
                include: [{ model: Teaches, where: { isActive: 'Y', userId: crypto.decrypt(req.userId) } }],
            },
        })
        var hard = await Questions.count({
            where: { isActive: 'Y', questionDifficultyId: 4 },
            include: {
                model: Courses, where: { isActive: 'Y' },
                include: [{ model: Teaches, where: { isActive: 'Y', userId: crypto.decrypt(req.userId) } }],
            },
        })
        var veryHard = await Questions.count({
            where: { isActive: 'Y', questionDifficultyId: 5 },
            include: {
                model: Courses, where: { isActive: 'Y' },
                include: [{ model: Teaches, where: { isActive: 'Y', userId: crypto.decrypt(req.userId) } }],
            },
        })

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
            message:
                err.message || "Some error occurred."
        });
    }
};

// Delete with the specified id in the request
exports.delete = (req, res) => {
    try {
        Questions.update({ isActive: 'N' }, {
            where: { id: crypto.decrypt(req.params.questionId), isActive: 'Y' }
        })
            .then(num => {
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
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message: "Error updating tag"
                });
            });
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};
