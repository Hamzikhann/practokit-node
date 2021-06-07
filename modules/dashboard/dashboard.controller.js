const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const Sequelize = require('sequelize');

const Users = db.users;
const Roles = db.roles;
const Courses = db.courses;
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


        console.log(today, week)


        var users = await Users.count({
            where: { isActive: 'Y' }
        })
        var courses = await Courses.count({
            where: { isActive: 'Y' }
        })
        var tags = await Tags.count({
            where: { isActive: 'Y' }
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
exports.findAllForEditor = (req, res) => {

    try {
        Users.findAll({
            where: {
                isActive: 'Y',
                roleId: {
                    [Op.not]: 1
                }
            },
            include: {
                model: Roles,
                attributes: { exclude: ['createdAt', 'updatedAt', 'isActive'] }
            },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        })
            .then(data => {
                encryptHelper(data);
                res.send(data);
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Classes."
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