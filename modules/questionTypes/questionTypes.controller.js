const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");

const QuestionTypes = db.questionType;
const Joi = require('@hapi/joi');

// Create and Save a new Question Type
exports.create = async (req, res) => {

    try {
        // Validate request
        const joiSchema = Joi.object({
            title: Joi.string().required()
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);

            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            const difficulty = {
                title: req.body.title
            }

            QuestionTypes.create(difficulty)
                .then(async result => {

                    res.status(200).send({
                        message: "Question Type created successfully."
                    })

                })
                .catch(async err => {
                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the Question Type."
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

// Find All Question Type
exports.findAll = (req, res) => {

    try {
        QuestionTypes.findAll({
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
                        err.message || "Some error occurred while retrieving Question Types."
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
// Find Single Question Type
exports.findbyId = (req, res) => {

    try {
        QuestionTypes.findOne({
            where: { id: crypto.decrypt(req.params.id), isActive: 'Y' },
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
                        err.message || "Some error occurred while retrieving Question Type."
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

// Update a Question Type by the id in the request
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
            const id = crypto.decrypt(req.params.id);
            const userId = crypto.decrypt(req.userId);

            const type = { 
                title: req.body.title.trim() 
            }

            QuestionTypes.update(type, { where: { id: id, isActive: 'Y' } })
                .then(num => {
                    if (num == 1) {
                        res.send({
                            message: "Question Type was updated successfully."
                        });
                    } else {
                        res.send({
                            message: `Cannot update Question Type. Maybe Question Type was not found or req.body is empty!`
                        });
                    }
                })
                .catch(err => {
                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message: "Error updating Question Type"
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

// Delete a Question Type with the specified id in the request
exports.delete = (req, res) => {
    try {
        QuestionTypes.update({ isActive: 'N' }, {
            where: { id: crypto.decrypt(req.params.id) }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "Question Type was deleted successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot delete Question Type. Maybe Question Type was not found or req.body is empty!`
                    });
                }
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message: "Error updating Question Type"
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
