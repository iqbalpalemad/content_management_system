const express                          = require('express');
const ContentEvent                     = require('../../model/ContentEvent')
const {userAuth}                       = require('../../middleware/userAuth');
const {eventValidation }               = require('../../validation/eventValidation')
const router                           = express.Router();


router.post('/content/',userAuth,async (req,res) => {
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
                                    },
                            userId : req.userId,
                            
                                
                            };
        if(req.body.id){
            queryOptions['contentId'] = req.body.id;
        }
        var   createCount    = 0;
        var   viewCount      = 0;
        var   updateCount    = 0;
        var   shareCount     = 0;
        var   deleteCount    = 0;
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
            created : createCount,
            viewed : viewCount,
            updated : updateCount,
            shared : shareCount,
            deleted : deleteCount});
    }catch(err){
        return res.json({result : false, message : err.message});
    }

     
    
})

module.exports = router;
