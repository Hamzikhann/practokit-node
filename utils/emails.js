const fs = require("fs");
const secrets = require("../config/secrets");
const nodeMailer = require("./nodeMailer");
const jwt = require("./jwt");
const crypto = require("../utils/crypto");

const baseURL = secrets.frontend_URL;
const studentBaseURL = secrets.student_frontend_URL;

const db = require("../models");
const Quizzes = db.quizzes;
const Courses = db.courses;

const senderEmail = "ahmad@oxibit.com";

/**
 * Email component
 * @constructor
 */
function Email() {}

Email.errorEmail = async (req, error) => {
	try {
		const data = fs.readFileSync("./templates/error.html", "utf8");
		var text = data;

		const userInfo = {
			userId: req.userId ? crypto.decrypt(req.userId) : "NULL",
			roleId: req.roleId ? crypto.decrypt(req.roleId) : "NULL",
			role: req.role ? req.role : "NULL"
		};

		// =================== device info ====================
		const DeviceDetector = require("device-detector-js");
		const deviceDetector = new DeviceDetector();
		const userAgent = req.headers && req.headers["user-agent"] ? req.headers["user-agent"] : null;
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
			from: "Assessment Tool <info@entuition.pk>",
			to: "ahmad@oxibit.com",
			subject: "ERROR in Assessment Tool(" + req.headers.origin + ")",
			html: text
		};

		return nodeMailer(mailOptions);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

Email.addUser = async (user) => {
	try {
		const data = fs.readFileSync("./templates/addUser.html", "utf8");
		var text = data;

		text = text.replace("[USER_NAME]", user.firstName + " " + user.lastName);
		text = text.replace("[PASSWORD]", user.password);
		text = text.replace("[SIGNIN_BUTTON]", process.env.frontend_URL);

		var mailOptions = {
			from: `Assessment Tool <${senderEmail}>`,
			to: user.email,
			subject: "Welcome To Assesment Tool",
			html: text
		};
		console.log(mailOptions);

		return nodeMailer(mailOptions);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

Email.forgotPassword = async (user) => {
	try {
		const forgetPasswordToken = jwt.signToken({
			userId: user.id,
			roleId: user.roleId,
			email: user.email
		});

		var link = baseURL + "reset/password/" + forgetPasswordToken;

		const data = fs.readFileSync("./templates/forgotPassword.html", "utf8");
		var text = data;
		text = text.replace("[USER_NAME]", user.firstName + " " + user.lastName);
		text = text.replace("[BUTTON_LINK_1]", link);
		text = text.replace("[TEXT_LINK]", link);

		var mailOptions = {
			from: `Assessment Tool <${senderEmail}>`,
			to: user.email,
			subject: "Reset Password",
			html: text
		};

		nodeMailer(mailOptions);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

Email.assignQuiz = async (emailsList, assessmentId) => {
	try {
		const data = fs.readFileSync("./templates/assignAssessment.html", "utf8");
		var text = data;

		const assessment = await Quizzes.findOne({
			where: { id: assessmentId },
			include: [
				{
					model: Courses,
					attributes: ["title"]
				}
			],
			attributes: ["title"]
		});

		var link = studentBaseURL + "assessments/attempt/" + crypto.encrypt(assessmentId);

		text = text.replace("[USER_NAME]", "Student");
		text = text.replace("[ASSESSMENT]", assessment.title);
		text = text.replace("[COURSE]", assessment.course.title);
		text = text.replace("[BUTTON_LINK_1]", link);

		var emailBcc = "";
		await emailsList.forEach((email) => {
			emailBcc += email + ", ";
		});

		var mailOptions = {
			from: `Assessment Tool <${senderEmail}>`,
			to: "ahmad@oxibit.com",
			bcc: emailBcc,
			subject: "New Assessment",
			html: text
		};

		return nodeMailer(mailOptions);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

module.exports = Email;
