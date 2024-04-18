const express = require('express');
const router = express.Router();
const Voter = require('../models/Voter');
const Authority = require('../models/Authority');
const fetchUser = require('../middleware/fetchUser');
const sendEmail = require('../sendEmail');


router.get("/getElection", fetchUser, async (req, res)=>{
    try{
        let userType = req.query.type;
        if(userType == "authority"){
            let {authority} = req.data;
            let {email} = authority
            const user = await Authority.findOne({email});
            console.log(user.elections)
            // return addresses of authority elections
            res.send({status: true, elections : user.elections});
        }else if(userType == "voter"){
            let {voter} = req.data;
            console.log(voter);
            let {email} = voter;
            const user = await Voter.findOne({email});
            let {elections} = user;
            res.send({status: true, elections});
        }else{
            console.log("Something went wrong")
            res.status(500);
        }
    }catch(err){
        console.log(err);
        res.status(500).json({status: false, error: err});
    }
});

router.post("/addElection", fetchUser, async (req, res)=>{
    try{
        let {type} = req.body;
        if(type == "create"){
            let {authority} = req.data;
            let {email} = authority
            let {address} = req.body;
            const user = await Authority.findOne({email});
            let updateResponse = await user.updateOne({$push : {elections: address}});
            console.log(updateResponse, "I am here", address);
            // return addresses of authority elections
            res.send({status: true, elections : user.elections});
        }else if(type == "voter"){
            // adds voter if it Voter exists
            let {email, electionName, password} = req.body;
            const user = await Voter.findOne({email});
            console.log(user, email);
            let {address} = req.body;
            let updateResponse = await user.updateOne({$push : {elections : address}});
            let messageId = await sendEmail(email, `You Have been Registered for ${electionName} Election and your password to cast vote is ${password}\nPlease don't share this password with anyone`);
            res.send({status : true, message : "Voter Registered Successfully"});    
        }
    }catch(err){
        console.log(err);
        res.status(500).json({status: false, error: err});
    }
})

router.get('/isVoterExist', fetchUser, async(req, res)=>{
    let email = req.query.email;
    const user = await Voter.findOne({email});
    if(user){
        console.log(true);
        return res.send({status:true});
    }else{
        console.log(false);
        res.status(404)
        return res.send({status: false, error:"Voter not found"});
    }
})
module.exports = router;