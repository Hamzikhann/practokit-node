const nodemailer = require("nodemailer");
const secrets = require("../config/secrets");

async function nodeMailer(mailOptions) {
	// return 1;

	const transporter = await nodemailer.createTransport({
		host: "smtp.sendgrid.net",
		port: 465,
		auth: {
			user: "apikey",
			pass: "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"
		}
	});

	try {
		await transporter.verify();
	} catch (error) {
		throw error;
	}

	const info = await transporter.sendMail(mailOptions);
	console.log(info);
	console.log("Email sent to ", mailOptions.to);
	return info;
}

module.exports = nodeMailer;
