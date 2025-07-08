const nodemailer = require('nodemailer');
const fs = require('fs');

const sendEmail = async function(to, subject, text, html, attachmentPath){
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to, 
            subject, 
            text,
            html,
            attachmentPath: attachmentPath ? [{
                filename: 'ticket.pdf', 
                path: attachmentPath
            }] : []
        };
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: ", info.response);
    } catch(error){
        console.error("Email sent failed: ", error.message);
    }
};

module.exports = sendEmail;