const db = require("../../models");
const jwt = require("../../utils/jwt");
const encryptHelper = require("../../utils/encryptHelper");
const emails = require("../../utils/emails");
const Users = db.users;
const Roles = db.roles;

const Op = db.Sequelize.Op;

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