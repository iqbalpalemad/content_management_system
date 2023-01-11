const express                          = require('express');
const mongoose                         = require('mongoose');
const ContentEvent                     = require('../../model/ContentEvent')
const AccountEvent                     = require('../../model/AccountEvent')
const {userAuth}                       = require('../../middleware/userAuth');
const {eventValidation }               = require('../../validation/eventValidation')
const router                           = express.Router();


router.post('/unique',async (req,res) => {
    const { error , value } =  eventValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        return res.status(400).json({result : false, message : errorMessage});
    }
    try{
        var queryOptions = {eventOn : 
                                    { 
                                        $gte : new Date(req.body.startTime),
                                        $lte : new Date(req.body.endTime)
                                    }
                                
                            }; 
        
        const documentEvents  = await ContentEvent.aggregate(
            [
                { $match : queryOptions },
                { $group : {
                            
                            _id : '$event',
                            count : { $sum: 1 },
                            userId : { $addToSet: "$userId" } 
                            }
                }
            ]
        );
        var return_object = {"result":true,"view":0,"share":0,"delete":0,"update":0,"create":0,"signup":0,"login":0};
        documentEvents.forEach(element => {
            return_object[element._id] = element.userId.length;
        });

        const accountEvents  = await AccountEvent.aggregate(
            [
                { $match : queryOptions },
                { $group : {
                            
                            _id : '$event',
                            userId : { $addToSet: "$userId" } 
                            }
                }
            ]
        );
        console.log(accountEvents)
        accountEvents.forEach(element => {
            return_object[element._id] = element.userId.length;
        });




        

        return res.json(return_object);
    }catch(err){
        return res.json({result : false, message : err.message});
    }

     
    
})

module.exports = router;