const nodeMailer = require('nodemailer');
const appSettings = require('./appSettings');

module.exports = 
{
    sendMail: function(from, to, subject, body, bodyHtml, callback) {
        const transporter = nodeMailer.createTransport({
            host: appSettings.smtp.server,
            port: appSettings.smtp.port,
            secure: appSettings.smtp.useSecure,  //true for 465 port, false for other ports
            auth: {
                user: appSettings.smtp.username,
                pass: appSettings.smtp.password
            }
        });
        const mailOptions = {
            from: from,
            to: to.join(', '),
            subject: subject,
            text: body,
            html: bodyHtml
        };
        transporter.sendMail(mailOptions, callback);
    }
};