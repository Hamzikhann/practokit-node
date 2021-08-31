const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const Sequelize = require('sequelize');

const Users = db.users;
const Courses = db.courses;
const Classes = db.classes;
const Tags = db.tags;
const Questions = db.questions;
const Quizzes = db.quizzes;
const QuizSubmissions = db.quizSubmissions;
const Teaches = db.teaches;
const Roles = db.roles;
const AssignTo = db.assignTo

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
        var editorsAndTeachers = await Users.findAll({
            where: { isActive: 'Y' },
            include: [{
                model: Roles, attributes: ['title'],
                where: {
                    isActive: 'Y',
                    [Op.or]: [{ title: { [Op.eq]: 'Editor' } }, { title: { [Op.eq]: 'Teacher' } }]
                }
            }],
            order: [['firstName', 'ASC']],
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

        // Questions Statistics
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

        // Assessments Statistics
        var quizzes = await Quizzes.count({
            where: { isActive: 'Y', title: {[Op.ne]: null} }
        })
        var todayQuizzes = await Quizzes.count({
            where: { isActive: 'Y', createdAt: { [Op.gt]: today }, title: {[Op.ne]: null}  }
        })
        var yesterdayQuizzes = await Quizzes.count({
            where: { isActive: 'Y', createdAt: { [Op.gt]: yesterday }, title: {[Op.ne]: null}  }
        })
        var thisWeekQuizzes = await Quizzes.count({
            where: { isActive: 'Y', createdAt: { [Op.gt]: week }, title: {[Op.ne]: null}  }
        })
        var thisMonthQuizzes = await Quizzes.count({
            where: { isActive: 'Y', createdAt: { [Op.gt]: month }, title: {[Op.ne]: null}  }
        })

        res.send({
            editorsAndTeachers: encryptHelper(editorsAndTeachers),
            count: {
                users: users,
                courses: courses,
                tags: tags,
                questions: {
                    total: questions,
                    today: todayQuestions,
                    yesterday: yesterdayQuestions - todayQuestions,
                    week: thisWeekQuestions,
                    month: thisMonthQuestions
                },
                quizzes: {
                    total: quizzes,
                    today: todayQuizzes,
                    yesterday: yesterdayQuizzes - todayQuizzes,
                    week: thisWeekQuizzes,
                    month: thisMonthQuizzes
                }
            }
        });
    } catch (err) {
        // emails.errorEmail(req, err);

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
                    total: questions,
                    today: todayQuestions,
                    yesterday: yesterdayQuestions - todayQuestions,
                    week: thisWeekQuestions,
                    month: thisMonthQuestions
                },
                quizzes: {
                    total: null,
                    today: null,
                    yesterday: null,
                    week: null,
                    month: null
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

// Retrieve dashboard for Teacher.
exports.findAllForTeacher = async (req, res) => {
    try {

        const todayDateTime = new Date();
        const today = moment(todayDateTime).format('YYYY-MM-DD') + ' 00:00:00';
        const yesterday = moment(new Date().setDate(todayDateTime.getDate() - 1)).format('YYYY-MM-DD') + ' 00:00:00';
        const week = moment(new Date().setDate(todayDateTime.getDate() - todayDateTime.getDay())).format('YYYY-MM-DD') + ' 00:00:00';
        const month = moment(new Date().setDate(1)).format('YYYY-MM-DD') + ' 00:00:00';

        const teacherId = crypto.decrypt(req.userId);

        var courses = await Courses.count({
            where: { isActive: 'Y' },
            include: [{ model: Teaches, where: { isActive: 'Y', userId: crypto.decrypt(req.userId) } }]
        })
        var tags = await Tags.count({
            where: { isActive: 'Y' },
            include: {
                model: Courses,
                where: { isActive: 'Y' },
                include: [
                    { model: Classes, where: { isActive: 'Y' }, },
                    { model: Teaches, where: { isActive: 'Y', userId: crypto.decrypt(req.userId) } }
                ],
            },
        })
        var questions = await Questions.count({
            where: { isActive: 'Y' },
            include: {
                model: Courses, where: { isActive: 'Y' },
                include: [{ model: Teaches, where: { isActive: 'Y', userId: crypto.decrypt(req.userId) } }],
            },
        })

        var quizzes = await Quizzes.findAll({
            where: { isActive: 'Y', createdBy: teacherId, title: {[Op.ne]: null} },
            include: {
                model: Courses, where: { isActive: 'Y' },
                include: [{ model: Teaches, where: { isActive: 'Y', userId: teacherId } }],
            }, attributes: ['id']
        })
        
        const teacherQuizzes = quizzes.map(e=> {return e.id})
        
        var todayQuizzes = await Quizzes.count({
            where: { id: teacherQuizzes, createdAt: { [Op.gt]: today } }
        })
        var yesterdayQuizzes = await Quizzes.count({
            where: { id: teacherQuizzes, createdAt: { [Op.gt]: yesterday } }
        })
        var thisWeekQuizzes = await Quizzes.count({
            where: { id: teacherQuizzes, createdAt: { [Op.gt]: week } }
        })
        var thisMonthQuizzes = await Quizzes.count({
            where: { id: teacherQuizzes, createdAt: { [Op.gt]: month } }
        })

        res.send({
            count: {
                editors: null,
                users: null,
                courses: courses,
                tags: tags,
                questions: {
                    total: questions,
                    today: null,
                    yesterday: null,
                    week: null,
                    month: null
                },
                quizzes: {
                    total: teacherQuizzes.length,
                    today: todayQuizzes,
                    yesterday: yesterdayQuizzes - todayQuizzes,
                    week: thisWeekQuizzes,
                    month: thisMonthQuizzes
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

// Retrieve dashboard for Student.
exports.findAllForStudent = async (req, res) => {
    try {

        // Last 12 months assessments detail 
        const d = new Date();
        var todayDateTime = moment(d).format('YYYY-MM-DD') + ' 00:00:00';
        
        const month = d.getMonth()+2 >= 10 ? (d.getMonth() + 2) : '0' + (d.getMonth()+2)
        var yearLaterDate = d.getFullYear() - 1 + '-' + month + '-01 00:00:00';

        const userId = crypto.decrypt(req.userId);

        const [selfCreated, teacherCreated] = await Promise.all([
            Quizzes.findAll({
                where: { createdBy: userId, createdAt: { [Op.gt]: yearLaterDate } },
                include: [
                    {
                        model: QuizSubmissions,
                        required: false,
                        where: { isActive: 'Y' },
                        attributes: ['id', 'userId'],
                    }
                ],
                attributes: { exclude: ['isActive',] }
            }),
            Quizzes.findAll({
                where: { createdAt: { [Op.gt]: yearLaterDate } },
                include: [
                    {
                        model: AssignTo,
                        where: { userId: userId },
                        required: true,
                        attributes: [],
                    },
                    {
                        model: QuizSubmissions,
                        required: false,
                        where: { isActive: 'Y' },
                        attributes: ['id', 'userId'],
                    }
                ],
                attributes: { exclude: ['isActive',] }
            })
        ])

        const quiz = [...selfCreated, ...teacherCreated]
        res.send({quiz: encryptHelper(quiz), yearLaterDate: yearLaterDate});
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};



// Retrieve question stats for Admin.
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

// Retrieve quiz stats for Admin.
exports.findTeacherStats = async (req, res) => {
    try {

        const teacherId = crypto.decrypt(req.params.teacherId)

        const todayDateTime = new Date();
        const today = moment(todayDateTime).format('YYYY-MM-DD') + ' 00:00:00';
        const yesterday = moment(new Date().setDate(todayDateTime.getDate() - 1)).format('YYYY-MM-DD') + ' 00:00:00';
        const week = moment(new Date().setDate(todayDateTime.getDate() - todayDateTime.getDay())).format('YYYY-MM-DD') + ' 00:00:00';
        const month = moment(new Date().setDate(1)).format('YYYY-MM-DD') + ' 00:00:00';

        var todayQuizzes = await Quizzes.count({
            where: { isActive: 'Y', createdBy: teacherId, createdAt: { [Op.gt]: today }, title: {[Op.ne]: null} }
        })
        var yesterdayQuizzes = await Quizzes.count({
            where: { isActive: 'Y', createdBy: teacherId, createdAt: { [Op.gt]: yesterday }, title: {[Op.ne]: null} }
        })
        var thisWeekQuizzes = await Quizzes.count({
            where: { isActive: 'Y', createdBy: teacherId, createdAt: { [Op.gt]: week }, title: {[Op.ne]: null} }
        })
        var thisMonthQuizzes = await Quizzes.count({
            where: { isActive: 'Y', createdBy: teacherId, createdAt: { [Op.gt]: month }, title: {[Op.ne]: null} }
        })

        res.send({
            count: {
                quizzes: {
                    today: todayQuizzes,
                    yesterday: yesterdayQuizzes - todayQuizzes,
                    week: thisWeekQuizzes,
                    month: thisMonthQuizzes
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