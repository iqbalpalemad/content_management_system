const mongoose = require('mongoose');

const contetEventSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    contentId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    event : {
        type : String,
        required : true,
        min : 1,
        max : 1024
    },
    eventOn : {
        type    : Date,
        default : Date.now
    }

})

module.exports = mongoose.model('ContentEvent',contetEventSchema);