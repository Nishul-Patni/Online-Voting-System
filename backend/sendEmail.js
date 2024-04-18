const nodemailer = require("nodemailer");


const sendEmail = async(to, message) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    service : "gmail",
    auth: {
        user: 'ovstest7@gmail.com',
        pass: 'immurzjjffrjcrbu'
    }
  });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"ovstest7@gmail.com', // sender address
        to: `${to}`, // list of receivers
        subject: "Registered", // Subject line
        text: message, // plain text body
    });

    return info.messageId;
}

module.exports = sendEmail;