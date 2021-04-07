const nodemailer = require("nodemailer");
const secrets = require("../config/secrets");

async function nodeMailer(mailOptions) {
    const senderEmailAddress = 'info@entuition.pk';


    const transporter = await nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderEmailAddress,
            pass: 'Entuition!!22'
        }
    });

    try {
        await transporter.verify();
    } catch (error) {
        throw error;
    }

    const info = await transporter.sendMail(mailOptions);
    console.log(info)
    console.log('Email sent to ', mailOptions.to)
    return info;
    // return 1;
}

module.exports = nodeMailer;