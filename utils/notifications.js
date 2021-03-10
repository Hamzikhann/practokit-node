const encryptHelper = require("./encryptHelper");
const db = require("../models");
const { result, concat } = require("lodash");
const Courses = db.courses;
const Classes = db.classes;
const Enrollments = db.enrollments;
const Users = db.users;
const Profiles = db.profiles;
const Roles = db.roles;
const Tasks = db.tasks;
const Attachments = db.attachments;
const Notifications = db.notifications;
const Announcements = db.announcements;
const Submissions = db.submissions;
const Forums = db.forums;
const ForumsComments = db.forumsComments
const Messages = db.messages
const MessagesThreads = db.messagesThreads
const Participants = db.participants
const Appointments = db.appointments;
const OfficeHours = db.officeHours;
const TeacherAssistants = db.teacherAssistants;
const ClassDays = db.classDays;
const Issues = db.issues;
const Quiz = db.quiz;

/**
 * Class add/update
 * @param {*} req 
 * @param {*} classId 
 */
exports.newClass = function (req, classId) {
    var userId = req.body.taughtBy;
    getClass(classId, (err, result) => {
        if (result) {
            const log = {
                text: "New class has been assigned to you.",
                type: 'session_created',
                clientId: crypto.decrypt(req.clientId),
                userId: crypto.decrypt(userId),
                courseId: crypto.decrypt(result.course.id),
                classId: crypto.decrypt(result.id),
                taskId: null,
                attachmentId: null,
                submissionId: null,
                announcementId: null,
                forumId: null,
                createdBy: crypto.decrypt(req.userId)
            }
            addNotification(log, (err, result) => {
                if (result) {
                    getNotification(result.id, (err, result) => {
                        if (result) {
                            req.io.emit(`user:${userId}`, result);
                        }
                    })
                }
            });

        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};
exports.newClassToTa = function (req, classId, taId) {
    var userId = req.body.teacherAssistantId;
    getClass(classId, (err, result) => {
        if (result) {
            const log = {
                text: "New class has been assigned to you.",
                type: 'session_created',
                clientId: crypto.decrypt(req.clientId),
                userId: crypto.decrypt(userId),
                courseId: crypto.decrypt(result.course.id),
                classId: crypto.decrypt(result.id),
                taskId: null,
                attachmentId: null,
                submissionId: null,
                announcementId: null,
                forumId: null,
                createdBy: crypto.decrypt(req.userId),
                teacherAssistantId: taId
            }
            addNotification(log, (err, result) => {
                if (result) {
                    getNotification(result.id, (err, result) => {
                        if (result) {
                            req.io.emit(`user:${userId}`, result);
                        }
                    })
                }
            });

        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};
exports.updateClass = function (req, classId, flag) {
    var userId = req.body.taughtBy;
    getClass(classId, (err, result) => {
        if (result) {

            if (flag == 1) {
                this.newClass(req, classId)
            } else {
                const log = {
                    text: "Assigned class details has been updated.",
                    type: 'session_updated',
                    clientId: crypto.decrypt(req.clientId),
                    userId: crypto.decrypt(userId),
                    courseId: crypto.decrypt(result.course.id),
                    classId: crypto.decrypt(result.id),
                    taskId: null,
                    attachmentId: null,
                    submissionId: null,
                    announcementId: null,
                    forumId: null,
                    createdBy: crypto.decrypt(req.userId)
                }
                addNotification(log, (err, result) => {
                    if (result) {
                        getNotification(result.id, (err, result) => {
                            if (result) {
                                req.io.emit(`user:${userId}`, result);
                            }
                        })
                    }
                });
            }

            getAllEnrollments(classId, (err, result) => {
                if (result) {
                    result.forEach(enroll => {
                        const log = {
                            text: "Assigned class details has been updated.",
                            type: 'session_updated',
                            clientId: crypto.decrypt(req.clientId),
                            userId: enroll.userId,
                            courseId: crypto.decrypt(req.body.courseId),
                            classId: crypto.decrypt(result.id),
                            taskId: null,
                            attachmentId: null,
                            submissionId: null,
                            announcementId: null,
                            forumId: null,
                            createdBy: crypto.decrypt(req.userId)
                        }
                        addNotification(log, (err, result) => {
                            if (result) {
                                getNotification(result.id, (err, result) => {
                                    if (result) {
                                        req.io.emit(`user:${crypto.encrypt(enroll.userId)}`, result);
                                    }
                                })
                            }
                        });
                    });
                } else {
                    console.log({
                        message: 'Failed to send notification to students',
                        err: err
                    })
                }
            })
        } else {
            console.log({
                message: 'Failed to send notification to teacher & student',
                err: err
            })
        }
    })
};
exports.updateClassToTa = function (req, classId, flag, taId) {
    var userId = req.body.teacherAssistantId;
    getClass(classId, (err, result) => {
        if (result) {

            if (flag == 1) {
                this.newClassToTa(req, classId, taId)
            } else {
                const log = {
                    text: "Assigned class details has been updated.",
                    type: 'session_updated',
                    clientId: crypto.decrypt(req.clientId),
                    userId: crypto.decrypt(userId),
                    courseId: crypto.decrypt(result.course.id),
                    classId: crypto.decrypt(result.id),
                    taskId: null,
                    attachmentId: null,
                    submissionId: null,
                    announcementId: null,
                    forumId: null,
                    createdBy: crypto.decrypt(req.userId),
                    teacherAssistantId: taId
                }
                addNotification(log, (err, result) => {
                    if (result) {
                        getNotification(result.id, (err, result) => {
                            if (result) {
                                req.io.emit(`user:${userId}`, result);
                            }
                        })
                    }
                });
            }

            getAllEnrollments(classId, (err, result) => {
                if (result) {
                    result.forEach(enroll => {
                        const log = {
                            text: "Assigned class details has been updated.",
                            type: 'session_updated',
                            clientId: crypto.decrypt(req.clientId),
                            userId: enroll.userId,
                            courseId: crypto.decrypt(req.body.courseId),
                            classId: crypto.decrypt(result.id),
                            taskId: null,
                            attachmentId: null,
                            submissionId: null,
                            announcementId: null,
                            forumId: null,
                            createdBy: crypto.decrypt(req.userId)
                        }
                        addNotification(log, (err, result) => {
                            if (result) {
                                getNotification(result.id, (err, result) => {
                                    if (result) {
                                        req.io.emit(`user:${crypto.encrypt(enroll.userId)}`, result);
                                    }
                                })
                            }
                        });
                    });
                } else {
                    console.log({
                        message: 'Failed to send notification to students',
                        err: err
                    })
                }
            })
        } else {
            console.log({
                message: 'Failed to send notification to teacher & student',
                err: err
            })
        }
    })
};


/**
 * Enrollments add/update/remove
 * @param {*} req 
 * @param {*} userIds 
 * @param {*} classId 
 */
exports.newEnrollments = function (req, userIds, classId) {
    var oldUsers = userIds.old;
    var newUsers = userIds.new;

    let oldEnrolls = oldUsers.map(a => a.userId);
    let newEnrolls = [];

    newUsers.forEach(element => {
        newEnrolls.push(Number(crypto.decrypt(element)))
    });
    var addedUserIds = newEnrolls.filter(e => !oldEnrolls.includes(e));
    var removedUserIds = oldEnrolls.filter(e => !newEnrolls.includes(e));

    getClass(classId, (err, result) => {
        if (result) {
            const data = {
                message: `You have been enrolled to ${result.course.name}.`,
                type: 'enrollment_updated',
            };
            addedUserIds.forEach(userId => {
                const log = {
                    text: data.message,
                    type: data.type,
                    clientId: crypto.decrypt(req.clientId),
                    userId: userId,
                    courseId: crypto.decrypt(result.course.id),
                    classId: crypto.decrypt(result.id),
                    taskId: null,
                    attachmentId: null,
                    submissionId: null,
                    announcementId: null,
                    forumId: null,
                    createdBy: crypto.decrypt(req.userId)
                }
                addNotification(log, (err, result) => {
                    if (result) {
                        getNotification(result.id, (err, result) => {
                            if (result) {
                                req.io.emit(`user:${crypto.encrypt(userId)}`, result);
                            }
                        })
                    }
                });
            });
            removedUserIds.forEach(userId => {
                const data = {
                    message: "You have been removed from Class.",
                    type: 'enrollment_removed',
                };
                const log = {
                    text: data.message,
                    type: data.type,
                    clientId: crypto.decrypt(req.clientId),
                    userId: userId,
                    courseId: crypto.decrypt(result.course.id),
                    classId: crypto.decrypt(result.id),
                    taskId: null,
                    attachmentId: null,
                    submissionId: null,
                    announcementId: null,
                    forumId: null,
                    createdBy: crypto.decrypt(req.userId)
                }
                addNotification(log, (err, result) => {
                    if (result) {
                        getNotification(result.id, (err, result) => {
                            if (result) {
                                req.io.emit(`user:${crypto.encrypt(userId)}`, result);
                            }
                        })
                    }
                });
            });
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};
exports.removeEnrollment = function (req, enrollmentId, enrollment) {
    const userId = enrollment.userId;
    const classId = enrollment.classId;
    getClass(classId, (err, result) => {
        if (result) {
            const data = {
                message: "You have been removed from Class.",
                type: 'enrollment_removed',
            };
            const log = {
                text: data.message,
                type: data.type,
                clientId: crypto.decrypt(req.clientId),
                userId: userId,
                courseId: crypto.decrypt(result.course.id),
                classId: crypto.decrypt(result.id),
                taskId: null,
                attachmentId: null,
                submissionId: null,
                announcementId: null,
                forumId: null,
                createdBy: crypto.decrypt(req.userId)
            }
            addNotification(log, (err, result) => {
                if (result) {
                    getNotification(result.id, (err, result) => {
                        if (result) {
                            req.io.emit(`user:${crypto.encrypt(userId)}`, result);
                        }
                    })
                }
            });
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};
exports.newEnrollmentRequest = async function (req, userId) {

    const user = await Users.findOne({
        where: { id: crypto.decrypt(req.userId) }
    })

    const admin = await Users.findOne({ where: { roleId: 1, isActive: 'Y' } })
    const data = {
        message: `${user.firstName} ${user.lastName} (${user.rollNumber}) has requested to enroll in new course(s).`,
        type: 'enrollment_request',
    };
    const log = {
        text: data.message,
        type: data.type,
        clientId: crypto.decrypt(req.clientId),
        userId: admin.id,
        courseId: null,
        classId: null,
        taskId: null,
        attachmentId: null,
        submissionId: null,
        announcementId: null,
        forumId: null,
        createdBy: crypto.decrypt(req.userId)
    }
    addNotification(log, (err, result) => {
        if (result) {
            getNotification(result.id, (err, result) => {
                if (result) {
                    req.io.emit(`user:${crypto.encrypt(userId)}`, result);
                }
            })
        }
    });

};



/**
 * Task add/update/delete
 * @param {*} req 
 * @param {*} taskId 
 */
exports.newTask = function (req, taskId) {
    getTask(taskId, (err, result) => {
        if (result) {
            const enrollments = result.enrollments;
            delete result.enrollments;

            enrollments.forEach(enroll => {
                const data = {
                    message: "New task has been assigned to you.",
                    type: 'task_created',
                };

                const log = {
                    text: data.message,
                    type: data.type,
                    clientId: crypto.decrypt(req.clientId),
                    userId: enroll.userId,
                    courseId: crypto.decrypt(result.course.id),
                    classId: crypto.decrypt(result.class.id),
                    taskId: taskId,
                    attachmentId: null,
                    submissionId: null,
                    announcementId: null,
                    forumId: null,
                    createdBy: crypto.decrypt(req.userId)
                }
                addNotification(log, (err, result) => {
                    if (result) {
                        getNotification(result.id, (err, result) => {
                            if (result) {
                                req.io.emit(`user:${crypto.encrypt(enroll.userId)}`, result);
                            }
                        })
                    }
                });
            });
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};
exports.updateTask = function (req, taskId) {
    getTask(taskId, (err, result) => {
        if (result) {
            const enrollments = result.enrollments;
            delete result.enrollments;

            enrollments.forEach(enroll => {
                const data = {
                    message: "Assigned task details has been updated.",
                    type: 'task_updated',
                };

                const log = {
                    text: data.message,
                    type: data.type,
                    clientId: crypto.decrypt(req.clientId),
                    userId: enroll.userId,
                    courseId: crypto.decrypt(result.course.id),
                    classId: crypto.decrypt(result.class.id),
                    taskId: taskId,
                    attachmentId: null,
                    submissionId: null,
                    announcementId: null,
                    forumId: null,
                    createdBy: crypto.decrypt(req.userId)
                }
                addNotification(log, (err, result) => {
                    if (result) {
                        getNotification(result.id, (err, result) => {
                            if (result) {
                                req.io.emit(`user:${crypto.encrypt(enroll.userId)}`, result);
                            }
                        })
                    }
                });
            });
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};
exports.updateTaskWithAttachment = function (req, taskId) {
    getTask(taskId, (err, result) => {
        if (result) {
            const enrollments = result.enrollments;
            delete result.enrollments;

            enrollments.forEach(enroll => {
                const data = {
                    message: "New attachment has been uploaded to assigned task.",
                    type: 'task_updated',
                };

                const log = {
                    text: data.message,
                    type: data.type,
                    clientId: crypto.decrypt(req.clientId),
                    userId: enroll.userId,
                    courseId: crypto.decrypt(result.course.id),
                    classId: crypto.decrypt(result.class.id),
                    taskId: taskId,
                    attachmentId: null,
                    submissionId: null,
                    announcementId: null,
                    forumId: null,
                    createdBy: crypto.decrypt(req.userId)
                }
                addNotification(log, (err, result) => {
                    if (result) {
                        getNotification(result.id, (err, result) => {
                            if (result) {
                                req.io.emit(`user:${crypto.encrypt(enroll.userId)}`, result);
                            }
                        })
                    }
                });
            });
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};
exports.deleteTask = function (req, taskId) {
    getTask(taskId, (err, result) => {
        if (result) {
            const enrollments = result.enrollments;
            delete result.enrollments;

            enrollments.forEach(enroll => {
                const data = {
                    message: "Assigned task has been deleted.",
                    response: result,
                    type: 'task_deleted',
                    createdAt: new Date()
                }

                const log = {
                    text: data.message,
                    type: data.type,
                    clientId: crypto.decrypt(req.clientId),
                    userId: enroll.userId,
                    courseId: crypto.decrypt(result.course.id),
                    classId: crypto.decrypt(result.class.id),
                    taskId: taskId,
                    attachmentId: null,
                    submissionId: null,
                    announcementId: null,
                    forumId: null,
                    createdBy: crypto.decrypt(req.userId)
                }
                addNotification(log, (err, result) => {
                    if (result) {
                        getNotification(result.id, (err, result) => {
                            if (result) {
                                req.io.emit(`user:${crypto.encrypt(enroll.userId)}`, result);
                            }
                        })
                    }
                });
            });
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};
exports.gradedTask = function (req, submissionId, taskId) {
    getTask(taskId, (err, result) => {
        if (result) {
            const enrollments = result.enrollments;
            delete result.enrollments;

            getSubmission(submissionId, (err, submission) => {
                if (submission) {
                    const userId = submission.submittedBy;
                    result.submission = submission;

                    const data = {
                        message: "Your task submission has been graded.",
                        type: 'submission_graded',
                    }

                    const log = {
                        text: data.message,
                        type: data.type,
                        clientId: crypto.decrypt(req.clientId),
                        userId: userId,
                        courseId: crypto.decrypt(result.course.id),
                        classId: crypto.decrypt(result.class.id),
                        taskId: taskId,
                        attachmentId: null,
                        submissionId: submissionId,
                        announcementId: null,
                        forumId: null,
                        createdBy: crypto.decrypt(req.userId)
                    }
                    addNotification(log, (err, result) => {
                        if (result) {
                            getNotification(result.id, (err, result) => {
                                if (result) {
                                    req.io.emit(`user:${crypto.encrypt(userId)}`, result);
                                }
                            })
                        }
                    });
                } else {
                    console.log({
                        message: 'Failed to send Notification',
                        err: err
                    })
                }
            })
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
}


/**
 * Announcement add
 * @param {*} req 
 * @param {*} announcementId 
 */
exports.newAnnouncements = function (req, announcementId) {
    getAnnouncementEnrollments(announcementId, (err, result) => {
        if (result) {
            const announcement = {
                id: crypto.encrypt(result.id),
                message: result.message,
                course: {
                    id: crypto.encrypt(result.class.course.id),
                    title: result.class.course.name
                },
                session: {
                    id: crypto.encrypt(result.class.id),
                    title: result.class.title,
                    timing: result.class.timing
                }
            }
            const enrollments = result.class.enrollments;
            enrollments.forEach(enroll => {
                const data = {
                    message: "New announcement in your class.",
                    type: 'announcement_created',
                };

                const log = {
                    text: data.message,
                    type: data.type,
                    clientId: crypto.decrypt(req.clientId),
                    userId: enroll.userId,
                    courseId: result.class.course.id,
                    classId: result.class.id,
                    taskId: null,
                    attachmentId: null,
                    submissionId: null,
                    announcementId: announcementId,
                    forumId: null,
                    createdBy: crypto.decrypt(req.userId)
                }
                addNotification(log, (err, result) => {
                    if (result) {
                        getNotification(result.id, (err, result) => {
                            if (result) {
                                req.io.emit(`user:${crypto.encrypt(enroll.userId)}`, result);
                            }
                        })
                    }
                });
            });
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};


/**
 * Issue add
 * @param {*} req 
 * @param {*} announcementData 
 */
exports.issueCreate = function (req, announcementData) {
    getIssue(announcementData.id, async (err, result) => {
        if (result) {
            const data = {
                message: "Issue has been reported by " + result.user.firstName + " " + result.user.lastName,
                type: 'issue_created',
            };

            const admin = await Users.findOne({ where: { roleId: 1, isActive: 'Y' } })
            const log = {
                text: data.message,
                type: data.type,
                clientId: crypto.decrypt(req.clientId),
                userId: admin.id,
                courseId: null,
                classId: null,
                taskId: result.taskId,
                attachmentId: null,
                submissionId: null,
                announcementId: result.announcementId,
                forumId: result.forumId,
                createdBy: crypto.decrypt(req.userId)
            }
            addNotification(log, (err, result) => {
                if (result) {
                    getNotification(result.id, (err, result) => {
                        if (result) {
                            req.io.emit(`user:${crypto.encrypt(log.userId)}`, result);
                        }
                    })
                }
            });
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};


/**
 * Forum add
 * @param {*} req 
 * @param {*} forumId 
 * @param {*} userId 
 */
exports.newForum = function (req, forumId, userId) {
    var classId = crypto.decrypt(req.body.classId);

    getClass(classId, (err, result) => {
        if (result) {
            var courseId = result.course.id;
            getAllEnrollments(classId, (err, result) => {
                if (result) {
                    result.forEach(enroll => {
                        if (enroll.userId != userId) {
                            const data = {
                                message: "New forum question asked in your class.",
                                type: 'forum_created',
                            };

                            const log = {
                                text: data.message,
                                type: data.type,
                                clientId: crypto.decrypt(req.clientId),
                                userId: enroll.userId,
                                courseId: crypto.decrypt(courseId),
                                classId: classId,
                                taskId: null,
                                attachmentId: null,
                                submissionId: null,
                                announcementId: null,
                                forumId: forumId,
                                createdBy: userId
                            }
                            addNotification(log, (err, result) => {
                                if (result) {
                                    getNotification(result.id, (err, result) => {
                                        if (result) {
                                            req.io.emit(`user:${crypto.encrypt(enroll.userId)}`, result);
                                        }
                                    })
                                }
                            });
                        }
                    });
                } else {
                    console.log({
                        message: 'Failed to send notification to students',
                        err: err
                    })
                }
            })
        }
    })
};
exports.forumReply = async function (req, comment) {
    var forumId = comment.forumId;
    var replyId = crypto.decrypt(req.body.replyId);
    var createdBy = crypto.decrypt(req.userId);
    var users = [];

    var forum = await Forums.findOne({
        where: { id: forumId },
        attributes: ['createdBy', 'classId'],
    });

    const classId = forum.classId;

    if (forum.createdBy != createdBy) {
        users.push(forum.createdBy)
    }

    if (replyId) {
        var forumComment = await ForumsComments.findOne({ where: { id: replyId }, attributes: ['createdBy'] });
        users.push(forumComment.createdBy)
    }
    users = users.filter((v, i, a) => a.indexOf(v) === i);

    getClass(classId, (err, result) => {
        if (result) {
            var courseId = result.course.id;

            users.forEach(user => {
                const log = {
                    text: "Somebody replied to forum discussion.",
                    type: 'forum_reply_created',
                    clientId: crypto.decrypt(req.clientId),
                    userId: user,
                    courseId: crypto.decrypt(courseId),
                    classId: classId,
                    taskId: null,
                    attachmentId: null,
                    submissionId: null,
                    announcementId: null,
                    forumId: forumId,
                    createdBy: createdBy
                }
                addNotification(log, (err, result) => {
                    if (result) {
                        getNotification(result.id, (err, result) => {
                            if (result) {
                                req.io.emit(`user:${crypto.encrypt(user)}`, result);
                                console.log(`user:${user}`);
                            }
                        })
                    }
                });
            });
        } else {
            console.log("Failed to sent notification", null)
        }
    })
}


/**
 * Message add
 * @param {*} req 
 * @param {*} messageId
 */
exports.newMessage = function (req, messageId) {
    var senderId = crypto.decrypt(req.userId);
    var receiverId = crypto.decrypt(req.body.receiverId);

    getMessage(messageId, (err, result) => {
        if (result) {
            const data = {
                message: `${result.user.firstName} ${result.user.lastName} send you new message.`,
                type: 'message_created',
            };

            const log = {
                text: data.message,
                type: data.type,
                clientId: crypto.decrypt(req.clientId),
                userId: receiverId,
                courseId: null,
                classId: null,
                taskId: null,
                attachmentId: null,
                submissionId: null,
                announcementId: null,
                forumId: null,
                messageId: messageId,
                messageThreadId: crypto.decrypt(result.messageThread.id),
                createdBy: senderId
            }
            addNotification(log, (err, result) => {
                if (result) {
                    getNotification(result.id, (err, result) => {
                        if (result) {
                            req.io.emit(`user:${crypto.encrypt(receiverId)}`, result);
                        }
                    })
                }
            });
        } else {
            console.log({
                message: `Failed to send notification to ${senderId}`,
                err: err
            })
        }
    })
};



/**
 * Appointment add/update
 * @param {*} req 
 * @param {*} appointmentId 
 */
exports.newAppointment = function (req, appointmentId) {

    getAppointment(appointmentId, (err, result) => {
        if (result) {
            const log = {
                text: `${result.student.firstName} ${result.student.lastName} made an appointment with you.`,
                type: 'appointment_created',
                clientId: crypto.decrypt(req.clientId),
                userId: crypto.decrypt(result.teacher.id),
                courseId: null,
                classId: null,
                taskId: null,
                attachmentId: null,
                submissionId: null,
                announcementId: null,
                forumId: null,
                createdBy: crypto.decrypt(req.userId),
                appointmentId: crypto.decrypt(result.id)
            }
            addNotification(log, (err, result) => {
                if (result) {
                    getNotification(result.id, (err, result) => {
                        if (result) {
                            req.io.emit(`user:${result.userId}`, result);
                        }
                    })
                }
            });
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};
exports.updateAppointmentStatus = function (req, appointmentId) {

    getAppointment(appointmentId, (err, result) => {
        if (result) {
            const log = {
                text: result.status == 'Accepted' ?
                    `Appointment status has been Accepted.` :
                    `Appointment status has been Rejected.`,

                type: 'appointment_status_updated',
                clientId: crypto.decrypt(req.clientId),
                userId: crypto.decrypt(result.student.id),
                courseId: null,
                classId: null,
                taskId: null,
                attachmentId: null,
                submissionId: null,
                announcementId: null,
                forumId: null,
                createdBy: crypto.decrypt(req.userId),
                appointmentId: crypto.decrypt(result.id)
            }
            addNotification(log, (err, result) => {
                if (result) {
                    getNotification(result.id, (err, result) => {
                        if (result) {
                            req.io.emit(`user:${log.userId}`, result);
                        }
                    })
                }
            });
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};
exports.updateAppointment = function (req, appointmentId) {

    getAppointment(appointmentId, (err, result) => {
        if (result) {
            const log = {
                text: `Appointment has been updated.`,
                type: 'appointment_updated',
                clientId: crypto.decrypt(req.clientId),
                userId: req.role == 'Student' ? crypto.decrypt(result.teacher.id) : crypto.decrypt(result.student.id),
                courseId: null,
                classId: null,
                taskId: null,
                attachmentId: null,
                submissionId: null,
                announcementId: null,
                forumId: null,
                createdBy: crypto.decrypt(req.userId),
                appointmentId: crypto.decrypt(result.id)
            }
            addNotification(log, (err, result) => {
                if (result) {
                    getNotification(result.id, (err, result) => {
                        if (result) {
                            req.io.emit(`user:${log.userId}`, result);
                        }
                    })
                }
            });
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};



/**
 * TA assigned
 * @param {*} req 
 * @param {*} teacherAssistantsId
 */
exports.taAssigned = async function (req, teacherAssistantsId) {

    var taId = crypto.decrypt(teacherAssistantsId);
    getTeacherAssistant(taId, async (err, result) => {
        if (result) {
            // Send notification to Teacher
            const data = {
                message: 'TA has been assigned to you.',
                type: 'ta_assigned',
            };

            const log = {
                text: data.message,
                type: data.type,
                clientId: crypto.decrypt(req.clientId),
                userId: crypto.decrypt(result.teacherId),
                courseId: result.courseId,
                classId: result.classId,
                taskId: null,
                attachmentId: null,
                submissionId: null,
                announcementId: null,
                forumId: null,
                messageId: null,
                messageThreadId: null,
                teacherAssistantId: taId,
                createdBy: crypto.decrypt(req.userId)
            }
            addNotification(log, (err, result) => {
                if (result) {
                    getNotification(result.id, (err, result) => {
                        if (result) {
                            req.io.emit(`user:${crypto.encrypt(log.userId)}`, result);
                        }
                    })
                }
            });

            // Send notification to TA
            const data1 = {
                message: `You have been assigned to course: ${result.courseName}, section: ${result.className})`,
                type: 'ta_assigned',
            };

            const log1 = {
                text: data1.message,
                type: data1.type,
                clientId: crypto.decrypt(req.clientId),
                userId: crypto.decrypt(result.assistantId),
                courseId: result.courseId,
                classId: result.classId,
                taskId: null,
                attachmentId: null,
                submissionId: null,
                announcementId: null,
                forumId: null,
                messageId: null,
                messageThreadId: null,
                teacherAssistantId: taId,
                createdBy: crypto.decrypt(req.userId)
            }
            addNotification(log1, (err, result) => {
                if (result) {
                    getNotification(result.id, (err, result) => {
                        if (result) {
                            req.io.emit(`user:${crypto.encrypt(log1.userId)}`, result);
                        }
                    })
                }
            });
        } else {
            console.log({
                message: `Failed to send notification to user.`,
                err: err
            })
        }
    })
};


/**
 * New Registration
 * @param {*} req 
 * @param {*} userId
 */
exports.newRegistration = async function (req, userId) {

    var userId = crypto.decrypt(userId);
    getUser(userId, async (err, result) => {
        if (result) {

            // Send notification to Admin
            const data = {
                message: `${result.firstName} ${result.lastName} has signed up as ${result.role.title}`,
                type: 'new_registration',
            };

            const admin = await Users.findOne({ where: { roleId: 1, isActive: 'Y' } })
            const log = {
                text: data.message,
                type: data.type,
                clientId: req.clientId ? crypto.decrypt(req.clientId) : null,
                userId: admin.id,
                courseId: null,
                classId: null,
                taskId: null,
                attachmentId: null,
                submissionId: null,
                announcementId: null,
                forumId: null,
                messageId: null,
                messageThreadId: null,
                teacherAssistantId: null,
                createdBy: req.userId ? crypto.decrypt(req.userId) : null
            }

            addNotification(log, (err, result) => {
                if (result) {
                    getNotification(result.id, (err, result) => {
                        if (result) {
                            req.io.emit(`user:${crypto.encrypt(log.userId)}`, result);
                        }
                    })
                }
            });
        } else {
            console.log({
                message: `Failed to send notification to user.`,
                err: err
            })
        }
    })
};



/**
 * Quiz add/update/delete
 * @param {*} req 
 * @param {*} quizId 
 */
exports.newQuiz = function (req, quizId) {
    getQuiz(quizId, (err, quizDetails) => {
        if (quizDetails) {
            const enrollments = quizDetails.enrollments;
            enrollments.forEach(enroll => {
                const data = {
                    message: `New Quiz has been created in ${quizDetails.course.title}.`,
                    type: 'quiz_created',
                };

                const log = {
                    text: data.message,
                    type: data.type,
                    clientId: crypto.decrypt(req.clientId),
                    userId: enroll.userId,
                    courseId: crypto.decrypt(quizDetails.course.id),
                    classId: crypto.decrypt(quizDetails.class.id),
                    taskId: null,
                    attachmentId: null,
                    submissionId: null,
                    announcementId: null,
                    forumId: null,
                    createdBy: crypto.decrypt(req.userId),
                    quizId: crypto.decrypt(quizDetails.id)
                }
                addNotification(log, (err, result) => {
                    if (result) {
                        getNotification(result.id, (err, result) => {
                            if (result) {
                                req.io.emit(`user:${crypto.encrypt(enroll.userId)}`, result);
                            }
                        })
                    }
                });
            });
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};
exports.updateQuiz = function (req, quizId) {
    getQuiz(quizId, (err, quizDetails) => {
        if (quizDetails) {
            const enrollments = quizDetails.enrollments;
            enrollments.forEach(enroll => {
                const data = {
                    message: `Quiz has been updated in ${quizDetails.course.title}.`,
                    type: 'quiz_updated',
                };

                const log = {
                    text: data.message,
                    type: data.type,
                    clientId: crypto.decrypt(req.clientId),
                    userId: enroll.userId,
                    courseId: crypto.decrypt(quizDetails.course.id),
                    classId: crypto.decrypt(quizDetails.class.id),
                    taskId: null,
                    attachmentId: null,
                    submissionId: null,
                    announcementId: null,
                    forumId: null,
                    createdBy: crypto.decrypt(req.userId),
                    quizId: crypto.decrypt(quizDetails.id)
                }
                addNotification(log, (err, result) => {
                    if (result) {
                        getNotification(result.id, (err, result) => {
                            if (result) {
                                req.io.emit(`user:${crypto.encrypt(enroll.userId)}`, result);
                            }
                        })
                    }
                });
            });
        } else {
            console.log({
                message: 'Failed to send Notification',
                err: err
            })
        }
    })
};





/**
 * Database Queries
 * @param {*} ..... 
 * @param {*} cb 
 */
function getAnnouncementEnrollments(announcementId, cb) {
    Announcements.findOne({
        where: { id: announcementId },
        include: [
            {
                model: Classes,
                include: [
                    {
                        model: Courses,
                        attributes: ['name']
                    },
                    {
                        model: Enrollments,
                        attributes: ['userId']
                    },
                    {
                        model: ClassDays,
                        attributes: ['id', 'day', 'timing']
                    }
                ],
                attributes: ['title']
            }
        ],
        attributes: ['id', 'message', 'classId']
    })
        .then(result => {
            cb(null, result)
        })
        .catch(err => {
            cb(err, null)
        })
}
function getClass(classId, cb) {
    Classes.findOne({
        where: { id: classId },
        include: [
            {
                model: Courses,
                attributes: ['id', 'name']
            },
            {
                model: Users,
                attributes: ['firstName', 'lastName']
            }
        ],
        attributes: ['id', 'title']
    })
        .then(result => {
            var session = {
                id: crypto.encrypt(result.id),
                title: result.title,
                course: {
                    id: crypto.encrypt(result.course.id),
                    name: result.course.name
                },
                user: {
                    firstName: result.user.firstName,
                    lastName: result.user.lastName,
                }
            }
            cb(null, session)
        })
        .catch(err => {
            cb(err, null)
        })
}
function getEnrollment(enrollmentId, cb) {
    Enrollments.findOne({
        where: { id: enrollmentId }
    })
        .then(result => {
            cb(null, result)
        })
        .catch(err => {
            cb(err, null)
        })
}
function getAllEnrollments(classId, cb) {
    Enrollments.findAll({
        where: { classId: classId, isActive: 'Y' },
        attributes: ['userId']
    })
        .then(result => {
            cb(null, result)
        })
        .catch(err => {
            cb(err, null)
        })
}
function getTask(taskId, cb) {
    Tasks.findOne({
        where: { id: taskId },
        include: [
            {
                model: Classes,
                include: [
                    {
                        model: Courses,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Enrollments,
                        attributes: ['userId'],
                        raw: true
                    },
                    {
                        model: ClassDays,
                        attributes: ['id', 'day', 'timing']
                    }
                ],
                attributes: ['id', 'title']
            }
        ],
        attributes: ['id', 'title', 'description', 'dueDate']
    })
        .then(result => {
            cb(null, {
                id: crypto.encrypt(result.id),
                title: result.title,
                description: result.description,
                dueDate: result.dueDate,
                course: {
                    id: crypto.encrypt(result.class.course.id),
                    title: result.class.course.name
                },
                class: {
                    id: crypto.encrypt(result.class.id),
                    title: result.class.title
                },
                enrollments: result.class.enrollments
            })
        })
        .catch(err => {
            cb(err, null)
        })
}
function getMessage(messageId, cb) {
    Messages.findOne({
        where: { id: messageId },
        include: [
            {
                model: MessagesThreads,
                attributes: ['id', 'name']
            },
            {
                model: Users,
                attributes: ['firstName', 'lastName']
            }
        ],
        attributes: ['id', 'message']
    })
        .then(result => {
            var message = {
                id: crypto.encrypt(result.id),
                message: result.message,
                messageThread: {
                    id: crypto.encrypt(result.messagesThread.id),
                    name: result.messagesThread.name
                },
                user: {
                    firstName: result.user.firstName,
                    lastName: result.user.lastName,
                }
            }
            cb(null, message)
        })
        .catch(err => {
            cb(err, null)
        })
}
function getTeacherAssistant(teacherAssistantsId, cb) {
    TeacherAssistants.findOne({
        where: { id: teacherAssistantsId },
        include:
            [
                {
                    model: Classes,
                    where: { isActive: 'Y' },
                    include:
                        [
                            {
                                model: Courses,
                                where: { isActive: 'Y' }
                            }
                        ]
                }
            ]
    })
        .then(result => {
            var teacherAssistant = {
                id: crypto.encrypt(result.id),
                teacherId: crypto.encrypt(result.class.taughtBy),
                assistantId: crypto.encrypt(result.assistantId),
                className: result.class.title,
                classId: result.class.id,
                courseName: result.class.course.name,
                courseId: result.class.course.id
            }
            cb(null, teacherAssistant)
        })
        .catch(err => {
            cb(err, null)
        })
}
function getAppointment(appointmentId, cb) {
    Appointments.findByPk(appointmentId, {
        include:
            [
                {
                    model: Users, as: 'student'
                },
                {
                    model: OfficeHours
                }
            ]
    })
        .then(result => {
            encryptHelper(result)

            var appointment = {
                id: result.id,
                title: result.title,
                description: result.description,
                status: result.status,
                officeHour: {
                    id: result.officeHour.id,
                    start: result.officeHour.start,
                    end: result.officeHour.end,
                    day: result.officeHour.day,
                },
                teacher: {
                    id: result.officeHour.teacherId,
                },
                student: {
                    id: result.studentId,
                    firstName: result.student.firstName,
                    lastName: result.student.lastName,
                }
            }
            cb(null, appointment)
        })
        .catch(err => {
            cb(err, null)
        })
}
function getSubmission(submissionId, cb) {
    Submissions.findOne({
        where: { id: submissionId },
        attributes: ['message', 'link', 'grade', 'percentage', 'status', 'submittedBy']
    })
        .then(result => {
            cb(null, result)
        })
        .catch(err => {
            cb(err, null)
        })
}
function getIssue(issueId, cb) {
    Issues.findOne({
        where: { id: issueId },
        include: [
            {
                model: Users,
                where: { isActive: 'Y' },
                attributes: ['firstName', 'lastName']
            }
        ]
    })
        .then(result => {
            cb(null, result)
        })
        .catch(err => {
            cb(err, null)
        })
}
function getUser(userId, cb) {
    Users.findOne({
        where: { id: userId },
        include: [
            {
                model: Roles,
                attributes: ['title']
            }
        ],
        attributes: ['firstName', 'lastName', 'roleId', 'rollNumber']
    })
        .then(result => {
            cb(null, result)
        })
        .catch(err => {
            cb(err, null)
        })
}
function getQuiz(quizId, cb) {
    Quiz.findOne({
        where: { id: quizId },
        include: [
            {
                model: Classes,
                include: [
                    {
                        model: Courses,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Enrollments,
                        attributes: ['userId'],
                        raw: true
                    }
                ],
                attributes: ['id', 'title']
            }
        ],
        attributes: ['id', 'name', 'duration', 'startTime', 'endTime']
    })
        .then(result => {
            cb(null, {
                id: crypto.encrypt(result.id),
                name: result.name,
                duration: result.duration,
                startTime: result.startTime,
                endTime: result.endTime,
                course: {
                    id: crypto.encrypt(result.class.course.id),
                    title: result.class.course.name
                },
                class: {
                    id: crypto.encrypt(result.class.id),
                    title: result.class.title
                },
                enrollments: result.class.enrollments
            })
        })
        .catch(err => {
            cb(err, null)
        })
}
function addNotification(data, cb) {
    Notifications.create(data)
        .then(result => {
            console.log('Activity saved in database.')
            cb(null, result)
        })
        .catch(err => {
            console.log('Error occured while saving activity in database.', err)
            cb(err, null)
        })
}
function getNotification(notificationId, cb) {
    Notifications.findOne({
        where: { id: notificationId },
        include: [
            {
                model: Courses,
                attributes: ['name']
            },
            {
                model: Classes,
                include: [
                    {
                        model: ClassDays,
                        attributes: ['id', 'day', 'timing']
                    }
                ],
                attributes: ['title']
            },
            {
                model: Tasks,
                attributes: ['title', 'description', 'dueDate']
            },
            {
                model: Attachments,
                attributes: ['originalname', 'mimetype', 'size', 'path']
            },
            {
                model: Submissions,
                attributes: ['message', 'link', 'grade', 'percentage', 'status']
            },
            {
                model: Announcements,
                attributes: ['message']
            },
            {
                model: Forums,
                attributes: ['title', 'description', 'status']
            },
            {
                model: Users,
                include: [
                    {
                        model: Profiles,
                        attributes: ['profileImg']
                    }
                ],
                attributes: ['firstName', 'lastName', 'email']
            },
            {
                model: Messages,
                attributes: ['message', 'type']
            },
            {
                model: MessagesThreads,
                attributes: ['name'],
                include: [
                    {
                        model: Participants,
                        include: [
                            {
                                model: Users,
                                include: [
                                    {
                                        model: Profiles,
                                        attributes: ['profileImg']
                                    }
                                ],
                                attributes: ['firstName', 'lastName', 'email']
                            }
                        ],
                    }
                ],
            },
            {
                model: Appointments,
            },
            {
                model: TeacherAssistants,
                include:
                    [
                        {
                            model: Users, as: 'assistant',
                            attributes: ['firstName', 'lastName', 'email']
                        }
                    ]
            },
            {
                model: Quiz
            },
        ]
    })
        .then(data => {
            encryptHelper(data);
            cb(null, data)
        })
        .catch(err => {
            cb(err, null)
        });
}