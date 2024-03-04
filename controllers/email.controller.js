const MailSender = require("../middlewares/mailsender.middleware.js");

const welcome_new_user = (async (data) =>{
    const email_template = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Signup Confirmation</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Poppins', sans-serif; background-color: #f4f4f4; padding: 20px;">
        
        <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <tr>
            <td style="padding: 20px; background-image: url('https://img.freepik.com/free-vector/colorful-confetti-background-with-text-space_1017-32374.jpg?t=st=1709576554~exp=1709580154~hmac=af18be7f82d0f35c43bf27c8b7682313354fd2ff94be7d3bc41da76babb9a6db&w=1060'); background-size: cover; background-position: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <h2 style="color: #1F1F26; text-align: center; font-size: 32px;">Welcome to Vendar</h2>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
            <p style="color: #666;">Dear ${data?.name},</p>
            <p style="color: #666;">Welcome to Vendar – your all-in-one platform for revolutionizing the way you manage your business!</p>
            <p style="color: #666;">Vendar is here to streamline your operations and connect you with the perfect solution. With our innovative platform, You can effortlessly distribute your physical shop into shelves and lease them out to online business owners. Meanwhile, online business owners can easily manage their products and showcase them in your physical locations, all without the overhead costs of maintaining a brick-and-mortar store.</p>
            <p style="color: #666;">Thank you for choosing Vendar. We're excited to embark on this journey with you!</p>
            <p style="text-align: center; margin-top: 30px;">
                <a href="https://www.yourwebsite.com/verification" style="background-color: #4E2FD7; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 30px; display: inline-block;">Confirm Email</a>
            </p>
            <p style="color: #666;">Best regards,<br>Dennis Sammy<br>Founder and CEO</p>
        
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #f0f0f0; text-align: center;">
            <p style="color: #999; font-size: 12px;">You are receiving this email because you opted in via our website.</p>
            <p style="color: #999; font-size: 12px;">&copy; 2024 Vendar. All rights reserved.</p>
            </td>
        </tr>
        </table>
        
        </body>
        </html>
    `
    const payload = {
        receipient_email: data?.email,
        subject : "Welcome to Vendar",
        text: '',
        template: email_template
    }
    await MailSender(payload).then(()=>{
        console.log('email sent')
    }).catch((err)=>{
        console.log(err)
    });
});
const signed_in_user = (async (data) =>{
    const email_template = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign-in Notification</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Poppins', sans-serif; background-color: #f4f4f4; padding: 20px;">
        
        <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <tr>
            <td style="padding: 20px; background-color: #4E2FD7; border-top-left-radius: 10px; border-top-right-radius: 10px;">
            <h2 style="color: #ffffff; text-align: center; font-size: 32px;">Sign-in Notification</h2>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
            <p style="color: #666;">Hello ${data?.name},</p>
            <p style="color: #666;">We're thrilled to confirm that you've successfully signed in to your account.</p>
            <p style="color: #666;">If you didn't initiate this sign-in, please contact us immediately.</p>
            <p style="color: #666;">Best regards,<br>Team from Vendar.</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #f0f0f0; text-align: center;">
            <p style="color: #999; font-size: 12px;">You are receiving this email as a confirmation of your sign-in to our platform.</p>
            <p style="color: #999; font-size: 12px;">&copy; 2024 [Your Company Name]. All rights reserved.</p>
            </td>
        </tr>
        </table>
        
        </body>
        </html>    
    `
    const payload = {
        receipient_email: data?.email,
        subject : "Sign-in Notification",
        text: '',
        template: email_template
    }
    await MailSender(payload).then(()=>{
        console.log('email sent')
    }).catch((err)=>{
        console.log(err)
    });
});
const verify_user = (async (data) =>{
    const email_template = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
        </head>
        <body style="font-family: 'Poppins', sans-serif; background-color: #f4f4f4; padding: 20px;">
        
        <table cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <tr>
            <td style="padding: 20px; text-align: center;">
            <img src="https://img.freepik.com/free-vector/envelope-concept-illustration_114360-6756.jpg?t=st=1709580466~exp=1709584066~hmac=1900fbf982f28652165432d3392c0de6729232a4e8078616829c2b19b5e27daa&w=740" alt="Banner" style="height:300px; width: 300px; border-top-left-radius: 10px; border-top-right-radius: 10px; display: block; margin: 0 auto;">
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
            <p style="color: #666;">Dear ${data?.name},</p>
            <p style="color: #666;">Thank you for signing up with Vendar! To complete your registration, please verify your email address by clicking the button below:</p>
            <p style="text-align: center; margin-top: 30px;">
                <a href="https://www.yourwebsite.com/verify_email" style="background-color: #4E2FD7; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 30px; display: inline-block;">Verify Email</a>
            </p>
            <p style="color: #666;">If the above button does not work, you can also copy and paste the following link into your browser:</p>
            <p style="color: #666; text-align: center;">https://www.yourwebsite.com/verify_email</p>
            <p style="color: #666;">This link will expire in 24 hours for security reasons. If you did not sign up for our service, you can safely ignore this email.</p>
            <p style="color: #666;">Best regards,<br>Team from Vendar</p>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px; background-color: #f0f0f0; text-align: center;">
            <p style="color: #999; font-size: 12px;">You are receiving this email because you signed up for an account on our website.</p>
            <p style="color: #999; font-size: 12px;">&copy; 2024 Vendar. All rights reserved.</p>
            </td>
        </tr>
        </table>
        
        </body>
        </html>
    `
    const payload = {
        receipient_email: data?.email,
        subject : "Email Verification Notification",
        text: '',
        template: email_template
    }
    await MailSender(payload).then(()=>{
        console.log('email sent')
    }).catch((err)=>{
        console.log(err)
    });
});

module.exports = {
    welcome_new_user,
    signed_in_user,
    verify_user
}