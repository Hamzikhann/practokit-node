const db = require("../../models");
const jwt = require("../../utils/jwt");
const encryptHelper = require("../../utils/encryptHelper");
const notification = require("../../utils/notifications");
const emails = require("../../utils/emails");
const Users = db.users;
const Roles = db.roles;
const Registrations = db.registrations;
const Coupons = db.coupons;
const Joi = require('@hapi/joi');

const Op = db.Sequelize.Op;
const { sequelize } = require("./../../models");


exports.login = async (req, res) => {
    try {
        const userExist = await Users.findOne({
            where: {
                email: req.body.email,
                isActive: {
                    [Op.not]: 'N'
                }
            }
        })

        if (userExist && userExist.isActive == 'Y') {
            const user = await Users.findOne({
                where: {
                    email: req.body.email.trim(),
                    password: req.body.password,
                    isActive: 'Y'
                },
                include: [
                    {
                        model: Roles,
                        attributes: ['title']
                    }
                ],
                attributes: { exclude: ['password'] }
            });
            if (user) {
                encryptHelper(user);
                const token = jwt.signToken({ userId: user.id, roleId: user.roleId, clientId: user.clientId, role: user.role.title });
                res.status(200).send({ token, user });
            } else {
                res.status(403).send({ message: "Incorrect Logins" });
            }
        } else {
            res.status(405).send({
                title: 'Incorrect Email.',
                message: "Email does not exist in our system, Please verify you have entered correct email."
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

exports.signup = async (req, res) => {

    try {
        // Validate request
        const joiSchema = Joi.object({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            email: Joi.string().required(),
            role: Joi.string().required(),
            address: Joi.string().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            phone: Joi.string().required(),
            dob: Joi.string().required(),
            schoolName: Joi.string().optional().allow(''),
            grade: Joi.string().optional().allow(''),
            education: Joi.string().optional().allow(''),
            experience: Joi.string().optional().allow(''),
            guardianName: Joi.string().optional().allow(''),
            guardianPhone: Joi.string().optional().allow(''),
            guardianRelation: Joi.string().optional().allow(''),
            guardianCNIC: Joi.string().optional().allow(''),
            packageId: Joi.string().optional().allow(''),
            courses: Joi.string().optional().allow(''),
            referredBy: Joi.string().optional().allow(''),
            cameFrom: Joi.string().required()
        });
        const { error, value } = joiSchema.validate(req.body);

        if (error) {
            emails.errorEmail(req, error);

            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {

            const user = await Users.findOne({ where: { email: req.body.email.trim(), isActive: 'Y' } })

            if (user) {
                res.status(401).send({
                    message: "Email already registered."
                });
            } else {
                var RUser = await Users.findOne({ where: { email: req.body.email.trim(), isActive: 'R' } })
                var VUser = await Users.findOne({ where: { email: req.body.email.trim(), isActive: 'V' } })

                if (RUser) {
                    res.status(401).send({
                        message: "Email already registered but not verified."
                    });
                } else if (VUser) {
                    res.status(405).send({
                        title: 'Email already in use.',
                        message: "You will be able to access your account once you receive activation email from Mathecad Team."
                    });
                } else {
                    console.log('================ New Sign Up ================');
                    console.log(req.body)
                    console.log('==============================================');

                    const role = req.body.role;
                    var roleId;
                    if (role == 'Student') {
                        roleId = 3;
                    } else if (role == 'Teacher') {
                        roleId = 2;
                    } else if (role == 'Assistant') {
                        roleId = 4;
                    } else {
                        roleId = -1;
                    }

                    if (roleId == -1) {
                        res.send({ message: 'Invalid Role' });
                    } else {
                        let transaction = await sequelize.transaction();

                        // refered by============================
                        var referredBy = null;
                        var referralUserId = null;
                        if (req.body.referredBy) {
                            referredBy = crypto.decrypt(req.body.referredBy)

                            const referralUser = await Users.findOne({ where: { referralId: referredBy } })
                            referralUserId = referralUser.id

                            await Coupons.create({ userId: referralUserId }, transaction)
                        }
                        // =======================================

                        const user = {
                            firstName: req.body.firstName.trim(),
                            lastName: req.body.lastName.trim(),
                            email: req.body.email.trim(),
                            roleId: roleId,
                            isActive: 'R',
                            referredBy: referralUserId,
                            referralId: Math.floor(Math.random() * 90000) + 10000,
                            address: req.body.address.trim(),
                            city: req.body.city,
                            state: req.body.state,
                            mobile: req.body.phone.trim(),
                            phone: req.body.phone.trim(),
                            dob: req.body.dob ? req.body.dob.trim() : null,
                            schoolName: req.body.schoolName ? req.body.schoolName.trim() : null,
                            grade: req.body.grade ? req.body.grade.trim() : null,
                            educationName: req.body.education ? req.body.education.trim() : null,
                            experience: req.body.experience ? req.body.experience.trim() : null,
                            guardianName: req.body.guardianName ? req.body.guardianName.trim() : null,
                            guardianRelation: req.body.guardianRelation ? req.body.guardianRelation.trim() : null,
                            guardianCNIC_Number: req.body.guardianCNIC ? req.body.guardianCNIC.trim() : null,
                            guardianPhone: req.body.guardianPhone ? req.body.guardianPhone.trim() : null,
                            cameFrom: req.body.cameFrom.trim()
                        };

                        const file = req.files;
                        if (file['resume']) {
                            user.resume = file['resume'][0].path;
                        }

                        // Save User in the database
                        Users.create(user, { transaction })
                            .then(userData => {

                                var packageId = null;
                                if (req.body.packageId) {
                                    packageId = crypto.decrypt(req.body.packageId)
                                }

                                const registration = {
                                    courses: req.body.courses,
                                    packageId: packageId,
                                    userId: userData.id
                                };

                                Registrations.create(registration, { transaction })
                                    .then(async registrationData => {
                                        var user = encryptHelper(userData);
                                        encryptHelper(registrationData);

                                        notification.newRegistration(req, userData.id)
                                        const result = emails.signUpByOwn(user)
                                        // if (roleId == 3) {
                                        //     const notifyAdmin = emails.studentSignUp(req.body)
                                        // }
                                        // else {
                                        //     const notifyAdmin = emails.teacherSignUp(req.body, file['resume'])
                                        // }

                                        await transaction.commit();
                                        res.send({ user: user, package: registrationData });
                                    })
                                    .catch(async err => {
                                        if (transaction) await transaction.rollback();
                                        emails.errorEmail(req, err);
                                        res.status(500).send({
                                            message:
                                                err.message || "Some error occurred while creating the registration."
                                        });
                                    });
                            })
                            .catch(async err => {
                                if (transaction) await transaction.rollback();
                                emails.errorEmail(req, err);
                                res.status(400).send({
                                    message:
                                        err.message || "Some error occurred while creating the user."
                                });
                            });
                    }
                }
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

exports.signupConfirmation = async (req, res) => {

    try {
        // Validate request
        const joiSchema = Joi.object({
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
            var token = crypto.decrypt(req.params.token)
            token = token.split(",")

            const user = await Users.findOne({ where: { id: crypto.decrypt(token[0]), isActive: 'R' } })
            if (user) {
                const userData = {
                    password: req.body.password,
                    isActive: 'V',
                };

                Users.update(userData, { where: { id: user.id } })
                    .then(confirmUser => {

                        notification.accountVerified(user.id)
                        if (user.roleId == 3) {
                            const result = emails.welcomeAfterVerification(user)
                        }
                        res.status(200).send({
                            message: "Account confirmed successfully."
                        });
                    })
                    .catch(err => {
                        emails.errorEmail(req, err);
                        res.status(500).send({
                            message:
                                err.message || "Some error occurred while account confirmation."
                        });
                    });
            } else {
                res.status(400).send({
                    message: "Email not found."
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

exports.resendConfirmationEmail = async (req, res) => {

    try {
        var email = req.params.email;
        const user = await Users.findOne({ where: { email: email, isActive: 'R' } })
        if (user) {
            const result = emails.signUpByOwn(encryptHelper(user))
            if (result) {
                res.status(200).send({
                    message: "Confirmation email send successfully."
                });
            }
        } else {
            res.status(400).send({
                message: "Email not found."
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

exports.checkEmailStatus = async (req, res) => {

    try {
        const userEmail = crypto.decrypt(req.params.email)
        const user = await Users.findOne({ where: { email: userEmail, isActive: 'V' } })

        if (user) {
            res.status(200).send({
                message: "Account is verified."
            });
        } else {
            res.status(400).send({
                message: "Account is not verified."
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

exports.getEmailStatus = async (req, res) => {

    try {
        const userEmail = req.params.email
        const user = await Users.findOne({
            where: {
                email: userEmail,
                isActive: {
                    [Op.not]: 'N'
                }
            },
            attributes: ['id', 'firstName', 'lastName', 'email', 'isActive']
        })

        if (user) {
            res.status(200).send(encryptHelper(user));
        } else {
            res.status(200).send({
                message: "Account not found.",
                user: null
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

exports.forgotPassword = async (req, res) => {
    try {
        var email = req.body.email.trim();

        const user = await Users.findOne({
            where: { email: email, isActive: 'Y' }
        });
        if (user) {
            emails.forgotPassword(user);
            res.status(200).send({ message: "Email send to user." });
        } else {
            res.status(403).send({ message: "Incorrect email." });
        }

    } catch (err) {
        emails.errorEmail(req, err);
        res.status(500).send({
            message: err.message || "Some error occurred."
        })
    }
}
exports.resetPassword = async (req, res) => {
    try {
        var email = req.email;

        const joiSchema = Joi.object({
            password: Joi.string().min(8).max(16).required(),
            confirmPassword: Joi.any().valid(Joi.ref('password')).required()
        });
        const { error, value } = joiSchema.validate(req.body);
        if (error) {
            emails.errorEmail(req, error);

            const message = error.details[0].message.replace(/"/g, '');
            res.status(400).send({
                message: message
            });
        } else {
            const user = await Users.findOne({ where: { email: email, isActive: 'Y' } });
            if (user) {
                var password = req.body.password;

                Users.update({ password: password }, { where: { id: user.id } })
                    .then(result => {
                        res.send({
                            message: "User password reset successfully."
                        });
                    })
                    .catch(err => {
                        emails.errorEmail(req, err);
                        res.status(500).send({
                            message: "Error while reset User password"
                        });
                    });

            } else {
                res.status(403).send({ message: "Email not found." });
            }
        }
    } catch (err) {
        emails.errorEmail(req, err);
        res.status(500).send({
            message: err.message || "Some error occurred while reset password."
        })
    }
}

exports.decryptObject = async (req, res) => {
    try {
        var token = crypto.decrypt(req.params.token)
        token = token.split(",")

        const user = await Users.findOne({
            where: { id: crypto.decrypt(token[0]) },
            attributes: { exclude: ['password'] }
        })

        res.send(user)

    } catch (err) {
        emails.errorEmail(req, err);
        res.status(500).send({
            message: err.message || "Some error occurred."
        })
    }
}
exports.sendPaymentMethodEmail = async (req, res) => {

    try {
        const token = crypto.decrypt(req.params.token);
        console.log(token)
        const result = await emails.paymentMethod(token)

        if (result) {
            res.status(200).send({
                message: "Payment methods email send."
            });
        } else {
            res.status(405).send({
                message: "Payment methods email not send."
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

