const express                          = require('express');
const AccountEvent                     = require('../../model/AccountEvent')
const ContentEvent                     = require('../../model/ContentEvent')
const {eventValidation }               = require('../../validation/eventValidation')
const router                           = express.Router();


router.post('/',async (req,res) => {
    const { error , value } =  eventValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        return res.status(400).json({result : false, message : errorMessage});
    }
    try{
        var queryOptions = {eventOn : 
                                    { 
                                        $gte : req.body.startTime,
                                        $lte : req.body.endTime
                                    }
                                
                            };
        if(req.body.id){
            queryOptions['userId'] = req.body.id;
        }                            
        var   signupCount    = 0;
        var   loginCount     = 0;
        var   createCount    = 0;
        var   viewCount      = 0;
        var   updateCount    = 0;
        var   shareCount     = 0;
        var   deleteCount    = 0;
        const accountEvents  = await AccountEvent.find(queryOptions);

        accountEvents.forEach(element => {
            switch (element.event) {
                case "signup":
                    signupCount++;
                    break;
                case "login":
                    loginCount++;
                    break;
            }
        });
        const documentEvents  = await ContentEvent.find(queryOptions);
        documentEvents.forEach(element => {
            switch (element.event) {
                case "create":
                    createCount++;
                    break;
                case "view":
                    viewCount++;
                    break;
                case "update":
                    updateCount++;
                    break;
                case "share":
                    shareCount++;
                    break;
                case "delete":
                    deleteCount++;
                    break;
            }
        });

        return res.json({result : true, 
                            signup : signupCount,
                            login : loginCount, 
                            created : createCount,
                            viewed : viewCount,
                            updated : updateCount,
                            shared : shareCount,
                            deleted : deleteCount
                        });
    }catch(err){
        return res.json({result : false, message : err.message});
    }

     
    
})

module.exports = router;