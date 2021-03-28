const express                        = require('express');
const {forgotPasswordValidation }    = require('../../validation/userValidation')
const {sendEmail}                    = require("../../email/email")
const {addAccountEvent}              = require('../eventHandler');
const router                         = express.Router();


router.post('/forgotPassword',async (req,res) => {
    const { error , value } =  forgotPasswordValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        res.status(400).json({result : false, message : errorMessage});
    }
    else{
        var emailBody = "<html>\
                        <h3><a>Click Here to Reset Your password</a></h3>\
                    </html>"
        var emailSend = await  sendEmail('Password Reset <reset@samples.mailgun.org>',req.body.email,"Password Reset","",emailBody);
        if(emailSend){
            const saveEvent   = await addAccountEvent("forgotpassword");
            res.json({result : true, message : "Email sent Successfully"});
        }
        else{
            res.status(400).json({result : false, message : "email send failed"});
        }
    }

})


module.exports = router;