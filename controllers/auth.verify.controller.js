const {ExistingUser} = require('../middlewares/existinguser.middleware.js');
const logger = require('../lib/logger.lib.js');
const { AccountStatus } = require('../models/ClientSchema.js');
const { verify_user } = require('./email.controller.js');

const Verify_User=(async(req,res)=>{
    const email = req.params.email;
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
    try{
        if (!email){
            return res.status(403).send({error:true,message:'Missing details'});
        }
        const result = await ExistingUser(email);
        verify_user(result)
        if (!result){
            return res.status(200).send({error:true,message:'This Email does not have an existing account, try signing up'});
        }
        if (result?.account_status_ref?.email_status){
            return res.status(200).send({error:true,message:'This email has already been verified. thank you for trying.'});
        }

        const updateAccountStatus = {
            email_status:   true
        }
        const uid = result?._id;
        await AccountStatus.updateOne({client_ref: uid},updateAccountStatus).then(()=>{
            logger.log('info',`${ip} - ${result?.name} signed in`);
            return res.status(200).json({error:null,message:'Account verified successfully'});
        });
    }catch(err){
        logger.log('error',`${ip} - System Error`)
        return res.sendStatus(500);
    }
});

const Verified_User=(async(req,res)=>{
    let ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(",")[0];
    const html_template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verified</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Poppins', sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
        margin: 0;
      }
    
      .container {
        max-width: 600px;
        margin: auto;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        padding: 40px;
        text-align: center;
      }
    
      h2 {
        color: #1F1F26;
        font-size: 32px;
        margin-bottom: 20px;
      }
    
      p {
        color: #666;
        margin-bottom: 20px;
        font-size: 18px;
      }
    
      .image-container {
        margin-bottom: 40px;
      }
    
      .svg-container {
        width: 150px;
        height: auto;
        margin: 0 auto;
      }
    
      .button {
        background-color: #007bff;
        color: #fff;
        text-decoration: none;
        padding: 12px 30px;
        border-radius: 5px;
        display: inline-block;
        transition: background-color 0.3s ease;
      }
    
      .button:hover {
        background-color: #0056b3;
      }
    </style>
    </head>
    <body>
    
    <div class="container">
      <div class="image-container">
        <img src="https://img.freepik.com/free-photo/beautiful-glittery-new-year-concept_23-2148703462.jpg?w=740&t=st=1709840843~exp=1709841443~hmac=76b458c42900ab73aab1989b48d50ca264d267a58fa497748991520bf6d49cfe" alt="Logo" class="svg-container">
      </div>
      <h2>Account Verified</h2>
      <p>Your account has been successfully verified.</p>
      <p>You can now access all features of our platform.</p>
      <a href="https://www.example.com/my-profile" class="button">Take me to my profile</a>
    </div>
    
    </body>
    </html>    
    `
    const error_template = `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>User Not Found</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
<style>
  body {
    font-family: 'Poppins', sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
    margin: 0;
  }

  .container {
    max-width: 600px;
    margin: auto;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
    padding: 40px;
    text-align: center;
  }

  h2 {
    color: #1F1F26;
    font-size: 32px;
    margin-bottom: 20px;
  }

  p {
    color: #666;
    margin-bottom: 20px;
    font-size: 18px;
  }

  .image-container {
    margin-bottom: 40px;
  }

  .svg-container {
    width: 150px;
    height: auto;
    margin: 0 auto;
  }
</style>
</head>
<body>

<div class="container">
  <div class="image-container">
    <img src="https://img.freepik.com/free-vector/404-error-with-tired-person-concept-illustration_114360-7899.jpg?t=st=1709842865~exp=1709846465~hmac=5abe2064ff5de49c0be56be61239617fc9b5da9fc052bc61c036363273e7cda1&w=740" alt="Logo" class="svg-container">
  </div>
  <h2>User Not Found</h2>
  <p>We couldn't find an account associated with the provided email address.</p>
  <p>Please make sure you've entered the correct email address or <a href="https://vendar.shop/auth/signup">sign up</a> if you're new to our platform.</p>
</div>

</body>
</html>

    `
    const email = req?.params?.email;
    const result = await ExistingUser(email);
    if (!result){
        return res.status(200).send(error_template)
    }
    try {
        if (result?.account_status_ref?.email_status){
            return res.status(200).send(html_template);
        }else{
            const updateAccountStatus = {
                email_status:   true
            }
            const uid = result?._id;
            await AccountStatus.updateOne({client_ref: uid},updateAccountStatus).then(()=>{
                logger.log('info',`${ip} - ${result?.name} has been verified`);
                return res.status(200).send(html_template);
            });
        };
    } catch (error) {
        logger.log('error',`${ip} - System Error`)
        return res.sendStatus(500);
    }
})
module.exports = {Verify_User,Verified_User};