const nodemailer = require("nodemailer");
const MailOtpTemplate = require("../mail-templates/MailOtpTemplate");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "hasnainalam1166@gmail.com",
    pass: "bicr huaj ghke mkyd",
  },
});

const sendMail = async ({
    email,
    subject,
    payload,
    template
})=> {
await transporter.sendMail({
  from: 'Bestport',
  to: email,
  subject,
  html:getTemplate(template,payload)
   })
}

const getTemplate = (name, payload) => {
    switch (name) {
        case 'otp':
            return MailOtpTemplate(payload)

        default:
            return MailOtpTemplate(payload)

    }
}

module.exports = {
    sendMail,
    getTemplate
}