const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");;
const Auth = require("../Models/Auth");;

const signUp = async (req,res)=>{
    try{
        const {user , email , password} = req.body;

        if(!user || !email || !password){
            res.status(400).json({error:"Please fill all the fields"});
        }

        const userExist = await Auth.findOne({user});
        if(userExist){
            return res.status(400).json({error:"User already exist"});
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password,saltRounds);

        const newUser = new Auth({
            user,
            email,
            password:hashedPassword,
        });

        await newUser.save();

        res.status(201).json({message:"User created successfully",newUser});
    }catch(err){
        console.log(err.message);
        res.status(500).json({error:"Internal server error"});
    }
        
}

const login = async (req,res)=>{
    try{
        const {user ,email , password} = req.body;

        if(!user || !email || !password){
            res.status(400).json({error:"Please fill all the fields"});
        }

        const userExist = await Auth.findOne({user});
        if(!userExist){
            return res.status(400).json({error:"User does not exist"});
        }

        const isMatch = await bcrypt.compare(password,userExist.password);
        if(!isMatch){
            return res.status(400).json({error:"Invalid credentials"});
        }

        const token = jwt.sign({id:userExist._id},process.env.JWT_SECRET,{expiresIn:"3d"});
        res.status(200).json({message:"User logged in successfully",data:user,token});
    }catch(err){
        console.log(err.message);
        res.status(500).json({error:"Internal server error"});
    }
}

const getUsers = async (req,res)=>{
    try{
        const users = await Auth.find({},{password:0});
        res.status(200).json({users});
    }
    catch(err){
        console.log(err.message);
        res.status(500).json({error:"Internal server error"});
    }
}

module.exports = {
    signUp,
    login,
    getUsers,
}
