const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");

const QuestionTypes = db.questionType;
const Joi = require('@hapi/joi');

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