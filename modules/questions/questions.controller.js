const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const notifications = require("../../utils/notifications");
const emails = require("../../utils/emails");
const Sequelize = require('sequelize');

const Courses = db.courses;
const Tags = db.tags;
const Questions = db.questions;
const QuestionsAttributes = db.questionsAttributes;
const QuestionsOptions = db.questionsOptions;
const QuestionTags = db.questionTags;
const QuestionTypes = db.questionType;
const QuestionDifficulties = db.questionDifficulties;
const Classes = db.classes;

const Op = db.Sequelize.Op;
const Joi = require('@hapi/joi');
const { sequelize } = require("../../models");

// Create and Save a new Question
exports.create = async (req, res) => {

    try {
        // Validate request
        const joiSchema = Joi.object({
            statement: Joi.string().required(),
            duration: Joi.number().integer().required(),
            points: Joi.number().integer().required(),
            difficultyId: Joi.string().required(),
            typeId: Joi.string().required(),
            courseId: Joi.string().required(),
            // statementImage: Joi.string().required().allow(''),
            statementImageSource: Joi.string().required(),
            hint: Joi.string().required().allow(''),
            // hintFile: Joi.string().required().allow(''),
            hintFileSource: Joi.string().required(),
            // solutionFile: Joi.string().required().allow(''),
            solutionFileSource: Joi.string().required(),
            tagIds: Joi.array().items(Joi.string().required()).min(1),
            options: Joi.array().items(
                Joi.object().keys({
                    title: Joi.string().required(),
                    // image: Joi.string().optional().allow(''),
                    imageSource: Joi.string().optional().allow(''),
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
                hint: req.body.hint,
                hintFileSource: req.body.hintFileSource,
                solutionFileSource: req.body.solutionFileSource
            };

            const file = req.files;
            if (file['statementImage']) {
                questionAttributes.statementImage = file['statementImage'][0].path;
            }
            if (file['hintFile']) {
                questionAttributes.hintFile = file['hintFile'][0].path;
            }
            if (file['solutionFile']) {
                questionAttributes.solutionFile = file['solutionFile'][0].path;
            }

            let transaction = await sequelize.transaction();
            Questions.create(question, { transaction })
                .then(async questionResult => {

                    questionAttributes.questionId = questionResult.id;

                    var options = [];
                    req.body.options.forEach(option => {
                        options.push({
                            title: option.title,
                            imageSource: option.imageSource,
                            correct: option.correct,
                            questionsId: questionResult.id
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
        if (transaction) await transaction.rollback();

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

// Update a Tag by the id in the request
// exports.update = (req, res) => {

//     try {
//         const joiSchema = Joi.object({
//             statement: Joi.string().required(),
//             duration: Joi.number().integer().required(),
//             points: Joi.number().integer().required(),
//             difficultyId: Joi.string().required(),
//             typeId: Joi.string().required(),
//             courseId: Joi.string().required(),
//             // statementImage: Joi.string().required().allow(''),
//             statementImageSource: Joi.string().required(),
//             hint: Joi.string().required().allow(''),
//             // hintFile: Joi.string().required().allow(''),
//             hintFileSource: Joi.string().required(),
//             // solutionFile: Joi.string().required().allow(''),
//             solutionFileSource: Joi.string().required(),
//             tagIds: Joi.array().items(Joi.string().required()).min(1),
//             options: Joi.array().items(
//                 Joi.object().keys({
//                     title: Joi.string().required(),
//                     // image: Joi.string().optional().allow(''),
//                     imageSource: Joi.string().optional().allow(''),
//                     correct: Joi.boolean().required(),
//                 })
//             ).min(2).max(8).required()
//         });
//         const { error, value } = joiSchema.validate(req.body);

//         if (error) {
//             const message = error.details[0].message.replace(/"/g, '');
//             res.status(400).send({
//                 message: message
//             });
//         } else {

//             const question = {
//                 statement: req.body.statement,
//                 duration: req.body.duration,
//                 points: req.body.points,
//                 questionDifficultyId: crypto.decrypt(req.body.difficultyId),
//                 questionTypeId: crypto.decrypt(req.body.typeId),
//                 coursesId: crypto.decrypt(req.body.courseId),
//                 createdBy: crypto.decrypt(req.userId),
//             };

//             const questionAttributes = {
//                 statementImageSource: req.body.statementImageSource,
//                 hint: req.body.hint,
//                 hintFileSource: req.body.hintFileSource,
//                 solutionFileSource: req.body.solutionFileSource
//             };

//             const file = req.files;
//             if (file['statementImage']) {
//                 questionAttributes.statementImage = file['statementImage'][0].path;
//             }
//             if (file['hintFile']) {
//                 questionAttributes.hintFile = file['hintFile'][0].path;
//             }
//             if (file['solutionFile']) {
//                 questionAttributes.solutionFile = file['solutionFile'][0].path;
//             }


//             Tags.update(tag, { where: { id: TagId, isActive: 'Y', createdBy: userId } })
//                 .then(num => {
//                     if (num == 1) {
//                         res.send({
//                             message: "Tag was updated successfully."
//                         });
//                     } else {
//                         res.send({
//                             message: `Cannot update Tag. Maybe Tag was not found or req.body is empty!`
//                         });
//                     }
//                 })
//                 .catch(err => {
//                     emails.errorEmail(req, err);
//                     res.status(500).send({
//                         message: "Error updating Tag"
//                     });
//                 });
//         }
//     } catch (err) {
//         emails.errorEmail(req, err);

//         res.status(500).send({
//             message:
//                 err.message || "Some error occurred."
//         });
//     }
// };

// Delete a Tag with the specified id in the request
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
