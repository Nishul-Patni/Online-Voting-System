const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Authority = require('../models/Authority');
const Voter = require('../models/Voter');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../../Mern/React/inotebook/backend/models/User');
const fetchUser = require('../middleware/fetchUser');
const JWT_SECRET = "KISIkoMtbaTAna";

const dbMap = require('../dbCreator');

// 1. Authority signup
router.post('/signup/authority',
    body("name", "Name length should be at least 5 in length").isLength({min : 5}),
    body('email', 'Not a Valid Email').isEmail(),
    body('password', 'Password is too short').isLength({min : 8}),
    body('password', 'weak password').isStrongPassword(),
    body('description', 'Description length should be at least 10 in length').isLength({min : 10}),
    async(req, res)=>{
        // validating signup details
        const errors = validationResult(req);
        let status = true;
        if(!errors.isEmpty()){

            // errors =  [{value, msg, param:'email'}, ....]
            status = false;
            res.status(400).json({status, error : errors});
            return;
        }

        let {name, description, email, password} = req.body;
        let elections = new Array();
        try{
            
            // if authority with this email exist
            let authority = await Authority.findOne({email:email});
            if(authority){
                status = false;
                res.status(400).json({status, error : 'Authority with this email already exist'});;
                return;
            }
            
            // creating hash of password for security
            const salt = await bcrypt.genSalt(10);
            let securePassword = await bcrypt.hash(password, salt);
            
            //creating sample elections just for testing after testing remove them
            // elections.push("1");
            // elections.push("2");

            // creating authority/
            authority = await Authority.create({
                name : name,
                email : email,
                password : securePassword,
                description : description,
                elections : elections
            });

            authority = await Authority.findOne({email:email});
            authority.password = null;
            let data = {
                authority : authority
            }
            let authToken = jwt.sign(data, JWT_SECRET);
            res.json({status, authToken, data});
        }catch(err){
            console.log(err);
            res.json(err);
        }
})

// 2. Authority login using email password
router.post('/login/authority',[
    body('email').isEmail(),
    body('password').exists()
],async (req, res)=>{
    let errors = validationResult(req);
    let status = true;
    if(!errors.isEmpty()){
        status = false;
        res.status(400).json({status, error:errors});
        return;
    }
    
    try{
        let {email, password} = req.body;
        console.log(email, password);
        let authority = await Authority.findOne({email});

        if(!authority){
            status  = false;
            res.status(400).json({status, error : 'Email or Password may be wrong'});
            return;
        }

        let isCorrectPassword = await bcrypt.compare(password, authority.password);
        console.log(isCorrectPassword);
        authority.password = null;
        if(isCorrectPassword){
            let data = {
                authority : authority
            };
            let authToken = jwt.sign(data, JWT_SECRET);
            res.json({status, authToken, data});
        }else{
            status = false;
            res.status(400).json({status, error:'Email or password may be wrong'});
        }
    }catch(err){
        status = false;
        console.log(err);
        res.status(500).json({status, error: err});
    }
});

// login using token
router.get('/getAuthority', fetchUser, async(req, res)=>{
    try{
        console.log(req.data);
        res.json({status: true, data:req.data});
    }catch(err){
        console.log(err);
        res.status(500).json({status : false, error:err})
    }
})

// 1. Voter singnup
router.post('/signup/voter',
body("name", "Name length should be at least 5 in length").isLength({min : 5}),
body('email', 'Not a Valid Email').isEmail(),
body('password', 'Password is too short').isLength({min : 8}),
body('password', 'weak password').isStrongPassword(),
async (req, res)=>{
    const errors = validationResult(req);
    let status = true;
    if(!errors.isEmpty()){

        // errors =  [{value, msg, param:'email'}, ....]
        status = false;
        res.status(400).json({status, error:errors});
        return;
    }

    let {name, email, password, userId} = req.body;
    userId = +userId;
    // creating dummy elections for testing
    let elections = new Array();

    console.log(Voter,Authority);
    try{
        if(dbMap.get(userId)!=email){
            console.log(dbMap.get(userId), dbMap, typeof(userId));
            res.status(400).json({status: false, error : "User Id is wrong"});
            return;
        }
        let voter = await Voter.findOne({email:email})
        if(voter){
            status = false;
            res.status(400).json({status : status, error: "User already exist with this email"});
            return;
        }

        const salt = await bcrypt.genSalt(10);
        let securePass = await bcrypt.hash(password, salt);
       
        // sample elections for testing
        // elections.push("e1");
        // elections.push("e2");
        voter = await Voter.create({
            name : name,
            password : securePass,
            email : email,
            elections : elections,
            userId : userId
        });

        voter = await Voter.findOne({email : email});
        voter.password = null;
        let data = {
            voter: voter
        }

        let authToken = jwt.sign(data, JWT_SECRET);
        res.json({authToken, status, data});
    }catch(err){
        console.log(err);
        res.json({error:"Opps! Something went wrong"});
    }
});

router.post('/login/voter', [
    body('email').isEmail(),
    body('password').exists()
], async (req, res)=>{
    // console.log*
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({error:errors});
        return;
    }

    try{
        let {email, password} = req.body;

        let voter = await Voter.findOne({email:email});

        if(!voter){
            res.status(400).json({status: false, error: "Email or Passwor may be wrong"});
            return;
        }

        let isCorrectPass = await bcrypt.compare(password, voter.password);
        voter.password = null;
        if(isCorrectPass){
            let data = {
                voter : voter
            }
            console.log(data);
            let authToken = jwt.sign(data, JWT_SECRET);
            console.log(authToken);
            res.json({status:true, authToken, data});
        }else{
            res.status(400).json({status: false, error: "Email or Password may be wrong"})
        }
    }catch(err){
        console.log(err);
        res.json({status:false, error: "Opps! something went wrong"});
    }
});

router.get('/getVoter', fetchUser, async(req, res)=>{
    try{
        res.json({status: true, data:req.data});
    }catch(err){
        console.log(err);
        res.status(500).json({status : false, error:err})
    }
});

module.exports = router;