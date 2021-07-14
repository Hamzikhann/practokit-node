const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const Sequelize = require('sequelize');

const Quizzes = db.quizzes;
const QuizSubmissions = db.quizSubmissions;
const QuizSubmissionResponse = db.quizSubmissionResponse;
const Questions = db.questions;
const QuestionsOptions = db.questionsOptions;
const Users = db.users;
const Courses = db.courses;
const Classes = db.classes;

const Op = db.Sequelize.Op;
const Joi = require('@hapi/joi');
const { sequelize } = require("../../models");

// Create and Save a new Quiz Submission
exports.create = async (req, res) => {

    try {
        // Validate request
        const joiSchema = Joi.object({
            quizId: Joi.string().required(),
            response: Joi.string().required()
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);

            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            let transaction = await sequelize.transaction();

            const quizId = crypto.decrypt(req.body.quizId)
            var quizResponse = JSON.parse(req.body.response);
            var result = totalMarks = totalQuestions = timeSpend = wrong = 0;
            const questionsIdList = []

            const oldQuizAttributes = await QuizSubmissions.findOne({
                where: { quizzId: quizId, userId: crypto.decrypt(req.userId) }
            })

            if (!oldQuizAttributes) {
                quizResponse.forEach((element) => {
                    questionsIdList.push(crypto.decrypt(element.id))
                    totalMarks += element.points;
                    timeSpend = element.remainingDuration >= 0 ? timeSpend + (element.duration - element.remainingDuration) : timeSpend;
                });

                const questionsCorrectAnswers = await Questions.findAll({
                    where: { id: questionsIdList }, attributes: ['id'],
                    include: [{ model: QuestionsOptions, attributes: ['id', 'correct'] }]
                })

                var list = {};
                questionsCorrectAnswers.forEach((element) => {
                    element.questionsOptions.forEach(option => {
                        if (option.correct) {
                            list[element.id] = option.id
                        }
                    });
                });

                quizResponse.forEach((element, index) => {
                    if (element.questionType.title == 'Fill in the Blank') {
                        if (element.selectedOption != null && element.questionsOptions[0].title == element.selectedOption) {
                            result += element.points;
                            quizResponse[index].isWrong = false;
                        } else {
                            wrong += 1;
                            quizResponse[index].isWrong = true;
                        }
                    } else {
                        if (element.selectedOption != null && list[crypto.decrypt(element.id)] == crypto.decrypt(element.selectedOption)) {
                            result += element.points;
                            quizResponse[index].isWrong = false;
                        } else {
                            wrong += 1;
                            quizResponse[index].isWrong = true;
                        }
                    }
                })

                QuizSubmissions.create({
                    quizzId: quizId,
                    result: result,
                    totalMarks: totalMarks,
                    wrong: wrong,
                    totalQuestions: quizResponse.length,
                    timeSpend: timeSpend,
                    userId: crypto.decrypt(req.userId)
                }, { transaction })
                    .then(async submissionRes => {
                        await QuizSubmissionResponse.create({ response: JSON.stringify(quizResponse), quizSubmissionId: submissionRes.id },
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
            } else {

                if (oldQuizAttributes.totalQuestions == quizResponse.length) {
                    // Reset attributes if re-attempt
                    result = totalMarks = 0;
                } else {
                    // Do not reset attributes if attempt only wrong questions
                    result = oldQuizAttributes.result;
                    totalMarks = oldQuizAttributes.totalMarks;
                }

                timeSpend = oldQuizAttributes.timeSpend;
                wrong = 0;

                quizResponse.forEach((element) => {
                    questionsIdList.push(crypto.decrypt(element.id))
                    timeSpend = element.remainingDuration >= 0 ? timeSpend + (element.duration - element.remainingDuration) : timeSpend;
                });

                const questionsCorrectAnswers = await Questions.findAll({
                    where: { id: questionsIdList },
                    include: [
                        {
                            model: QuestionsOptions,
                            attributes: ['id', 'correct']
                        }
                    ],
                    attributes: ['id']
                })

                var list = {};
                questionsCorrectAnswers.forEach((element) => {
                    element.questionsOptions.forEach(option => {
                        if (option.correct) {
                            list[element.id] = option.id
                        }
                    });
                });

                quizResponse.forEach((element, index) => {
                    if (element.questionType.title == 'Fill in the Blank') {
                        if (element.selectedOption != null && element.questionsOptions[0].title == element.selectedOption) {
                            result += element.points;
                            quizResponse[index].isWrong = false;
                        } else {
                            wrong += 1;
                            quizResponse[index].isWrong = true;
                        }
                    } else {
                        if (element.selectedOption != null && list[crypto.decrypt(element.id)] == crypto.decrypt(element.selectedOption)) {
                            element.correctOption = element.id;
                            result += element.points;
                            quizResponse[index].isWrong = false;
                        } else {
                            wrong += 1;
                            quizResponse[index].isWrong = true;
                        }
                    }
                })

                QuizSubmissions.update({
                    result: result,
                    wrong: wrong,
                    timeSpend: timeSpend
                },
                    { where: { quizzId: quizId }, transaction })
                    .then(async num => {
                        if (num) {
                            await QuizSubmissionResponse.create({
                                response: JSON.stringify(quizResponse),
                                quizSubmissionId: oldQuizAttributes.id
                            }, { transaction })

                            await transaction.commit();
                            res.status(200).send({
                                message: "Question Submission created successfully."
                            })
                        } else {
                            res.send({
                                message: `Cannot update Quiz Attributes. Maybe Quiz was not found or req.body is empty!`
                            });
                        }
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
        }
    } catch (err) {
        emails.errorEmail(req, err);

        console.log('error', err);
        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Retrieve Quiz Submissoin Detail of user by quizId & userId.
exports.getUserSubmission = (req, res) => {
    try {
        const quizId = crypto.decrypt(req.params.quizId);
        const userId = crypto.decrypt(req.params.userId);
        QuizSubmissions.findOne({
            where: {
                userId: userId,
                quizzId: quizId,
                isActive: 'Y'
            }, 
            include: [
                {
                    model: Quizzes,
                    where: { isActive: 'Y' }, 
                    include: [
                        {
                            model: Courses,
                            where: { isActive: 'Y' },
                            include: [
                                {
                                    model: Classes,
                                    where: { isActive: 'Y' },
                                    attributes: ['title']
                                }
                            ],
                            attributes: ['title']
                        },
                    ]
                },
                {
                    model: QuizSubmissionResponse,
                    where: { isActive: 'Y' },
                    attributes: ['id', 'response']
                },
                {
                    model: Users,
                    where: { isActive: 'Y' },
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                }
            ],
            order: [[ QuizSubmissionResponse, 'createdAt', 'DESC' ]]
        })
            .then(async quiz => {
                res.send(encryptHelper(quiz));
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Submission of user by quiz and user Id."
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