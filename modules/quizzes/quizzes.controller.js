const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const { Sequelize } = require('sequelize');

const Questions = db.questions;
const QuestionsAttributes = db.questionsAttributes;
const QuestionsOptions = db.questionsOptions;
const QuestionTags = db.questionTags;
const Quizzes = db.quizzes;
const QuizSubmissions = db.quizSubmissions;
const QuizSubmissionResponse = db.quizSubmissionResponse;
const Courses = db.courses;
const Classes = db.classes;

const Joi = require('@hapi/joi');
const { sequelize } = require("../../models");

// Create and Save a new Quiz Type
exports.create = async (req, res) => {

    try {
        // Validate request
        const joiSchema = Joi.object({
            questions: Joi.array().items(
                Joi.object().keys({
                    difficultyId: Joi.string().required(),
                    count: Joi.number().integer().required()
                })
            ),
            courseId: Joi.string().required(),
            tagsIdList: Joi.array().items(Joi.string().required())
        }).prefs({ convert: false });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);

            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            const courseId = crypto.decrypt(req.body.courseId);
            const questionTagsIdList = [];

            req.body.tagsIdList.forEach(element => {
                questionTagsIdList.push(crypto.decrypt(element))
            });
            req.body.questions.forEach((element, index) => {
                req.body.questions[index].difficultyId = crypto.decrypt(element.difficultyId)
            });

            const [qp0, qp1, qp2, qp3, qp4] = await Promise.all([
                Questions.findAll({
                    where: {
                        questionDifficultyId: req.body.questions[0].difficultyId,
                        questionTypeId: 1, coursesId: courseId, isActive: 'Y'
                    },
                    include: [{
                        model: QuestionTags,
                        where: { isActive: 'Y', tagsId: questionTagsIdList }, attributes: []
                    },
                    {
                        model: QuestionsOptions, where: { isActive: 'Y' },
                        required: false, attributes: ['id', 'title', 'image', 'imageSource']
                    },
                    {
                        model: QuestionsAttributes, where: { isActive: 'Y' }, required: false,
                        attributes: ['id', 'statementImage', 'statementImageSource', 'hint', 'hintFile', 'hintFileSource',
                            'solutionFile', 'solutionFileSource']
                    }],
                    order: Sequelize.literal('rand()'), 
                    limit: req.body.questions[0].count,
                    attributes: ['id', 'statement', 'duration', 'points']
                }),
                Questions.findAll({
                    where: {
                        questionDifficultyId: req.body.questions[1].difficultyId,
                        questionTypeId: 1, coursesId: courseId, isActive: 'Y'
                    },
                    include: [{
                        model: QuestionTags,
                        where: { isActive: 'Y', tagsId: questionTagsIdList }, attributes: []
                    },
                    {
                        model: QuestionsOptions, where: { isActive: 'Y' },
                        required: false, attributes: ['id', 'title', 'image', 'imageSource']
                    },
                    {
                        model: QuestionsAttributes, where: { isActive: 'Y' }, required: false,
                        attributes: ['id', 'statementImage', 'statementImageSource', 'hint', 'hintFile', 'hintFileSource',
                            'solutionFile', 'solutionFileSource']
                    }],
                    order: Sequelize.literal('rand()'), 
                    limit: req.body.questions[1].count,
                    attributes: ['id', 'statement', 'duration', 'points']
                }),
                Questions.findAll({
                    where: {
                        questionDifficultyId: req.body.questions[2].difficultyId,
                        questionTypeId: 1, coursesId: courseId, isActive: 'Y'
                    },
                    include: [{
                        model: QuestionTags,
                        where: { isActive: 'Y', tagsId: questionTagsIdList }, attributes: []
                    },
                    {
                        model: QuestionsOptions, where: { isActive: 'Y' },
                        required: false, attributes: ['id', 'title', 'image', 'imageSource']
                    },
                    {
                        model: QuestionsAttributes, where: { isActive: 'Y' }, required: false,
                        attributes: ['id', 'statementImage', 'statementImageSource', 'hint', 'hintFile', 'hintFileSource',
                            'solutionFile', 'solutionFileSource']
                    }],
                    order: Sequelize.literal('rand()'), 
                    limit: req.body.questions[2].count,
                    attributes: ['id', 'statement', 'duration', 'points']
                }),
                Questions.findAll({
                    where: {
                        questionDifficultyId: req.body.questions[3].difficultyId,
                        questionTypeId: 1, coursesId: courseId, isActive: 'Y'
                    },
                    include: [{
                        model: QuestionTags,
                        where: { isActive: 'Y', tagsId: questionTagsIdList }, attributes: []
                    },
                    {
                        model: QuestionsOptions, where: { isActive: 'Y' },
                        required: false, attributes: ['id', 'title', 'image', 'imageSource']
                    },
                    {
                        model: QuestionsAttributes, where: { isActive: 'Y' }, required: false,
                        attributes: ['id', 'statementImage', 'statementImageSource', 'hint', 'hintFile', 'hintFileSource',
                            'solutionFile', 'solutionFileSource']
                    }],
                    order: Sequelize.literal('rand()'), 
                    limit: req.body.questions[3].count,
                    attributes: ['id', 'statement', 'duration', 'points']
                }),
                Questions.findAll({
                    where: {
                        questionDifficultyId: req.body.questions[4].difficultyId,
                        questionTypeId: 1, coursesId: courseId, isActive: 'Y'
                    },
                    include: [{
                        model: QuestionTags,
                        where: { isActive: 'Y', tagsId: questionTagsIdList }, attributes: []
                    },
                    {
                        model: QuestionsOptions, where: { isActive: 'Y' },
                        required: false, attributes: ['id', 'title', 'image', 'imageSource']
                    },
                    {
                        model: QuestionsAttributes, where: { isActive: 'Y' }, required: false,
                        attributes: ['id', 'statementImage', 'statementImageSource', 'hint', 'hintFile', 'hintFileSource',
                            'solutionFile', 'solutionFileSource']
                    }],
                    order: Sequelize.literal('rand()'), 
                    limit: req.body.questions[4].count,
                    attributes: ['id', 'statement', 'duration', 'points']
                })
            ])

            var QuestionsPool = await [...qp0, ...qp1, ...qp2, ...qp3, ...qp4];

            const quiz = await Quizzes.create({
                questionTagsIdList: JSON.stringify(req.body.tagsIdList),
                courseId: courseId,
                createdBy: crypto.decrypt(req.userId),
                questionTypeId: 1,
                questionDifficultyList: JSON.stringify(req.body.questions),
                questionsPool: JSON.stringify(encryptHelper(QuestionsPool))
            })

            res.status(200).send({ quizId: crypto.encrypt(quiz.id), message: "Quiz Created." })
        }
    } catch (err) {
        emails.errorEmail(req, err);
        res.status(500).send({
            message: err.message || "Some error occurred."
        });
    }
};

// Retrieve Quiz by Id.
exports.findQuizById = (req, res) => {
    try {
        Quizzes.findOne({
            where: { id: crypto.decrypt(req.params.quizId), isActive: 'Y' },
            include:
                [
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
                    }
                ],
            attributes: ['id', 'questionsPool']
        })
            .then(quiz => {

                res.send({
                    id: crypto.encrypt(quiz.id),
                    courseTitle: quiz.course.title,
                    classTitle: quiz.course.class.title,
                    QuestionsPool: JSON.parse(quiz.questionsPool)
                });
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Quiz by Id."
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

// Retrieve Wrong questions of quiz by Quiz Id.
exports.findQuizWrongQuestions = (req, res) => {
    try {
        Quizzes.findOne({
            where: { id: crypto.decrypt(req.params.quizId), isActive: 'Y' },
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
                {
                    model: QuizSubmissions,
                    attributes: ['id']
                }
            ],
            attributes: ['id', 'courseId']
        })
            .then(async quiz => {

                console.log(quiz.id, quiz.quizSubmissions[0].id)

                const quizResponse = await QuizSubmissionResponse.findOne({
                    where: { quizSubmissionId: quiz.quizSubmissions[0].id },
                    order: [['createdAt', 'DESC']],
                    limit: 1,
                    attributes: ['response']
                })

                const response = JSON.parse(quizResponse.response)
                var questionsPool = []
                response.forEach(question => {
                    if (question.isWrong) {
                        questionsPool.push(question)
                    }
                });

                res.send({
                    id: crypto.encrypt(quiz.id),
                    courseTitle: quiz.course.title,
                    classTitle: quiz.course.class.title,
                    QuestionsPool: questionsPool
                });
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Quiz by Id."
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

// Retrieve Quiz Result of quiz bu quiz Id.
exports.findQuizResultById = (req, res) => {
    try {
        QuizSubmissions.findOne({
            where: { isActive: 'Y' },
            include: [
                {
                    model: Quizzes,
                    where: { id: crypto.decrypt(req.params.quizId), isActive: 'Y' },
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
                        }
                    ],
                    attributes: ['courseId']
                }
            ],
            order: [['createdAt', 'DESC']],
            limit: 1,
            attributes: ['id', 'result', 'totalMarks', 'wrong', 'totalQuestions', 'timeSpend', 'createdAt']
        })
            .then(async quiz => {
                if (quiz) {

                    const count = await QuizSubmissionResponse.count({
                        where: { quizSubmissionId: quiz.id, isActive: 'Y' }
                    })

                    res.send({
                        result: quiz.result,
                        totalMarks: quiz.totalMarks,
                        wrong: quiz.wrong,
                        totalQuestions: quiz.totalQuestions,
                        timeSpend: quiz.timeSpend,
                        courseTitle: quiz.quiz.course.title,
                        gradeTitle: quiz.quiz.course.class.title,
                        tries: count,
                        quiz: quiz
                    });
                } else {
                    res.send(null)
                }
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Quiz by Id."
                });
            });
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
}
