const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email : {
        type : String,
        required : true,
        min : 6,
        max : 255
    },
    password : {
        type : String,
        required : true,
        min : 6,
        max : 1024
    },
    passwordUpdatedOn : {
        type    : Date
    },
    date : {
        type    : Date,
        default : Date.now
    },
    uuid : {
        type : String,
        required : true,
        max : 40,
        min : 30
    },
    emailVerified : {
        type : Boolean ,
        default : false
    }
});

module.exports = mongoose.model('User',userSchema);