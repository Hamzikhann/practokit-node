const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const { Sequelize } = require('sequelize');

const Questions = db.questions;
const QuestionsAttributes = db.questionsAttributes;
const QuestionsOptions = db.questionsOptions;
const QuestionTags = db.questionTags;
const Tags = db.tags;
const Quizzes = db.quizzes;
const QuestionDifficulties = db.questionDifficulties;

const Joi = require('@hapi/joi');
const { sequelize } = require("../../models");

// Create and Save a new Question Type
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
                        required: false, attributes: ['id', 'title', 'image', 'imageSource', 'correct']
                    },
                    {
                        model: QuestionsAttributes, where: { isActive: 'Y' }, required: false,
                        attributes: ['id', 'statementImage', 'statementImageSource', 'hint', 'hintFile', 'hintFileSource',
                            'solutionFile', 'solutionFileSource']
                    }],
                    order: Sequelize.literal('rand()'), limit: req.body.questions[0].count,
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
                        required: false, attributes: ['id', 'title', 'image', 'imageSource', 'correct']
                    },
                    {
                        model: QuestionsAttributes, where: { isActive: 'Y' }, required: false,
                        attributes: ['id', 'statementImage', 'statementImageSource', 'hint', 'hintFile', 'hintFileSource',
                            'solutionFile', 'solutionFileSource']
                    }],
                    order: Sequelize.literal('rand()'), limit: req.body.questions[1].count,
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
                        required: false, attributes: ['id', 'title', 'image', 'imageSource', 'correct']
                    },
                    {
                        model: QuestionsAttributes, where: { isActive: 'Y' }, required: false,
                        attributes: ['id', 'statementImage', 'statementImageSource', 'hint', 'hintFile', 'hintFileSource',
                            'solutionFile', 'solutionFileSource']
                    }],
                    order: Sequelize.literal('rand()'), limit: req.body.questions[2].count,
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
                        required: false, attributes: ['id', 'title', 'image', 'imageSource', 'correct']
                    },
                    {
                        model: QuestionsAttributes, where: { isActive: 'Y' }, required: false,
                        attributes: ['id', 'statementImage', 'statementImageSource', 'hint', 'hintFile', 'hintFileSource',
                            'solutionFile', 'solutionFileSource']
                    }],
                    order: Sequelize.literal('rand()'), limit: req.body.questions[3].count,
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
                        required: false, attributes: ['id', 'title', 'image', 'imageSource', 'correct']
                    },
                    {
                        model: QuestionsAttributes, where: { isActive: 'Y' }, required: false,
                        attributes: ['id', 'statementImage', 'statementImageSource', 'hint', 'hintFile', 'hintFileSource',
                            'solutionFile', 'solutionFileSource']
                    }],
                    order: Sequelize.literal('rand()'), limit: req.body.questions[4].count,
                    attributes: ['id', 'statement', 'duration', 'points']
                })
            ])

            const quiz = await Quizzes.create({
                questionTagsIdList: JSON.stringify(req.body.tagsIdList),
                courseId: courseId,
                createdBy: crypto.decrypt(req.userId),
                questionTypeId: 1,
                questionDifficultyList: JSON.stringify(req.body.questions)
            })

            var QuestionsPool = [...qp0, ...qp1, ...qp2, ...qp3, ...qp4];

            encryptHelper(quiz);
            encryptHelper(QuestionsPool);
            res.status(200).send({quiz, QuestionsPool})
        }
    } catch (err) {
        emails.errorEmail(req, err);
        res.status(500).send({
            message: err.message || "Some error occurred."
        });
    }
};
