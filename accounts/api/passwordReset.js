const express                       = require('express');
const bcrypt                        = require('bcryptjs');
const User                          = require('../../model/User')
const {passwordResetValidation }    = require('../../validation/userValidation')
const {userAuth}                    = require('../../middleware/userAuth');
const {addAccountEvent}             = require('../eventHandler');
const router                        = express.Router();


router.post('/passwordReset',userAuth, async (req,res) => {
    const { error , value } =  passwordResetValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        res.status(400).json({result : false, message : errorMessage});
    }
    else{
        
        const salt              = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(req.body.password, salt);

        const updatePassword    = await User.updateOne({_id : req.body.id},{password:encryptedPassword,passwordUpdatedOn:Date.now()});
        if(updatePassword.nModified == 0){
            res.json({result : false, message : "Error in update"});
        }
        else{
            const saveEvent   = await addAccountEvent("passwordreset");
            res.json({result : true, message : "Password Updated Successfully"});
        }
    }
})


module.exports = router;