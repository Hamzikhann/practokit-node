const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");

const QuestionDifficulties = db.questionDifficulties;
const Joi = require('@hapi/joi');

// Create and Save a new Question Difficulty
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
                title: req.body.title.trim(),
                createdBy: crypto.decrypt(req.userId)
            }

            const alreadyExist = await QuestionDifficulties.findOne({
                where: {
                    title: difficulty.title
                },
                attributes: ['id']
            })
            if (alreadyExist) {
                res.status(405).send({
                    title: 'Already exist.',
                    message: "'" + difficulty.title + "' difficulty is already exist."
                });
            } else {
                QuestionDifficulties.create(difficulty)
                    .then(async result => {

                        res.status(200).send({
                            message: "Question Difficulty created successfully."
                        })

                    })
                    .catch(async err => {
                        emails.errorEmail(req, err);
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while creating the Question Difficulty."
                        });
                    });
            }
        }
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Find All Question Difficulty
exports.findAll = (req, res) => {

    try {
        QuestionDifficulties.findAll({
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
                        err.message || "Some error occurred while retrieving Question Difficulties."
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
// Find Single Question Difficulty
exports.findbyId = (req, res) => {

    try {
        const QuestionDifficultyId = crypto.decrypt(req.params.id)

        QuestionDifficulties.findOne({
            where: { id: QuestionDifficultyId, isActive: 'Y' },
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
                        err.message || "Some error occurred while retrieving Question Difficulty."
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

// Update a Question Difficulty by the id in the request
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

            const difficulty = {
                title: req.body.title.trim()
            }

            QuestionDifficulties.update(difficulty, { where: { id: id, isActive: 'Y' } })
                .then(num => {
                    if (num == 1) {
                        res.send({
                            message: "Question Difficulty was updated successfully."
                        });
                    } else {
                        res.send({
                            message: `Cannot update Question Difficulty. Maybe Question Difficulty was not found.`
                        });
                    }
                })
                .catch(err => {
                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message: "Error updating Question Difficulty"
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

// Delete a Question Difficulty with the specified id in the request
exports.delete = (req, res) => {
    try {
        QuestionDifficulties.update({ isActive: 'N' }, {
            where: { id: crypto.decrypt(req.params.id) }
        })
            .then(num => {
                if (num == 1) {
                    res.send({
                        message: "Question Difficulty was deleted successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot delete Question Difficulty. Maybe Question Difficulty was not found or req.body is empty!`
                    });
                }
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message: "Error updating Question Difficulty"
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
