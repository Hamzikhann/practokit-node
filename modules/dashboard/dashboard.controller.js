const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const Sequelize = require('sequelize');

const Users = db.users;
const Courses = db.courses;
const Classes = db.classes;
const Tags = db.tags;
const Questions = db.questions;

const moment = require('moment');
const Op = db.Sequelize.Op;
const { sequelize } = require("../../models");

// Retrieve dashboard for Admin.
exports.findAll = async (req, res) => {
    try {

        const todayDateTime = new Date();
        const today = moment(todayDateTime).format('YYYY-MM-DD') + ' 00:00:00';
        const yesterday = moment(new Date().setDate(todayDateTime.getDate() - 1)).format('YYYY-MM-DD') + ' 00:00:00';
        const week = moment(new Date().setDate(todayDateTime.getDate() - todayDateTime.getDay())).format('YYYY-MM-DD') + ' 00:00:00';
        const month = moment(new Date().setDate(1)).format('YYYY-MM-DD') + ' 00:00:00';

        var users = await Users.count({
            where: { isActive: 'Y' }
        })
        var editors = await Users.findAll({
            where: { isActive: 'Y' },
            order: [
                ['firstName', 'ASC']
            ],
            attributes: ['id', 'firstName', 'lastName']
        })
        var courses = await Courses.count({
            where: { isActive: 'Y' }
        })
        var tags = await Tags.count({
            where: { isActive: 'Y' },
            include: {
                model: Courses,
                where: { isActive: 'Y' },
                include: {
                    model: Classes,
                    where: { isActive: 'Y' },
                },
            },
        })
        var questions = await Questions.count({
            where: { isActive: 'Y' }
        })
        var todayQuestions = await Questions.count({
            where: { isActive: 'Y', createdAt: { [Op.gt]: today } }
        })
        var yesterdayQuestions = await Questions.count({
            where: { isActive: 'Y', createdAt: { [Op.gt]: yesterday } }
        })
        var thisWeekQuestions = await Questions.count({
            where: { isActive: 'Y', createdAt: { [Op.gt]: week } }
        })
        var thisMonthQuestions = await Questions.count({
            where: { isActive: 'Y', createdAt: { [Op.gt]: month } }
        })

        res.send({
            editors: encryptHelper(editors),
            count: {
                users: users,
                courses: courses,
                tags: tags,
                questions: {
                    total : questions,
                    today: todayQuestions,
                    yesterday: yesterdayQuestions - todayQuestions,
                    week: thisWeekQuestions,
                    month: thisMonthQuestions
                }
            }
        });
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Retrieve dashboard for Editor.
exports.findAllForEditor = async (req, res) => {
    try {

        const todayDateTime = new Date();
        const today = moment(todayDateTime).format('YYYY-MM-DD') + ' 00:00:00';
        const yesterday = moment(new Date().setDate(todayDateTime.getDate() - 1)).format('YYYY-MM-DD') + ' 00:00:00';
        const week = moment(new Date().setDate(todayDateTime.getDate() - todayDateTime.getDay())).format('YYYY-MM-DD') + ' 00:00:00';
        const month = moment(new Date().setDate(1)).format('YYYY-MM-DD') + ' 00:00:00';

        var users = await Users.count({
            where: { isActive: 'Y' }
        })
        var courses = await Courses.count({
            where: { isActive: 'Y' }
        })
        var tags = await Tags.count({
            where: { isActive: 'Y' },
            include: {
                model: Courses,
                where: { isActive: 'Y' },
                include: {
                    model: Classes,
                    where: { isActive: 'Y' },
                },
            },
        })
        var questions = await Questions.count({
            where: { isActive: 'Y', createdBy: crypto.decrypt(req.userId) }
        })
        var todayQuestions = await Questions.count({
            where: { isActive: 'Y', createdBy: crypto.decrypt(req.userId), createdAt: { [Op.gt]: today } }
        })
        var yesterdayQuestions = await Questions.count({
            where: { isActive: 'Y', createdBy: crypto.decrypt(req.userId), createdAt: { [Op.gt]: yesterday } }
        })
        var thisWeekQuestions = await Questions.count({
            where: { isActive: 'Y', createdBy: crypto.decrypt(req.userId), createdAt: { [Op.gt]: week } }
        })
        var thisMonthQuestions = await Questions.count({
            where: { isActive: 'Y', createdBy: crypto.decrypt(req.userId), createdAt: { [Op.gt]: month } }
        })

        res.send({
            count: {
                editors: null,
                users: users,
                courses: courses,
                tags: tags,
                questions: {
                    total : questions,
                    today: todayQuestions,
                    yesterday: yesterdayQuestions - todayQuestions,
                    week: thisWeekQuestions,
                    month: thisMonthQuestions
                }
            }
        });
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};


// Retrieve dashboard for Editor.
exports.findEditorStats = async (req, res) => {
    try {

        const editorId = crypto.decrypt(req.params.editorId)

        const todayDateTime = new Date();
        const today = moment(todayDateTime).format('YYYY-MM-DD') + ' 00:00:00';
        const yesterday = moment(new Date().setDate(todayDateTime.getDate() - 1)).format('YYYY-MM-DD') + ' 00:00:00';
        const week = moment(new Date().setDate(todayDateTime.getDate() - todayDateTime.getDay())).format('YYYY-MM-DD') + ' 00:00:00';
        const month = moment(new Date().setDate(1)).format('YYYY-MM-DD') + ' 00:00:00';

        var todayQuestions = await Questions.count({
            where: { isActive: 'Y', createdBy: editorId, createdAt: { [Op.gt]: today } }
        })
        var yesterdayQuestions = await Questions.count({
            where: { isActive: 'Y', createdBy: editorId, createdAt: { [Op.gt]: yesterday } }
        })
        var thisWeekQuestions = await Questions.count({
            where: { isActive: 'Y', createdBy: editorId, createdAt: { [Op.gt]: week } }
        })
        var thisMonthQuestions = await Questions.count({
            where: { isActive: 'Y', createdBy: editorId, createdAt: { [Op.gt]: month } }
        })

        res.send({
            count: {
                questions: {
                    today: todayQuestions,
                    yesterday: yesterdayQuestions - todayQuestions,
                    week: thisWeekQuestions,
                    month: thisMonthQuestions
                }
            }
        });
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};