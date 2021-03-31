const express                          = require('express');
const mongoose                         = require('mongoose');
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
                                        $gte : new Date(req.body.startTime),
                                        $lte : new Date(req.body.endTime)
                                    }
                                
                            };
        if(req.body.id){
            queryOptions['userId'] =  mongoose.Types.ObjectId(req.body.id);
        }   
        
        const documentEvents  = await ContentEvent.aggregate(
            [
                { $match : queryOptions },
                { $group : {
                            
                            _id : '$event',
                            count : { $sum: 1 }
                            }
                }
            ]
        );
        var return_object = {"result":true,"view":0,"share":0,"delete":0,"update":0,"create":0,"signup":0,"login":0};
        documentEvents.forEach(element => {
            return_object[element._id] = element.count;
        });

        const accountEvents  = await AccountEvent.aggregate(
            [
                { $match : queryOptions },
                { $group : {
                            
                            _id : '$event',
                            count : { $sum: 1 }
                            }
                }
            ]
        );
        accountEvents.forEach(element => {
            return_object[element._id] = element.count;
        });




        

        return res.json(return_object);
    }catch(err){
        return res.json({result : false, message : err.message});
    }

     
    
})

module.exports = router;