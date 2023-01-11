const express                          = require('express');
const Content                          = require('../../model/Content')
const {userAuth}                       = require('../../middleware/userAuth');
const {contentListValidation }         = require('../../validation/contentValidation')
const router                           = express.Router();


router.get('/',userAuth, async (req,res) => {
    const { error , value } =  contentListValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        return res.status(400).json({result : false, message : errorMessage});
    }
    const page       = parseInt(req.body.page);
    const limit      = parseInt(req.body.limit);
    const skipIndex  = (page - 1) * limit;
    var queryOptions = {};
    if(req.body.owner == "Collaborator"){
        queryOptions = {permissions : {$exists: true, $all : ["Write","Read"]}}
    }
    else{
        queryOptions =   {permissions : {$exists: true, $nin : ["Write"]}}
    }
    const list = await Content.find(queryOptions)
                                .sort({ _id: 1 })
                                .limit(limit)
                                .skip(skipIndex)
                                .exec();
    return res.json({result : true, message : list});
    
})

module.exports = router;