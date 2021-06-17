const db = require("../../models");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const Sequelize = require('sequelize');

const Users = db.users;
const Roles = db.roles;

const Op = db.Sequelize.Op;
const Joi = require('@hapi/joi');
const { sequelize } = require("../../models");

exports.create = async (req, res) => {

    try {
        const joiSchema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required(),
            role: Joi.string().required(),
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);

            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {

            const user = await Users.findOne({ where: { email: req.body.email?.trim(), isActive: 'Y' } })

            if (user) {
                res.status(401).send({
                    mesage: 'Email already registered.'
                });
            } else {
                const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*+-";
                var shuffled = chars.split('').sort(function () { return 0.5 - Math.random() }).join('');
                var password = "";
                for (var i = 0; i < 20; i++) {
                    password += shuffled[Math.floor(Math.random() * shuffled.length)];
                }

                const userObj = {
                    firstName: req.body.firstName?.trim(),
                    lastName: req.body.lastName?.trim(),
                    email: req.body.email,
                    createdBy: crypto.decrypt(req.userId),
                    roleId: crypto.decrypt(req.body.role),
                    password: password
                };

                Users.create(userObj)
                    .then(async result => {
                        emails.addUser(userObj);
                        res.status(200).send({
                            message: "User created successfully."
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
        }
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
};

// Retrieve all User.
exports.findAllUsers = (req, res) => {

    try {
        Users.findAll({
            where: {
                isActive: 'Y'
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

// Retrieve all Users.
exports.findUserById = (req, res) => {

    try {
        Users.findOne({
            where: { id: crypto.decrypt(req.params.userId), isActive: 'Y' },
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
                        err.message || "Some error occurred while retrieving user."
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

// Update a User by the id in the request
exports.update = (req, res) => {
    try {
        const joiSchema = Joi.object({
            role: Joi.string().required()
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);
            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            const userId = crypto.decrypt(req.params.userId);

            Users.update({ 
                roleId: crypto.decrypt(req.body.role?.trim()),
                updatedBy: crypto.decrypt(req.userId),
            }, {
                where: { id: userId, isActive: 'Y' }
            })
                .then(num => {
                    if (num == 1) {

                        res.send({
                            message: "User was updated successfully."
                        });
                    } else {
                        res.send({
                            message: `Cannot update User. Maybe User was not found or req.body is empty!`
                        });
                    }
                })
                .catch(err => {
                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message: "Error updating User"
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
}

// Update a User by the id in the request
exports.updateProfile = (req, res) => {
    try {
        const joiSchema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);
            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            const userId = crypto.decrypt(req.userId);

            var user = {
                firstName: req.body.firstName?.trim(),
                lastName: req.body.lastName?.trim(),
            }

            Users.update(user, {
                where: { id: userId, isActive: 'Y' }
            })
                .then(num => {
                    if (num == 1) {
                        Users.findOne({
                            where: { id: userId },
                            include: [
                                {
                                    model: Roles,
                                    attributes: ['title']
                                }
                            ],
                            attributes: { exclude: ['password'] }
                        })
                            .then(user => {
                                encryptHelper(user);
                                res.send({ message: "User profile updated successfully.", user });
                            })
                    } else {
                        res.send({
                            message: `Cannot update User. Maybe User was not found or req.body is empty!`
                        });
                    }
                })
                .catch(err => {
                    emails.errorEmail(req, err);
                    res.status(500).send({
                        message: "Error updating User"
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
}

exports.changePassword = async (req, res) => {

    try {
        const joiSchema = Joi.object({
            oldPassword: Joi.string().required(),
            password: Joi.string().min(8).max(16).required(),
            password_confirmation: Joi.any().valid(Joi.ref('password')).required().label("Password and confirm password doesn't match.")
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);
            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            const id = crypto.decrypt(req.userId);
            const oldPassword = req.body.oldPassword;
            const newPassword = req.body.password;

            const user = await Users.findOne({ where: { id: id, isActive: 'Y', password: oldPassword } })

            if (user) {
                Users.update({ password: newPassword }, { where: { id: id, isActive: 'Y', password: oldPassword } })
                    .then(num => {
                        if (num == 1) {
                            res.send({
                                message: `User password updated successfully!`
                            });
                        } else {
                            res.send({
                                message: `Cannot update User password. Maybe User was not found or req body is empty.`
                            });
                        }
                    })
                    .catch(err => {
                        emails.errorEmail(req, err);
                        res.status(500).send({
                            message: "Error updating User password"
                        });
                    });
            } else {
                res.status(406).send({
                    message: `Old password does not match.`
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

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    try {
        const userId = crypto.decrypt(req.params.userId);

        Users.update({ isActive: 'N' }, {
            where: { id: userId }
        })
            .then(async num => {
                if (num == 1) {
                    res.send({
                        message: "User was deleted successfully."
                    });
                } else {
                    res.send({
                        message: `Cannot delete User. Maybe User was not found!`
                    });
                }
            })
            .catch(err => {
                emails.errorEmail(req, err);
                res.status(500).send({
                    message: "Error deleting User"
                });
            });
    } catch (err) {
        emails.errorEmail(req, err);

        res.status(500).send({
            message:
                err.message || "Some error occurred."
        });
    }
}