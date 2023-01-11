const express                       = require('express');
const User                          = require('../../model/User')
const {addAccountEvent}             = require('../eventHandler');
const router                        = express.Router();

router.post('/verify/:uuid',async (req,res) => {
    uuid = req.params.uuid;
    try{
        const updateVerified = await User.updateOne({uuid : uuid},{emailVerified:true});
        if(updateVerified.nModified == 0){
            return res.json({result : false, message : "Invalid URL"});
        }
        else{
            const saveEvent   = await addAccountEvent("verify");
            return res.json({result : true, message : "Email address verified"});
        }
    }catch(err){
        return res.status(400).json({result : false, message : err.message});
    }
 
})


module.exports = router;