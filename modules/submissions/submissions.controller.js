const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const Sequelize = require('sequelize');

const Quizzes = db.quizzes;
const QuestionTypes = db.questionType;
const QuizSubmissions = db.quizSubmission;
const QuizSubmissionResponse = db.quizSubmissionResponse;

const Courses = db.courses;
const Classes = db.classes;
const Tags = db.tags;
const Questions = db.questions;
const QuestionsAttributes = db.questionsAttributes;
const QuestionsOptions = db.questionsOptions;
const QuestionTags = db.questionTags;
const QuestionDifficulties = db.questionDifficulties;
const Users = db.users;
const Roles = db.roles;

const Op = db.Sequelize.Op;
const Joi = require('@hapi/joi');
const { sequelize } = require("../../models");

// Create and Save a new Quiz Submission
exports.create = async (req, res) => {

    try {
        // Validate request
        const joiSchema = Joi.object({
            quizId: Joi.string().required(),
            result: Joi.number().integer().required(),
            response: Joi.string().required()
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            console.log('joi error');

            emails.errorEmail(req, error);

            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            let transaction = await sequelize.transaction();
            QuizSubmissions.create({ quizzId: crypto.decrypt(req.body.quizId), result: req.body.result }, { transaction })
                .then(async submissionRes => {

                    await QuizSubmissionResponse.create({ response: req.body.response, quizSubmissionId: submissionRes.id },
                        { transaction })

                    await transaction.commit();
                    res.status(200).send({
                        message: "Question Submission created successfully."
                    })

                })
                .catch(async err => {
                    if (transaction) await transaction.rollback();

                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Quiz Submission."
                    });
                });
        }
    } catch (err) {
        emails.errorEmail(req, err);

        console.log('error');
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Find All Quiz Submission
exports.findAll = (req, res) => {

    try {
        Quizzes.findAll({
            where: { isActive: 'Y' },
            include: [
                {
                    model: Courses,
                    include: [
                        {
                            model: Classes,
                            attributes: ['title'],
                        }
                    ],
                    attributes: ['title'],
                },
                {
                    model: QuestionDifficulties,
                    attributes: ['title'],
                },
                {
                    model: QuestionTypes,
                    attributes: ['title'],
                },
                {
                    model: QuizSubmissions,
                    where: { isActive: 'Y' },
                    include: [
                        {
                            model: QuizSubmissionResponse,
                            where: { isActive: 'Y' },
                            attributes: ['response']
                        }
                    ],
                    attributes: ['id', 'result', 'quizId']
                },
                {
                    model: Users,
                    include: [
                        {
                            model: Roles,
                            where: { isActive: 'Y' },
                            attributes: ['title'],
                        }
                    ],
                    attributes: ['firstName', 'lastName', 'email', 'password'],
                },
            ],
            attributes: ['id', 'questionsCount', 'questionTagsIdList'],
        })
            .then(async data => {
                encryptHelper(data);
                res.send(data);
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Questioniz Submission"
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
// Find Single Quiz Submission
exports.findById = (req, res) => {

    try {
        Quizzes.findOne({
            where: { isActive: 'Y', id: crypto.decrypt(req.params.id) },
            include: [
                {
                    model: Courses,
                    include: [
                        {
                            model: Classes,
                            attributes: ['title'],
                        }
                    ],
                    attributes: ['title'],
                },
                {
                    model: QuestionDifficulties,
                    attributes: ['title'],
                },
                {
                    model: QuestionTypes,
                    attributes: ['title'],
                },
                {
                    model: QuizSubmissions,
                    where: { isActive: 'Y' },
                    include: [
                        {
                            model: QuizSubmissionResponse,
                            where: { isActive: 'Y' },
                            attributes: ['response']
                        }
                    ],
                    attributes: ['id', 'result', 'quizId']
                },
                {
                    model: Users,
                    include: [
                        {
                            model: Roles,
                            where: { isActive: 'Y' },
                            attributes: ['title'],
                        }
                    ],
                    attributes: ['firstName', 'lastName', 'email', 'password'],
                },
            ],
            attributes: ['id', 'questionsCount', 'questionTagsIdList'],
        })
            .then(async data => {

                if (data && data.questionTagsIdList) {
                    data.dataValues.tags = await Tags.findAll({
                        where: { isActive: 'Y', id: JSON.parse(data.questionTagsIdList) },
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
                    })
                }

                encryptHelper(data);
                res.send({ Quiz: data });
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Questioniz Submission"
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
// Find Single Quiz Submission
exports.findByUserId = (req, res) => {

    try {
        Quizzes.findAll({
            where: { isActive: 'Y', createdBy: crypto.decrypt(req.params.id) },
            include: [
                {
                    model: Courses,
                    include: [
                        {
                            model: Classes,
                            attributes: ['title'],
                        }
                    ],
                    attributes: ['title'],
                },
                {
                    model: QuestionDifficulties,
                    attributes: ['title'],
                },
                {
                    model: QuestionTypes,
                    attributes: ['title'],
                },
                {
                    model: QuizSubmissions,
                    where: { isActive: 'Y' },
                    include: [
                        {
                            model: QuizSubmissionResponse,
                            where: { isActive: 'Y' },
                            attributes: ['response']
                        }
                    ],
                    attributes: ['id', 'result', 'quizId']
                },
                {
                    model: Users,
                    include: [
                        {
                            model: Roles,
                            where: { isActive: 'Y' },
                            attributes: ['title'],
                        }
                    ],
                    attributes: ['firstName', 'lastName', 'email', 'password'],
                },
            ],
            attributes: ['id', 'questionsCount', 'questionTagsIdList'],
        })
            .then(async data => {

                encryptHelper(data);
                res.send({ Quiz: data });
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Quiz Submission by User Id."
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
// Find Single Quiz Submission
exports.findByCourseId = (req, res) => {

    try {
        Quizzes.findAll({
            where: { isActive: 'Y', courseId: crypto.decrypt(req.params.id) },
            include: [
                {
                    model: Courses,
                    include: [
                        {
                            model: Classes,
                            attributes: ['title'],
                        }
                    ],
                    attributes: ['title'],
                },
                {
                    model: QuestionDifficulties,
                    attributes: ['title'],
                },
                {
                    model: QuestionTypes,
                    attributes: ['title'],
                },
                {
                    model: QuizSubmissions,
                    where: { isActive: 'Y' },
                    include: [
                        {
                            model: QuizSubmissionResponse,
                            where: { isActive: 'Y' },
                            attributes: ['response']
                        }
                    ],
                    attributes: ['id', 'result', 'quizId']
                },
                {
                    model: Users,
                    include: [
                        {
                            model: Roles,
                            where: { isActive: 'Y' },
                            attributes: ['title'],
                        }
                    ],
                    attributes: ['firstName', 'lastName', 'email', 'password'],
                },
            ],
            attributes: ['id', 'questionsCount', 'questionTagsIdList'],
        })
            .then(async data => {
                encryptHelper(data);
                res.send({ Quiz: data });
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Quiz Submission by Course Id."
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

// Delete a Quiz Submission with the specified id in the request
exports.delete = (req, res) => {
    try {
        QuizSubmissions.update({ isActive: 'N' }, {
            where: { id: crypto.decrypt(req.params.id) }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "Quiz Submission was deleted successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot delete Quiz Submission. Maybe Quiz Submission was not found or req.body is empty!`
                    });
                }
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message: "Error updating Quiz Submission"
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
