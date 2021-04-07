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

const Joi = require('@hapi/joi');
const { sequelize } = require("../../models");

// Create and Save a new Question
exports.create = async (req, res) => {

    try {
        // req.body.options = JSON.parse(req.body.options);
        // req.body.options.forEach((option, index) => {
        //     req.body.options[index] = JSON.parse(option);
        // });
            // Validate request
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

                    questionAttributes.questionId = questionResult.id;

                    var options = [];
                    req.body.options.forEach(option => {
                        console.log(option.fileName);
                        options.push({
                            questionsId: questionResult.id,
                            title: option.title,
                            fileName: option.fileName,
                            imageSource: option.imageSource,
                            correct: option.correct,
                        })
                    });

                    var tags = [];
                    req.body.tagIds.forEach(tagId => {
                        tags.push({
                            tagsId: crypto.decrypt(tagId),
                            questionId: questionResult.id
                        });
                    })

                    QuestionsAttributes.create(questionAttributes, { transaction })
                        .then(async questionAttributesReult => {

                            QuestionsOptions.bulkCreate(options, { transaction })
                                .then(async optionsResult => {

                                    QuestionTags.bulkCreate(tags, { transaction })
                                        .then(async tagsResult => {

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

                                }).catch(async err => {
                                    if (transaction) await transaction.rollback();

                                    emails.errorEmail(req, err);
                                    res.status(500).send({
                                        message:
                                            err.message || "Some error occurred while creating the Question Options."
                                    });
                                });

                        })
                        .catch(async err => {
                            if (transaction) await transaction.rollback();

                            emails.errorEmail(req, err);
                            res.status(500).send({
                                message:
                                    err.message || "Some error occurred while creating the Question Attributes."
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

// Find Single Questions
exports.findQuestion = (req, res) => {

    try {
        const questionId = crypto.decrypt(req.params.questionId)

        Questions.findOne({
            where: { id: questionId, isActive: 'Y' },
            include: [
                {
                    model: QuestionsAttributes,
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
            attributes: ['id', 'statement', 'duration', 'points']
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
// Find All Questions
exports.findAll = (req, res) => {

    try {
        Questions.findAll({
            where: { isActive: 'Y' },
            include: [
                {
                    model: QuestionsAttributes,
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
                    attributes: ['id', 'title'] 
                }
            ],
            attributes: ['id', 'statement', 'duration', 'points']
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
// Find All Questions
exports.findQuestionsOfCourse = (req, res) => {

    try {
        Questions.findAll({
            where: { isActive: 'Y' },
            include: [
                {
                    model: QuestionsAttributes,
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
                    where: { id:crypto.decrypt(req.params.courseId), isActive: 'Y' },
                    attributes: ['id', 'title'] 
                }
            ],
            attributes: ['id', 'statement', 'duration', 'points']
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
