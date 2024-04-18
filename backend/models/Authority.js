const mongoose = require('mongoose');
const {Schema} = mongoose;

const authoritySchema = new Schema({
    name :{
        type : String,
        isRequired : true
    },
    email : {
        type : String,
        isRequired : true,
        unique : true
    },
    password : {
        type : String,
        isRequired : true
    },
    description :{
        type : String,
        isRequired : true
    },
    elections : [String]
});

module.exports = mongoose.model('authoritySchema', authoritySchema);