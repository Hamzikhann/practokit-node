const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");

const Questions = db.questions;
const QuestionsAttributes = db.questionsAttributes;
const QuestionsOptions = db.questionsOptions;
const QuestionTags = db.questionTags;
const Quizzes = db.quizzes;

const Joi = require('@hapi/joi');
const { sequelize } = require("../../models");

// Create and Save a new Question Type
exports.create = async (req, res) => {

    try {
        // Validate request
        const joiSchema = Joi.object({
            difficultyId: Joi.string().required(),
            typeId: Joi.string().required(),
            courseId: Joi.string().required(),
            questionTagsIdList: Joi.array().items(Joi.string().optional()),
            count: Joi.number().integer().required()
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);

            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            const difficultyId = crypto.decrypt(req.body.difficultyId);
            const typeId = crypto.decrypt(req.body.typeId);
            const courseId = crypto.decrypt(req.body.courseId);
            const count = req.body.count;
            const questionTagsIdList = [];
            var listLength = req.body.questionTagsIdList ? req.body.questionTagsIdList.length : 0;

            var questionsPool;

            let transaction = await sequelize.transaction();
            if (listLength == 0) {
                questionsPool = await Questions.findAll({
                    where: { questionDifficultyId: difficultyId, questionTypeId: typeId, coursesId: courseId, isActive: 'Y' },
                    include: [{
                        model: QuestionsOptions,
                        where: { isActive: 'Y' },
                        required: false,
                        attributes: ['id', 'title', 'image', 'imageSource', 'correct']
                    },
                    {
                        model: QuestionsAttributes,
                        where: { isActive: 'Y' },
                        required: false,
                        attributes: ['id', 'statementImage', 'statementImageSource', 'hint', 'hintFile', 'hintFileSource',
                            'solutionFile', 'solutionFileSource']
                    }],
                    attributes: ['id', 'statement', 'duration', 'points']
                })
            } else {
                req.body.questionTagsIdList.forEach(element => {
                    questionTagsIdList.push(crypto.decrypt(element))
                });

                questionsPool = await Questions.findAll({
                    where: { questionDifficultyId: difficultyId, questionTypeId: typeId, coursesId: courseId, isActive: 'Y' },
                    include: [{
                        model: QuestionTags,
                        where: { isActive: 'Y', tagsId: questionTagsIdList },
                        attributes: []
                    },
                    {
                        model: QuestionsOptions,
                        where: { isActive: 'Y' },
                        required: false,
                        attributes: ['id', 'title', 'image', 'imageSource', 'correct']
                    },
                    {
                        model: QuestionsAttributes,
                        where: { isActive: 'Y' },
                        required: false,
                        attributes: ['id', 'statementImage', 'statementImageSource', 'hint', 'hintFile', 'hintFileSource',
                            'solutionFile', 'solutionFileSource']
                    }],
                    // limit: count,
                    attributes: ['id', 'statement', 'duration', 'points']
                })
            }

            await Quizzes.create({
                questionsCount: count, questionTagsIdList: JSON.stringify(questionTagsIdList),
                courseId: courseId, createdBy: crypto.decrypt(req.userId), questionTypeId: typeId,
                questionDifficultyId: difficultyId
            }, { transaction })

            if (questionsPool.length > count) {
                const randomIndexSet = new Set();
                while (randomIndexSet.size != count) {
                    randomIndexSet.add(Math.floor(Math.random() * count));
                }

                var quizquestions = []
                randomIndexSet.forEach((element, index) => {
                    quizquestions.push(questionsPool[index])
                });
            }

            await transaction.commit();
            res.status(200).send({
                questions: encryptHelper(questionsPool)
            })
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