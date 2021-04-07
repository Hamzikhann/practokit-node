const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const Sequelize = require('sequelize');

const Classes = db.classes;
const Courses = db.courses;
const Tags = db.tags;
const Joi = require('@hapi/joi');

// Create and Save a new Tag
exports.create = async (req, res) => {

    try {
        // Validate request
        const joiSchema = Joi.object({
            title: Joi.string().required(),
            courseId: Joi.string().required(),
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);

            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            const tag = {
                title: req.body.title,
                courseId: crypto.decrypt(req.body.courseId),
                createdBy: crypto.decrypt(req.userId)
            }

            Tags.create(tag)
                .then(async result => {

                    res.status(200).send({
                        message: "Tag created successfully."
                    })

                })
                .catch(async err => {
                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Tag."
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

// Find All Tags
exports.findAll = (req, res) => {

    try {
        Tags.findAll({
            where: { isActive: 'Y' },
            include: {
                model: Courses,
                include: {
                    model: Classes,
                    attributes: ['id', 'title']
                },
                attributes: ['id', 'title']
            },
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
                        err.message || "Some error occurred while retrieving Tags."
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
// Find All Tags of course
exports.findAllofCourse = (req, res) => {

    try {
        Tags.findAll({
            where: { courseId: crypto.decrypt(req.params.courseId), isActive: 'Y' },
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
// Find Single Tag
exports.findTag = (req, res) => {

    try {
        const tagId = crypto.decrypt(req.params.tagId)

        Tags.findOne({
            where: { id: tagId, isActive: 'Y' },
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
                        err.message || "Some error occurred while retrieving Tag."
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

// Update a Tag by the id in the request
exports.update = (req, res) => {

    try {
        const joiSchema = Joi.object({
            title: Joi.string().required(),
            courseId: Joi.string().required()
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            const TagId = crypto.decrypt(req.params.tagId);
            const userId = crypto.decrypt(req.userId);

            const tag = { 
                title: req.body.title.trim(), 
                courseId: crypto.decrypt(req.body.courseId) 
            }

            Tags.update(tag, { where: { id: TagId, isActive: 'Y', createdBy: userId } })
                .then(num => {
                    if (num == 1) {
                        res.send({
                            message: "Tag was updated successfully."
                        });
                    } else {
                        res.send({
                            message: `Cannot update Tag. Maybe Tag was not found or req.body is empty!`
                        });
                    }
                })
                .catch(err => {
                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message: "Error updating Tag"
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

// Delete a Tag with the specified id in the request
exports.delete = (req, res) => {
    try {
        Tags.update({ isActive: 'N' }, {
            where: { id: crypto.decrypt(req.params.tagId) }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "Tag was deleted successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot delete Tag. Maybe Tag was not found or req.body is empty!`
                    });
                }
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message: "Error updating tag"
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
