const mongoose = require('mongoose');
const URI = 'mongodb://localhost:27017/onlinevotingdb';

const connectToMongo = ()=>{
    mongoose.connect(URI, ()=>{
        console.log("Successfully Connected to mongoose");
    })
}

module.exports = connectToMongo;