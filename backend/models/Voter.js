const mongoose = require('mongoose');
const { Schema } = mongoose;


const voterSchema = new Schema({
    name : {
        type : String,
        isRequired : true
    },
    email : {
        type : String,
        isRequired : true
    },
    password : {
        type : String,
        isRequired : true
    },
    userId : {
        type : Number,
        isRequired : true
    },
    elections : Object
});

module.exports = mongoose.model('voterSchema', voterSchema);