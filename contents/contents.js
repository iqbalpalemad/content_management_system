const express                          = require('express');
const Content                          = require('../model/Content')
const {userAuth}                       = require('../middleware/userAuth');
const {createContentValidation,
       updateContentValidation,
       contentIdValidation,
       contentShareValidation,
       contentListValidation }         = require('../validation/contentValidation')
const dotenv                           = require('dotenv');
const router                           = express.Router();

dotenv.config();


router.post('/create', userAuth, (req,res) => {
    const { error , value } =  createContentValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        res.status(400).json({result : false, message : errorMessage});
    }
    else{
        const content = new Content({
            userId : req.userId,
            title  : req.body.title,
        })

        try{
            content.save((err,result) => {
                if(err){
                    res.status(400).json({result : false, message : err.message});
                }
                else{
                    res.json({result : true, message : result._id});
                }
            })
        }
        catch(err){
            res.status(400).send(err.message);
        }
    }
})

router.post('/update',userAuth, (req,res) => {
    const { error , value } =  updateContentValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        res.status(400).json({result : false, message : errorMessage});
    }
    else{
        Content.findOne({_id : req.body.id},(err,content) => {
            if(content.deleted){
                res.status(400).json({result : false, message : "Content deleted"});
            }
            else{
                if(req.body.title){
                    content.title = req.body.title;
                }
                if(req.body.body){
                    content.body = req.body.body
                }

                content.updatedOn = Date.now();
                content.save((err,result) => {
                    if(err){
                        res.status(400).json({result : false, message : err.message});
                    }
                    else{
                        res.json({result : true, message : result._id});
                    }
                })
            }
        })
            
    }
})

router.post('/delete',userAuth,(req,res) => {
    const { error , value } =  contentIdValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        res.status(400).json({result : false, message : errorMessage});
    }
    else{
        Content.findOne({_id : req.body.id},(err,content) => {
            if(content.deleted){
                res.status(400).json({result : false, message : "Content Already deleted"});
            }
            else{
                content.deleted   = true;
                content.deletedOn = Date.now();
                content.save((err,result) => {
                    if(err){
                        res.status(400).json({result : false, message : err.message});
                    }
                    else{
                        res.json({result : true, message : "Content Deleted"});
                    }
                })
            }
        })
    }
})


router.post('/get',userAuth,(req,res) => {
    const { error , value } =  contentIdValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        res.status(400).json({result : false, message : errorMessage});
    }
    else{
        Content.findOne({_id : req.body.id},(err,content) => {
            if(content.deleted){
                res.status(400).json({result : false, message : "Content Already deleted"});
            }
            else{
                res.json({result : true, message : content});
            }
        })
    }
})

router.post('/share',userAuth,async (req,res) => {
    const { error , value } =  contentShareValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        res.status(400).json({result : false, message : errorMessage});
    }
    else{
        const content = await Content.findOne({_id : req.body.id})
        if(content.deleted){
            return res.status(400).json({result : false, message : "Content Already deleted"});
        }

        content.shared      = true;
        content.sharedWith  = req.body.sharedWith;
        content.sharedOn    = Date.now();
        content.permissions = req.body.permissions;
        const contentSave   = await content.save();
        return res.json({result : true, message : "Content Shared Successfully"});
    }
})

router.post('/all',userAuth, async (req,res) => {
    const { error , value } =  contentListValidation(req.body);
    if(error){
        errorMessage = error.details[0].message;
        res.status(400).json({result : false, message : errorMessage});
    }
    else{
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
    }
})



module.exports = router;
