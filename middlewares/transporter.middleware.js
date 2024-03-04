const nodemailer = require("nodemailer");
require("dotenv").config()

let Transporter = nodemailer.createTransport({
    name: process.env.TRANSPORTER_NAME,
    host: process.env.TRANSPORTER_HOST,
    port: process.env.TRANSPORTER_PORT,
    secure: true,
    auth: {
        user: process.env.TRANSPORTER_AUTH_USER,
        pass: process.env.TRANSPORTER_AUTH_PASS, 
    },
    tls:{
        rejectUnauthorized:false
    }
});

module.exports = Transporter;