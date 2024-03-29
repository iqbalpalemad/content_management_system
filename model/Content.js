const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    title : {
        type : String,
        required : true,
        min : 1,
        max : 1024
    },
    body : {
        type : String
    },
    createdOn : {
        type    : Date,
        default : Date.now
    },
    updatedOn: {
        type    : Date
    },
    deleted : {
        type : Boolean ,
        default : false
    },
    deletedOn : {
        type    : Date
    },
    shared : {
        type : Boolean ,
        default : false
    },
    sharedWith : {
        type: String
    },
    sharedOn : {
        type    : Date
    },
    permissions : {
        type    : [String]
    }
});

module.exports = mongoose.model('Content',contentSchema);