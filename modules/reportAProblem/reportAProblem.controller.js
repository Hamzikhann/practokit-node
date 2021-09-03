const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");

const ReportAProblem = db.reportAProblem;
const Users = db.users;
const Joi = require('@hapi/joi');

exports.create = async (req, res) => {
    try {
        const joiSchema = Joi.object({
            subject: Joi.string().required(),
            description: Joi.string().required(),
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);

            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {

            const problemObj = {
                subject: req.body.subject.trim(),
                description: req.body.description.trim(),
                createdBy: crypto.decrypt(req.userId)
            };

            ReportAProblem.create(problemObj)
                .then(async result => {
                    res.status(200).send({ message: "Problem Reported successfully." })
                })
                .catch(async err => {
                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while reporting problem."
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

// Find All Problems
exports.findAll = (req, res) => {
    try {
        ReportAProblem.findAll({
            where: { isActive: 'Y' },
            include: {
                model: Users,
                attributes: ['id', 'firstName', 'lastName', 'email']
            },
            order: [['createdAt', 'DESC']]
        })
            .then(data => {
                encryptHelper(data);
                res.send(data);

                const viewedByAdmin = ReportAProblem.update({ status: 'viewed' }, {
                    where: { status: 'not-fixed' }
                })
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving complaints."
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

// Find All Student reported Problems 
exports.findAllForStudent = (req, res) => {
    try {
        ReportAProblem.findAll({
            where: { isActive: 'Y', createdBy: crypto.decrypt(req.userId) },
            order: [['createdAt', 'DESC']]
        })
            .then(data => {
                encryptHelper(data);
                res.send(data);
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving complaints."
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

exports.updateStatus = async (req, res) => {
    try {
        const joiSchema = Joi.object({
            status: Joi.string().required(),
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);

            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            ReportAProblem.update({ status: req.body.status }, {
                where: { id: crypto.decrypt(req.params.problemId) }
            })
                .then(num => {
                    if(num == 1){
                        res.status(200).send({ message: "Problem Reported successfully." })
                    } else {
                        res.send({
                            message: `Cannot update problem status. Maybe not found.`
                        });
                    }
                })
                .catch(async err => {
                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while update status of problem."
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