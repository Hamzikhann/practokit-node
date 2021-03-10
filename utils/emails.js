const fs = require("fs");
const nodemailer = require('nodemailer');
const jwt = require("./jwt");
const db = require("../models");
const secrets = require("../config/secrets");
const sgMail = require('@sendgrid/mail');


const nodeMailer = require('./nodeMailer');

const Courses = db.courses;
const Classes = db.classes;
const Enrollments = db.enrollments;
const Tasks = db.tasks;
const Submissions = db.submissions;
const Users = db.users;
const Appointments = db.appointments;
const OfficeHours = db.officeHours;
const Registrations = db.registrations;
const Packages = db.packages;
const EnrollmentRequests = db.enrollmentRequests;
const TeacherAssistants = db.teacherAssistants;
const Quiz = db.quiz;

const baseURL = secrets.frontend_URL

sgMail.setApiKey(secrets.sendgridApiKey)
/**
 * Email component
 * @constructor
 */
function Email() { }

Email.test = async () => {
    try {
        const data = fs.readFileSync("./templates/accountActivationforStudents.html", "utf8");
        var text = data;
        // text = text.replace("[BUTTON_LINK]", process.env.frontend_URL + 'confirmation/' + crypto.encrypt(user.email));
        text = text.replace("[USER_NAME]", "Fareed Murtaza");
        // text = text.replace("[COURSE_NAME]", 'Some Course');
        // text = text.replace("[TRIAL_EXPIRE_DATE]", '15-11-2020');
        text = text.replace("[wasayil_demo_link]", 'https://drive.google.com/file/d/18yBKR9nPwLAKKX0WwRmIg0jhC0l0ZCrD/view?usp=sharing');
        text = text.replace("[BUTTON_LINK]", process.env.frontend_URL);
        // text = text.replace("[PHONE_NUMBER]", '0321-1199687');


        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            // to: 'fareedmurtaza91@gmail.com',
            // to: 'fareedmurtaza77@ucp.edu.pk',
            // to: 'ahmad.murtaza0@live.com',
            // to: 'afzaalkhan00@hotmail.com',
            subject: "Testing Email",
            html: text
        }

        sgMail.send(mailOptions)
            .then((res) => {
                console.log('Email sent', res)
                return "Test email sent";
            })
            .catch((error) => {
                console.log(error.response.body)
            })

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.signup = async (user) => {
    try {
        const data = fs.readFileSync("./templates/signup.html", "utf8");
        var text = data;
        text = text.replace("[BUTTON_LINK]", process.env.frontend_URL);
        text = text.replace("[PASSWORD]", user.password);
        text = text.replace("[USER_NAME]", user.firstName + " " + user.lastName);

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: user.email,
            subject: "Signin Invitation",
            html: text
        }

        nodeMailer(mailOptions)

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.signUpByOwn = async (user) => {
    try {
        const data = fs.readFileSync("./templates/confirmSignUp.html", "utf8");
        var text = data;
        text = text.replace("[USER_NAME]", user.firstName + " " + user.lastName);
        text = text.replace("[BUTTON_LINK]", process.env.frontend_URL + 'confirmation/' + crypto.encrypt(user.id + "," + user.email));
        text = text.replace("[EMAIL]", 'info@entuition.pk');
        text = text.replace("[PHONE_NUMBER]", '0321-1199687');

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: user.email,
            subject: "Account Verification",
            html: text
        }

        nodeMailer(mailOptions)

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.resendConfirmationEmail = async (user) => {
    try {
        const data = fs.readFileSync("./templates/confirmSignUp.html", "utf8");
        var text = data;
        text = text.replace("[USER_NAME]", user.firstName + " " + user.lastName);
        text = text.replace("[BUTTON_LINK]", process.env.frontend_URL + 'confirmation/' + crypto.encrypt(user.id + "," + user.email));
        text = text.replace("[EMAIL]", 'info@entuition.pk');
        text = text.replace("[PHONE_NUMBER]", '0321-1199687');

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: user.email,
            subject: "Account Verification",
            html: text
        }

        return nodeMailer(mailOptions)

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.welcomeAfterVerification = async (user) => {
    try {
        var directEnroll = user.id + "," + user.firstName + "," + user.lastName + "," + user.email
        var link = baseURL + "enroll/" + crypto.encrypt(directEnroll);

        const data = fs.readFileSync("./templates/welcomeAfterVerification.html", "utf8");
        var text = data;
        text = text.replace("[USER_NAME]", user.firstName + " " + user.lastName);
        text = text.replace("[BUTTON_LINK]", link);
        text = text.replace("[EMAIL]", 'info@entuition.pk');
        text = text.replace("[PHONE_NUMBER]", '0321-1199687');

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: user.email,
            subject: "Welcome to Entuition",
            html: text
        }

        nodeMailer(mailOptions)
    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.paymentMethod = async (token) => {
    try {
        var user = token.split(",")

        const userRegistrations = await Registrations.findOne({
            where: {
                isActive: 'Y',
                userId: user[0]
            },
            include: [
                {
                    model: Users,
                    where: { isActive: 'V' },
                    attributes: ['referredBy']
                },
                {
                    model: Packages,
                    where: { isActive: 'Y' },
                    attributes: ['price']
                }
            ],
            attributes: ['courses', 'userId', 'packageId']
        })

        var dues = 0;
        userRegistrations.package.price = userRegistrations.package.price.replace(",", "");
        if (userRegistrations.packageId == 1) {
            dues = userRegistrations.package.price

            //   For 50% Referral Discount   //
            if (userRegistrations.user.referredBy) {
                dues = dues - (dues * 0.5)
            }
            //===============================//

        } else if (userRegistrations.packageId == 2) {
            dues = Number(userRegistrations.package.price)

            //   For 50% Referral Discount per course   //
            if (userRegistrations.user.referredBy) {
                var perCourse = dues / 2;
                var referralPerCourse = perCourse * 0.5
                dues = perCourse + referralPerCourse
            }
            //==========================================//
        } else {
            dues = Number(userRegistrations.package.price)

            //   For 50% Referral Discount per course   //
            if (userRegistrations.user.referredBy) {
                var perCourse = dues / 3;
                var referralPerCourse = perCourse * 0.5
                dues = (perCourse * 2) + referralPerCourse
            }
            //==========================================//

            var coursesList = userRegistrations.courses.split(",")
            dues = dues + (5500 * (coursesList.length - 3))
        }


        const data = fs.readFileSync("./templates/methodsOfPayments.html", "utf8");
        var text = data;
        text = text.replace("[USER_NAME]", user[1] + " " + user[2]);
        text = text.replace("[DUES]", dues.toLocaleString());

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: user[3],
            subject: "Payment Due for Enrollment",
            html: text
        }

        return nodeMailer(mailOptions)

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.studentSignUp = async (reqBody) => {
    try {
        const data = fs.readFileSync("./templates/studentSignUp.html", "utf8");
        var text = data;

        text = text.replace("[FULL_NAME]", reqBody.firstName + " " + reqBody.lastName);
        text = text.replace("[email]", reqBody.email);
        text = text.replace("[role]", reqBody.role);
        text = text.replace("[address]", reqBody.address);
        text = text.replace("[city]", reqBody.city);
        text = text.replace("[state]", reqBody.state);
        text = text.replace("[phone]", reqBody.phone);
        text = text.replace("[guardianName]", reqBody.guardianName);
        text = text.replace("[guardianRelation]", reqBody.guardianRelation);
        text = text.replace("[school_name]", reqBody.schoolName);
        text = text.replace("[grade]", reqBody.grade);
        // text = text.replace("[guardianCNIC]", reqBody.guardianCNIC);
        text = text.replace("[guardianPhone]", reqBody.guardianPhone);
        text = text.replace("[packageId]", reqBody.packageId ? crypto.decrypt(reqBody.packageId) : "NULL");
        text = text.replace("[courses]", reqBody.courses);
        text = text.replace("[came_From]", reqBody.cameFrom);


        var emailSubject = `New Registration-${reqBody.firstName} ${reqBody.lastName}`;
        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: "info@entuition.pk",
            subject: emailSubject,
            html: text
            // attachments: [
            //     {
            //         filename: cnicFront[0].filename,
            //         path: cnicFront[0].path,
            //     },
            //     {
            //         filename: cnicBack[0].filename,
            //         path: cnicBack[0].path,
            //     }
            // ]
        }

        nodeMailer(mailOptions)
    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.teacherTASignUp = async (reqBody, resume) => {
    try {
        const data = fs.readFileSync("./templates/taTeacherSignUp.html", "utf8");
        var text = data;

        text = text.replace("[FULL_NAME]", reqBody.firstName + " " + reqBody.lastName);
        text = text.replace("[email]", reqBody.email);
        text = text.replace("[role]", reqBody.role);
        text = text.replace("[address]", reqBody.address);
        text = text.replace("[city]", reqBody.city);
        text = text.replace("[state]", reqBody.state);
        text = text.replace("[phone]", reqBody.phone);
        text = text.replace("[education]", reqBody.education);
        text = text.replace("[experience]", reqBody.experience);
        text = text.replace("[came_From]", reqBody.cameFrom);


        var emailSubject = `New Registration-${reqBody.firstName} ${reqBody.lastName}`;
        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: "jobs@entuition.pk",
            subject: emailSubject,
            html: text,
            attachments: [
                {
                    filename: resume[0].filename,
                    path: resume[0].path,
                }
            ]
        }

        nodeMailer(mailOptions)
    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.approveAccount = async (userId) => {
    try {
        const user = await Users.findOne({ where: { id: userId } })

        const data = fs.readFileSync("./templates/approveAccount.html", "utf8");
        var text = data;
        text = text.replace("[BUTTON_LINK]", process.env.frontend_URL);
        text = text.replace("[USER_NAME]", user.firstName + " " + user.lastName);

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: user.email,
            subject: "Account Approved.",
            html: text
        }

        nodeMailer(mailOptions)

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.approveAccountforTT = async (userId) => {
    try {
        const user = await Users.findOne({ where: { id: userId } })

        const data = fs.readFileSync("./templates/accountActivationforTT.html", "utf8");
        var text = data;
        text = text.replace("[USER_NAME]", user.firstName + " " + user.lastName);
        text = text.replace("[DEMO_LINK]", 'https://youtu.be/tTH9WqnRVXU');
        text = text.replace("[BUTTON_LINK]", process.env.frontend_URL);
        text = text.replace("[ROLL_NUMBER]", user.rollNumber);

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: user.email,
            subject: "Account Approved.",
            html: text
        }

        nodeMailer(mailOptions)

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.approveAccountforStudents = async (userId) => {
    try {
        const user = await Users.findOne({ where: { id: userId } })

        const data = fs.readFileSync("./templates/accountActivationforStudents.html", "utf8");
        var text = data;
        text = text.replace("[USER_NAME]", user.firstName + " " + user.lastName);
        text = text.replace("[DEMO_LINK]", 'https://youtu.be/q_1jFQPXMng');
        text = text.replace("[BUTTON_LINK]", process.env.frontend_URL);
        text = text.replace("[ROLL_NUMBER]", user.rollNumber);

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: user.email,
            subject: "Account Approved.",
            html: text
        }

        nodeMailer(mailOptions)

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.shareReferral = async (req) => {
    try {

        const user = await Users.findOne({ where: { id: crypto.decrypt(req.userId) } })

        var link = baseURL + "signup/" + crypto.encrypt(user.referralId);

        const data = fs.readFileSync("./templates/sendReferral.html", "utf8");
        var text = data;
        text = text.replace("[USER_NAME]", user.firstName + " " + user.lastName);
        text = text.replace("[BUTTON_LINK]", link);
        text = text.replace("[DISCOUNT]", '50');
        text = text.replace("[WEBSITE_LINK]", 'https://entuition.pk/');

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: req.body.email,
            subject: "Referral Invitation",
            html: text
        }

        return nodeMailer(mailOptions)
    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.sendStaticReferral = async (req) => {
    try {
        const data = fs.readFileSync("./templates/referrStaticEmail.html", "utf8");
        var text = data;

        await req.body.users.forEach(async user => {
            text = await text.replace("[USER_NAME]", user.name);
            var mailOptions = {
                from: 'ENTUITION <info@entuition.pk>',
                to: user.email,
                subject: "Referral Invitation",
                html: text
            }
            nodeMailer(mailOptions)
        });

        return "Email send"

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.sendInvoice = async (invoiceDetail) => {
    try {
        const user = await Users.findOne({ where: { id: invoiceDetail.userId } })
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        feeChallan = "";
        const coursesData = JSON.parse(invoiceDetail.coursesData)
        await coursesData.forEach(element => {
            feeChallan +=
                `<tr> <td style=\"padding: 6px 12px;font-size: 16px;font-family: lato,'helvetica neue',helvetica,arial,sans-serif; \">
            ${element.courseName}
            </td> <td style=\"padding: 6px 12px; text-align: center;font-size: 16px;font-family: lato,'helvetica neue',helvetica,arial,sans-serif;\">
            ${element.discountPercentage}%
            </td> <td style=\"padding: 6px 12px; text-align: center;font-size: 16px;font-family: lato,'helvetica neue',helvetica,arial,sans-serif;\">
            ${element.actualAmmount - (element.actualAmmount * (element.discountPercentage / 100))}</td> </tr>`
        });

        const data = fs.readFileSync("./templates/invoice.html", "utf8");
        var text = data;
        text = text.replace("[USER_NAME]", user.firstName + " " + user.lastName);
        text = text.replace("[COURSES_DETAILS]", feeChallan);
        text = text.replace("[DUES]", invoiceDetail.total.toLocaleString());
        text = text.replace("[DUE_DATE]", month[Number(invoiceDetail.due.split('-')[1]) - 1] +
            " " + invoiceDetail.due.split('-')[2] + ", " + invoiceDetail.due.split('-')[0]);

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: user.email,
            subject: "Fee Invoice",
            html: text
        }

        return nodeMailer(mailOptions)

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.sendStaticInvoice = async () => {
    try {
        const data = fs.readFileSync("./templates/staticInvoice.html", "utf8");
        var text = data;

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            // to: 'fareedmurtaza91@gmail.com',
            // to: 'salman@oxibit.com',
            // to: 'ahmad@entuition.pk',
            // to: 'rabiafarooque95@hotmail.com', // Haider Farooque
            // to: 'hamnaazhar34@gmail.com', // Hamna Azhar
            // to: 'sarahshoppe9@gmail.com', // Muhammad Khan
            // cc: "mk2977137@gmail.com", // Muhammad Khan
            subject: "Fee Invoice",
            html: text
        }

        return nodeMailer(mailOptions)

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.forgotPassword = async (user) => {
    try {
        const forgetPasswordToken = jwt.signToken({
            userId: user.id,
            roleId: user.roleId,
            clientId: user.clientId,
            email: user.email
        });

        var link = baseURL + "reset/password/" + forgetPasswordToken;

        const data = fs.readFileSync("./templates/forgotPassword.html", "utf8");
        var text = data;
        text = text.replace("[USER_NAME]", user.firstName + " " + user.lastName);
        text = text.replace("[BUTTON_LINK]", link);
        text = text.replace("[TEXT_LINK]", link);

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: user.email,
            subject: "Reset Password",
            html: text
        }

        nodeMailer(mailOptions)
    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.newSession = (data) => {
    try {
        Classes.findOne({
            where: { id: data.id },
            include: [
                {
                    model: Users,
                    attributes: ['firstName', 'lastName', 'email']
                },
                {
                    model: Courses,
                    attributes: ['id', 'name']
                }
            ]
        })
            .then(async result => {
                var link = baseURL + "courses/" + crypto.encrypt(result.course.id) + "/sessions";

                const data = fs.readFileSync("./templates/newSession.html", "utf8");
                var text = data;
                text = text.replace("[COURSE_NAME]", result.course.name);
                text = text.replace("[BUTTON_LINK]", link);
                text = text.replace("[TEXT_LINK]", link);
                text = text.replace("[TEXT_LINK_HREF]", link);
                text = text.replace("[USER_NAME]", result.user.firstName + " " + result.user.lastName);


                var mailOptions = {
                    from: 'ENTUITION <info@entuition.pk>',
                    to: result.user.email,
                    subject: "New Course Session has been Assigned to you.",
                    html: text
                }

                nodeMailer(mailOptions)
            })
            .catch(err => {
                console.log(err)
                return err
            })


    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.newSessionToTa = (data) => {
    try {
        Classes.findOne({
            where: { id: data.id },
            include: [
                {
                    model: Courses,
                    attributes: ['id', 'name']
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
                }
            ]
        })
            .then(async result => {
                var link = baseURL + "courses/" + crypto.encrypt(result.course.id) + "/sessions";

                const data = fs.readFileSync("./templates/newSession.html", "utf8");
                var text = data;
                text = text.replace("[COURSE_NAME]", result.course.name);
                text = text.replace("[BUTTON_LINK]", link);
                text = text.replace("[TEXT_LINK]", link);
                text = text.replace("[TEXT_LINK_HREF]", link);
                text = text.replace("[USER_NAME]", result.teacherAssistant.assistant.firstName +
                    " " + result.teacherAssistant.assistant.lastName);


                var mailOptions = {
                    from: 'ENTUITION <info@entuition.pk>',
                    to: result.teacherAssistant.assistant.email,
                    subject: "New Course Session has been Assigned to you.",
                    html: text
                }

                nodeMailer(mailOptions)
            })
            .catch(err => {
                console.log(err)
                return err
            })


    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.newEnrollments = (classId, userIds) => {
    try {
        var oldUsers = userIds.old;
        var newUsers = userIds.new;


        let oldEnrolls = oldUsers.map(a => a.userId);
        let newEnrolls = [];

        newUsers.forEach(element => {
            newEnrolls.push(Number(crypto.decrypt(element)))
        });
        var newEnrollments = newEnrolls.filter(e => !oldEnrolls.includes(e));

        Classes.findOne({
            where: { id: classId },
            include: [
                {
                    model: Users,
                    attributes: ['firstName', 'lastName', 'email']
                },
                {
                    model: Courses,
                    attributes: ['id', 'name']
                }
            ]
        })
            .then(async result => {

                var link = baseURL + "courses/" + crypto.encrypt(result.course.id) + "/sessions";

                const data = fs.readFileSync("./templates/newEnrollment.html", "utf8");
                var text = data;
                text = text.replace("[COURSE_NAME]", result.course.name);
                text = text.replace("[BUTTON_LINK]", link);
                text = text.replace("[TEXT_LINK]", link);
                text = text.replace("[TEXT_LINK_HREF]", link);

                const emailUsers = await Users.findAll({
                    where: { id: newEnrollments },
                    attributes: ['firstName', 'lastName', 'email', 'rollNumber']
                })

                emailUsers.forEach(async user => {
                    text = await text.replace("[USER_NAME]", user.firstName + " " + user.lastName + " (" + user.rollNumber + ")");
                    var mailOptions = {
                        from: 'ENTUITION <info@entuition.pk>',
                        to: user.email,
                        subject: "You have been enrolled to new Course.",
                        html: text
                    }
                    var result = await nodeMailer(mailOptions)
                })
                return "Sending Emails"
            })
            .catch(err => {
                console.log(err)
                return err
            })

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.newEnrollmentRequest = async (req, courseIdList) => {
    try {
        const user = await Users.findOne({
            where: { id: crypto.decrypt(req.userId) },
            attributes: ['firstName', 'lastName', 'email', 'rollNumber']
        })

        const course = await Courses.findAll({
            where: { id: courseIdList, isActive: 'Y' },
            attributes: ['name']
        })
        var courseList = '';
        course.forEach((element, index) => {
            courseList = courseList + element.name
            if (course[index + 1]) {
                courseList = courseList + ", "
            }
        });


        const data = fs.readFileSync("./templates/enrollmentRequest.html", "utf8");
        var text = data;
        text = text.replace("[ROLL_NO]", user.rollNumber);
        text = await text.replace("[FULL_NAME]", user.firstName + " " + user.lastName);
        text = text.replace("[EMAIL]", user.email);
        text = text.replace("[COURSES]", courseList);


        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: "info@entuition.pk",
            subject: `New Enrollment Request-${user.rollNumber}-${user.firstName} ${user.lastName}`,
            html: text
        }
        var result = await nodeMailer(mailOptions)
        return "Sending Emails"

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.newEnrollmentInvoiceToStudent = async (req, courseIdList, courseCount) => {
    try {

        const userId = req.userId;

        const user = await Users.findOne({
            where: { id: crypto.decrypt(userId) },
            attributes: ['firstName', 'lastName', 'email', 'rollNumber']
        })
        const course = await Courses.findAll({
            where: { id: courseIdList, isActive: 'Y' },
            attributes: ['name']
        })
        var courseList = '';
        course.forEach((element, index) => {
            courseList = courseList + element.name
            if (course[index + 1]) {
                courseList = courseList + ", "
            }
        });

        var dues = 5500 * courseCount;

        // //   For 20% Discount   //
        // dues = dues - (dues * 0.2)
        // //======================//

        const data = fs.readFileSync("./templates/newEnrollmentInvoice.html", "utf8");
        var text = data;
        text = text.replace("[USER_NAME]", user.firstName + " " + user.lastName + " (" + user.rollNumber + ")");
        text = text.replace("[COURSE_LIST]", courseList);
        text = text.replace("[DUES]", dues.toLocaleString());


        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: user.email,
            subject: "Payment Due for Enrollment",
            html: text
        }
        var result = await nodeMailer(mailOptions)
        return "Sending Emails"

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.approveEnrollmentRequest = async (req, enrollmentId) => {
    try {
        const enrollment = await Enrollments.findOne({
            where: { id: enrollmentId },
            include: [
                {
                    model: Classes,
                    where: { isActive: 'Y' },
                    include: [
                        {
                            model: Courses,
                            where: { isActive: 'Y' },
                            attributes: ['id', 'name']
                        }
                    ],
                    attributes: ['title']
                },
                {
                    model: Users,
                    where: { isActive: 'Y' },
                    attributes: ['firstName', 'lastName', 'email', 'rollNumber']
                }
            ],
            attributes: ['id']
        })

        const data = fs.readFileSync("./templates/newEnrollment.html", "utf8");

        var link = baseURL + "courses/" + crypto.encrypt(enrollment.class.course.id) + "/sessions";
        var text = data;
        text = text.replace("[USER_NAME]", enrollment.user.firstName + " " + enrollment.user.lastName + " (" + enrollment.user.rollNumber + ")");
        text = text.replace("[COURSE_NAME]", enrollment.class.course.name);
        text = text.replace("[BUTTON_LINK]", link);
        text = text.replace("[TEXT_LINK]", link);
        text = text.replace("[TEXT_LINK_HREF]", link);

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: enrollment.user.email,
            subject: "You have been enrolled to new Course",
            html: text
        }
        var result = await nodeMailer(mailOptions)
        return "Sending Emails"

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.disapproveEnrollmentRequest = async (req) => {
    try {
        const enrollment = await EnrollmentRequests.findOne({
            where: { id: crypto.decrypt(req.params.enrollmentId) },
            include: [
                {
                    model: Courses,
                    where: { isActive: 'Y' },
                    attributes: ['id', 'name']
                },
                {
                    model: Users,
                    where: { isActive: 'Y' },
                    attributes: ['firstName', 'lastName', 'email', 'rollNumber']
                }
            ],
            attributes: ['id']
        })

        const data = fs.readFileSync("./templates/disapproveEnrollmentRequest.html", "utf8");

        var text = data;
        text = text.replace("[USER_NAME]", enrollment.user.firstName + " " + enrollment.user.lastName + " (" + enrollment.user.rollNumber + ")");
        text = text.replace("[COURSE_NAME]", enrollment.course.name);

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: enrollment.user.email,
            subject: `Reject enrollment request for ${enrollment.course.name}`,
            html: text
        }
        var result = await nodeMailer(mailOptions)
        return "Sending Emails"

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.newTask = (task) => {
    try {
        Enrollments.findAll({
            where: { classId: task.classId },
            include: [{
                model: Users,
                attributes: ['firstName', 'lastName', 'email', 'rollNumber']
            }],
            raw: true
        })
            .then(async result => {
                var link = baseURL + "todo/" + task.id;

                const data = fs.readFileSync("./templates/newTask.html", "utf8");
                var text = data;
                text = text.replace("[TASK_NAME]", task.title);
                text = text.replace("[BUTTON_LINK]", link);
                text = text.replace("[TEXT_LINK]", link);
                text = text.replace("[TEXT_LINK_HREF]", link);

                result.forEach(async element => {
                    text = await text.replace("[USER_NAME]", element['user.firstName'] + " " + element['user.lastName'] + " (" + element['user.rollNumber'] + ")");
                    var mailOptions = {
                        from: 'ENTUITION <info@entuition.pk>',
                        to: element['user.email'],
                        subject: "New task has been assigned to you.",
                        html: text
                    }

                    var result = await nodeMailer(mailOptions)
                })
                return "Sending Emails";
            })
            .catch(err => {
                console.log(err)
                return err
            })

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.taskGraded = (submissionId) => {
    try {
        Submissions.findOne({
            where: { id: submissionId },
            include: [
                {
                    model: Users,
                    attributes: ['firstName', 'lastName', 'email', 'rollNumber']
                },
                {
                    model: Tasks,
                    attributes: ['id', 'title']
                }
            ],
            attributes: []
        })
            .then(async result => {
                var link = baseURL + "tasks/" + crypto.encrypt(result.task.id);

                const data = fs.readFileSync("./templates/submissionGraded.html", "utf8");
                var text = data;
                text = text.replace("[TASK_NAME]", result.task.title);
                text = text.replace("[BUTTON_LINK]", link);
                text = text.replace("[TEXT_LINK]", link);
                text = text.replace("[TEXT_LINK_HREF]", link);
                text = text.replace("[USER_NAME]", result.user.firstName + " " + result.user.lastName + " (" + result.user.rollNumber + ")");

                var mailOptions = {
                    from: 'ENTUITION <info@entuition.pk>',
                    to: result.user.email,
                    subject: "Submitted task has been graded.",
                    html: text
                }

                var result = await nodeMailer(mailOptions)
            })
            .catch(err => {
                console.log(err)
                return err
            })

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.newAppointment = (data) => {
    try {
        Appointments.findOne({
            where: { id: data.id },
            include:
                [
                    {
                        model: Users, as: 'student'
                    },
                    {
                        model: OfficeHours,
                        where: { isActive: 'Y' },
                        include: [
                            {
                                model: Users,
                                where: { isActive: 'Y' },
                                attributes: ['id', 'firstName', 'lastName', 'email']
                            }
                        ],
                        attributes: ['id', 'start', 'end', 'day', 'zoomLink']
                    }
                ],
        })
            .then(async result => {
                var firstName = result.student.firstName;
                var lastName = result.student.lastName

                var link = baseURL + "appointments/";

                const data = fs.readFileSync("./templates/newAppointment.html", "utf8");
                var text = data;

                text = text.replace("[FIRST_NAME]", firstName);
                text = text.replace("[LAST_NAME]", lastName + " (" + result.student.rollNumber + ")");
                text = text.replace("[DAY]", result.officeHour.day);
                text = text.replace("[TIME]", result.officeHour.start + " - " + result.officeHour.end);
                text = text.replace("[BUTTON_LINK]", link);
                text = text.replace("[TEXT_LINK]", link);
                text = text.replace("[TEXT_LINK_HREF]", link);
                text = text.replace("[USER_NAME]", result.officeHour.user.firstName + " " + result.officeHour.user.lastName);


                var mailOptions = {
                    from: 'ENTUITION <info@entuition.pk>',
                    to: result.officeHour.user.email,
                    subject: "Appointment request.",
                    html: text
                }

                var result = await nodeMailer(mailOptions)
            })
            .catch(err => {
                console.log(err)
                return err
            })


    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.appointmentStatusUpdate = (appointmentId) => {
    try {
        Appointments.findOne({
            where: { id: appointmentId },
            include:
                [
                    {
                        model: Users, as: 'student'
                    },
                    {
                        model: OfficeHours,
                        where: { isActive: 'Y' },
                        include: [
                            {
                                model: Users,
                                where: { isActive: 'Y' },
                                attributes: ['id', 'firstName', 'lastName', 'email']
                            }
                        ],
                        attributes: ['id', 'start', 'end', 'day', 'zoomLink']
                    }
                ],
        })
            .then(async result => {
                var firstName = result.officeHour.user.firstName;
                var lastName = result.officeHour.user.lastName

                var link = baseURL + "appointments/";

                const data = fs.readFileSync("./templates/appointmentStatusUpdate.html", "utf8");
                var text = data;

                text = text.replace("[FIRST_NAME]", firstName);
                text = text.replace("[LAST_NAME]", lastName);
                text = text.replace("[STATUS]", result.status);
                text = text.replace("[DAY]", result.officeHour.day);
                text = text.replace("[TIME]", result.officeHour.start + " - " + result.officeHour.end);
                text = text.replace("[BUTTON_LINK]", link);
                text = text.replace("[TEXT_LINK]", link);
                text = text.replace("[TEXT_LINK_HREF]", link);
                text = text.replace("[USER_NAME]", result.student.firstName + " " + result.student.lastName + " (" + result.student.rollNumber + ")");

                var mailOptions = {
                    from: 'ENTUITION <info@entuition.pk>',
                    to: result.student.email,
                    subject: result.status == "Rejected" ? "Appointment Rejected." : "Appointment Accepted.",
                    html: text
                }

                var result = await nodeMailer(mailOptions)
            })
            .catch(err => {
                console.log(err)
                return err
            })


    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.newQuiz = (req, quizId) => {
    try {
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
                            where: { isActive: 'Y' },
                            include: [{
                                model: Users,
                                attributes: ['firstName', 'lastName', 'email', 'rollNumber']
                            }]
                        }
                    ],
                    attributes: ['id', 'title']
                }
            ],
            attributes: ['id', 'name', 'duration', 'startTime', 'endTime']
        })
            .then(async result => {
                var link = baseURL + "quiz/" + crypto.encrypt(quizId);

                const data = fs.readFileSync("./templates/newQuiz.html", "utf8");
                var text = data;
                text = text.replace("[MESSAGE]", `<p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;">
                New quiz <strong>"${result.name}"</strong> created in "${result.class.course.name}".</p>`);
                text = text.replace("[DURATION]", result.duration);
                text = text.replace("[START_TIME]", result.startTime);
                text = text.replace("[END_TIME]", result.endTime);
                text = text.replace("[BUTTON_LINK]", link);
                text = text.replace("[TEXT_LINK]", link);
                text = text.replace("[TEXT_LINK_HREF]", link);

                await result.class.enrollments.forEach(async element => {
                    text = await text.replace("[USER_NAME]", element.user.firstName + " " + element.user.lastName + " (" + element.user.rollNumber + ")");
                    var mailOptions = {
                        from: 'ENTUITION <info@entuition.pk>',
                        to: element.user.email,
                        subject: "New Quiz has been created in your class.",
                        html: text
                    }

                    var result = await nodeMailer(mailOptions)
                })
                return "Sending Emails";
            })
            .catch(err => {
                console.log(err)
                return err
            })

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.updateQuiz = (req, quizId) => {
    try {
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
                            where: { isActive: 'Y' },
                            include: [{
                                model: Users,
                                attributes: ['firstName', 'lastName', 'email', 'rollNumber']
                            }]
                        }
                    ],
                    attributes: ['id', 'title']
                }
            ],
            attributes: ['id', 'name', 'duration', 'startTime', 'endTime']
        })
            .then(async result => {
                var link = baseURL + "quiz/" + crypto.encrypt(quizId);

                const data = fs.readFileSync("./templates/newQuiz.html", "utf8");
                var text = data;
                text = text.replace("[MESSAGE]", `<p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;">
                Quiz <strong>"${result.name}"</strong> of "${result.class.course.name}" has been updated.</p>`);
                text = text.replace("[DURATION]", result.duration);
                text = text.replace("[START_TIME]", result.startTime);
                text = text.replace("[END_TIME]", result.endTime);
                text = text.replace("[BUTTON_LINK]", link);
                text = text.replace("[TEXT_LINK]", link);
                text = text.replace("[TEXT_LINK_HREF]", link);

                await result.class.enrollments.forEach(async element => {
                    text = await text.replace("[USER_NAME]", element.user.firstName + " " + element.user.lastName + " (" + element.user.rollNumber + ")");
                    var mailOptions = {
                        from: 'ENTUITION <info@entuition.pk>',
                        to: element.user.email,
                        subject: "Quiz details has been updated.",
                        html: text
                    }

                    var result = await nodeMailer(mailOptions)
                })
                return "Sending Emails";
            })
            .catch(err => {
                console.log(err)
                return err
            })

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.messageReceive = (req, threadId) => {
    try {
        Users.findOne({
            where: { id: crypto.decrypt(req.body.receiverId) },
            attributes: ['firstName', 'lastName', 'rollNumber', 'email']
        })
            .then(async result => {

                const sender = await Users.findOne({
                    where: { id: crypto.decrypt(req.userId) },
                    attributes: ['firstName', 'lastName']
                })

                var link = baseURL + "messages/" + threadId;

                const data = fs.readFileSync("./templates/newMessage.html", "utf8");
                var text = data;
                text = await text.replace("[USER_NAME]", result.firstName + " " + result.lastName + " (" + result.rollNumber + ")");
                text = await text.replace("[SENDER_USER_NAME]", sender.firstName + " " + sender.lastName);
                text = text.replace("[MESSAGE]", req.body.message);
                text = text.replace("[BUTTON_LINK]", link);

                var mailOptions = {
                    from: 'ENTUITION <info@entuition.pk>',
                    to: result.email,
                    subject: `New Message from ${sender.firstName} ${sender.lastName}.`,
                    html: text
                }

                return nodeMailer(mailOptions)
            })
            .catch(err => {
                console.log(err)
                return err
            })

    } catch (error) {
        console.log(error)
        throw error;
    }
};

Email.errorEmail = async (req, error) => {
    try {
        const data = fs.readFileSync("./templates/error.html", "utf8");
        var text = data;

        const userInfo = {
            userId: req.userId ? crypto.decrypt(req.userId) : "NULL",
            roleId: req.roleId ? crypto.decrypt(req.roleId) : "NULL",
            role: req.role ? req.role : "NULL",
        }
        
        // =================== device info ====================
        const DeviceDetector = require("device-detector-js");
        const deviceDetector = new DeviceDetector();
        const userAgent = req.headers && req.headers['user-agent'] ? req.headers['user-agent'] : null
        const deviceInfo = userAgent ? deviceDetector.parse(userAgent) : null;
        //=====================================================

        text = text.replace("[USER_INFO]", JSON.stringify(userInfo));
        text = text.replace("[DEVICE_INFO]", JSON.stringify(deviceInfo));
        text = text.replace("[API]", JSON.stringify(req.originalUrl));
        text = text.replace("[METHOD]", req.method ? req.method : null);
        text = text.replace("[REQ_BODY]", JSON.stringify(req.body));
        text = text.replace("[REQ_PARAMS]", JSON.stringify(req.params));
        text = text.replace("[ERROR]", error);

        var mailOptions = {
            from: 'ENTUITION <info@entuition.pk>',
            to: "fareedmurtaza91@gmail.com",
            subject: "ERROR in Wasayil(" + req.headers.origin + ")",
            html: text
        }

        return nodeMailer(mailOptions)

    } catch (error) {
        console.log(error)
        throw error;
    }
};


module.exports = Email;

























// Email.taAssignedEMailForTeacher = async (req, dataId) => {
//     try {
//         const taData = await TeacherAssistants.findOne({ where: { id: crypto.decrypt(dataId) } })
//         const teacher = await Users.findOne({ where: { id: taData.teacherId } })
//         const assistant = await Users.findOne({ where: { id: taData.assistantId } })
//         const course = await Classes.findAll({
//             where: { taughtBy: teacher.id, isActive: 'Y' },
//             include: [{ model: Courses, where: { isActive: 'Y' }, attributes: ['name'] }],
//             attributes: ['title']
//         })

//         // Conversion of course array to course string. 
//         var courseList = '';
//         course.forEach((element, index) => {
//             courseList = courseList + element.course.name
//             if (course[index + 1]) {
//                 courseList = courseList + ", "
//             }
//         });

//         // Email Template. 
//         const data = fs.readFileSync("./templates/taAppointedForTeacher.html", "utf8");
//         var text = data;
//         text = text.replace("[TEACHER_NAME]", teacher.firstName + " " + teacher.lastName);
//         text = text.replace("[TA_NAME]", assistant.firstName + " " + assistant.lastName);
//         text = text.replace("[COURSE_NAME]", courseList);

//         var mailOptions = {
//             from: 'ENTUITION <info@entuition.pk>',
//             to: teacher.email,
//             subject: "TA Appointed.",
//             html: text
//         }

//         nodeMailer(mailOptions)

//     } catch (error) {
//         console.log(error)
//         throw error;
//     }
// };

// Email.taAssignedEMailForTA = async (req, dataId) => {
//     try {
//         const taData = await TeacherAssistants.findOne({ where: { id: crypto.decrypt(dataId) } })
//         const teacher = await Users.findOne({ where: { id: taData.teacherId } })
//         const assistant = await Users.findOne({ where: { id: taData.assistantId } })
//         const course = await Classes.findAll({
//             where: { taughtBy: teacher.id, isActive: 'Y' },
//             include: [{ model: Courses, where: { isActive: 'Y' }, attributes: ['name'] }],
//             attributes: ['title']
//         })

//         // Conversion of course array to course string. 
//         var courseList = '';
//         course.forEach((element, index) => {
//             courseList = courseList + element.course.name
//             if (course[index + 1]) {
//                 courseList = courseList + ", "
//             }
//         });

//         // Email Template.
//         const data = fs.readFileSync("./templates/taAppointedForTA.html", "utf8");
//         var text = data;
//         text = text.replace("[TA_NAME]", assistant.firstName + " " + assistant.lastName);
//         text = text.replace("[COURSE_NAME]", courseList);
//         text = text.replace("[TEACHER_NAME]", teacher.firstName + " " + teacher.lastName);

//         var mailOptions = {
//             from: 'ENTUITION <info@entuition.pk>',
//             to: assistant.email,
//             subject: "TA Appointed.",
//             html: text
//         }

//         nodeMailer(mailOptions)

//     } catch (error) {
//         console.log(error)
//         throw error;
//     }
// };
