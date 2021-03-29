const mongoose = require('mongoose');

const accountEventSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : false,
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

module.exports = mongoose.model('AccountEvent',accountEventSchema);