const logger = require("../lib/logger.lib");
const Transporter = require("./transporter.middleware");

const MailSender = async (payload)=>{
    const {receipient_email, subject, text, template} = {...payload};
    let sender_email = process.env.TRANSPORTER_AUTH_USER;

    const mailOptions = {
        from: sender_email, // sender address
        to: receipient_email, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: template, // html body
    };
    
    Transporter.sendMail(mailOptions, function (err, info){
        if(err){
            //console.log(err)
            logger.log('error',`error while sending email to ${receipient_email}`);
            //throw new Error('error while sending email')
        }
    })
}
module.exports = MailSender;