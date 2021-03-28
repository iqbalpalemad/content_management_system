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

        queryOptions['event'] = "create"; 
        const createCount = await ContentEvent.countDocuments(queryOptions);

        queryOptions['event'] = "view"; 
        const viewCount = await ContentEvent.countDocuments(queryOptions);

        queryOptions['event'] = "update"; 
        const updateCount = await ContentEvent.countDocuments(queryOptions);

        queryOptions['event'] = "share"; 
        const shareCount = await ContentEvent.countDocuments(queryOptions);

        queryOptions['event'] = "delete"; 
        const deleteCount = await ContentEvent.countDocuments(queryOptions);
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
