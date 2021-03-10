const db = require("./../models");
const TeacherAssistants = db.teacherAssistants;
const Tasks = db.tasks;
const Classes = db.classes;
const Enrollments = db.enrollments;
const Forums = db.forums;
const Attachments = db.attachments;
const Quiz = db.quiz;
const QuizQuestions = db.quizQuestions;
const QuizQuestionsOptions = db.quizQuestionsOptions;

const emails = require('./emails');

exports.checkGetTaskAccess = async (req, res, next) => {
    if (req.role != 'Admin') {
        const taskId = crypto.decrypt(req.params.id);
        const user = crypto.decrypt(req.userId);
        var flag = false;

        const task = await Tasks.findOne({
            where: { id: taskId },
            include: [{ model: Classes, attributes: ['id', 'taughtBy'] }],
            attributes: ['id']
        })

        if (task && task.class) {
            if (req.role == 'Teacher') {
                if (task.class.taughtBy && user != task.class.taughtBy) {
                    flag = true;
                }
            } if (req.role == 'Teacher Assistant') {
                const assistant = await TeacherAssistants.findOne({
                    where: { classId: task.class.id },
                    attributes: ['assistantId']
                })
                if (assistant) {
                    if (user != assistant.assistantId) {
                        flag = true;
                    }
                } else {
                    flag = true;
                }
            } else if (req.role == 'Student') {
                const enrollment = await Enrollments.findOne({
                    where: {
                        classId: task.class.id,
                        userId: user
                    }, attributes: ['id']
                })

                if (enrollment == null) {
                    flag = true;
                }
            }
        }
    }

    if (flag) {
        res.status(403).send({
            message: "Intruder"
        });
    } else {
        next();
    }
};

exports.checkGetForumAccess = async (req, res, next) => {
    if (req.role != 'Admin') {
        const forumId = crypto.decrypt(req.params.id);
        const user = crypto.decrypt(req.userId);
        var flag = false;

        const forum = await Forums.findOne({
            where: { id: forumId },
            include: [{ model: Classes, attributes: ['id', 'taughtBy'] }],
            attributes: ['id']
        })

        if (forum && forum.class) {
            if (req.role == 'Teacher') {
                if (forum.class.taughtBy && user != forum.class.taughtBy) {
                    flag = true;
                }
            } if (req.role == 'Teacher Assistant') {
                const assistant = await TeacherAssistants.findOne({
                    where: { classId: forum.class.id },
                    attributes: ['assistantId']
                })

                if (user != assistant.assistantId) {
                    flag = true;
                }
            } else if (req.role == 'Student') {
                const enrollment = await Enrollments.findOne({
                    where: {
                        classId: forum.class.id,
                        userId: user
                    }, attributes: ['id']
                })

                if (enrollment == null) {
                    flag = true;
                }
            }
        }
    }

    if (flag) {
        res.status(403).send({
            message: "Intruder"
        });
    } else {
        next();
    }
};

exports.checkGetAttachmentAccess = async (req, res, next) => {
    if (req.role != 'Admin') {
        const classId = crypto.decrypt(req.params.classId);
        const user = crypto.decrypt(req.userId);
        var flag = false;

        const classData = await Classes.findOne({
            where: { id: classId },
            attributes: ['id', 'taughtBy']
        })

        if (classData) {
            if (req.role == 'Teacher') {
                if (user != classData.taughtBy) {
                    flag = true;
                }
            } if (req.role == 'Teacher Assistant') {
                const assistant = await TeacherAssistants.findOne({
                    where: { classId: classId },
                    attributes: ['assistantId']
                })

                if (user != assistant.assistantId) {
                    flag = true;
                }
            } else if (req.role == 'Student') {
                const enrollment = await Enrollments.findOne({
                    where: {
                        classId: classId,
                        userId: user
                    }, attributes: ['id']
                })

                if (enrollment == null) {
                    flag = true;
                }
            }
        }
    }

    if (flag) {
        res.status(403).send({
            message: "Intruder"
        });
    } else {
        next();
    }
};

exports.newEnrollments = async (classId, userIdsObj) => {
    const result = await emails.newEnrollments(classId, userIdsObj)
};
exports.newEnrollmentRequest = async (req, coursesIds) => {
    var courseIdList = [];
    var courseCount = 0;
    coursesIds.forEach(element => {
        courseIdList.push(crypto.decrypt(element));
        courseCount++;
    });
    const result1 = await emails.newEnrollmentRequest(req, courseIdList)
    const result2 = await emails.newEnrollmentInvoiceToStudent(req, courseIdList, courseCount)
};

exports.error = async (req, err) => {
    emails.errorEmail(req, err);
}