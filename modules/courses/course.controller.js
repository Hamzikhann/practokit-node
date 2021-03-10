const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const Sequelize = require('sequelize');

const Courses = db.courses;

const Op = db.Sequelize.Op;
const Joi = require('@hapi/joi');
const { sequelize } = require("../../models");

// Create and Save a new course
exports.create = async (req, res) => {

    try {
        // Validate request
        const joiSchema = Joi.object({
            title: Joi.string().required(),
            classId: Joi.string().required(),
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);

            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            const course = {
                title: req.body.title,
                classId: crypto.decrypt(req.body.classId),
                createdBy: crypto.decrypt(req.userId)
            }
            
            Courses.create(course)
                .then(async result => {
                   
                    res.status(200).send({
                        message: "Course created successfully."
                    })

                })
                .catch(async err => {
                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Quiz."
                    });
                });
        }
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Find All course
exports.findAll = (req, res) => {

    try {
        Courses.findAll({
            where: { isActive: 'Y' },
            attributes: { exclude: ['isActive'] }
        })
            .then(data => {
                encryptHelper(data);
                res.send(data);
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Courses."
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

// Find All course of classes
exports.findAllByClass = (req, res) => {

    try {
        Courses.findAll({
            where: { classId: crypto.decrypt(req.params.classId), isActive: 'Y' },
            attributes: { exclude: ['isActive'] }
        })
            .then(data => {
                encryptHelper(data);
                res.send(data);
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving Courses."
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

// Update a course by the id in the request
exports.update = (req, res) => {

    try {
        const joiSchema = Joi.object({
            title: Joi.string().required()
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            const courseId = crypto.decrypt(req.params.courseId);
            const userId = crypto.decrypt(req.userId);

            Courses.update({ title: req.body.title.trim() }, { where: { id: courseId, isActive: 'Y', createdBy: userId } })
                .then(num => {
                    if (num == 1) {
                        res.send({
                            message: "Course was updated successfully."
                        });
                    } else {
                        res.send({
                            message: `Cannot update Course. Maybe Course was not found or req.body is empty!`
                        });
                    }
                })
                .catch(err => {
                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message: "Error updating Course"
                    });
                });
        }
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Delete a Course with the specified id in the request
exports.delete = (req, res) => {
    try {
        const courseId = crypto.decrypt(req.params.courseId);

        Courses.update({ isActive: 'N' }, {
            where: { id: courseId }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "Course was deleted successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot delete Course. Maybe Course was not found or req.body is empty!`
                    });
                }
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message: "Error updating Course"
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
