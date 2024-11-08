const User = require("../Models/User");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

dotenv.config();


const createUser = async (req, res) => {
    const { username, email, password, Bio , ProfilePicture } = req.body;
    try {
        const userExist = await User.findOne({ $or: [{ username }, { email }] });
        if (userExist) {
            return res.status(400).json({ error: "Username or Email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            Bio,
            ProfilePicture
        });
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({ message: "User created successfully", data: savedUser, token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const login = async (req,res)=>{
        try{
            const {email , password} = req.body;
            if(!email || !password){
                res.status(400).json({error:"Please fill all the fields"});
            }
    
            const userExist = await User.findOne({email});
            if(!userExist){
                return res.status(400).json({error:"User does not exist"});
            }
    
            const isMatch = await bcrypt.compare(password,userExist.password);
            if(!isMatch){
                return res.status(400).json({error:"Invalid credentials"});
            }
            const token = jwt.sign({id:userExist._id},process.env.JWT_SECRET,{expiresIn:"7d"});
            res.status(200).json({message:"User logged in successfully",data:userExist,token});
        }catch(err){
           
            console.log(err.message);
            res.status(500).json({error:"Internal server error"});
        }
    }

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllUsers = async (req,res)=>{
    try{
        const users = await User.find();
        if(!users){
            return res.status(404).json({message:"Users not found"});
        }
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}

const updateUser = async (req, res) => {
    console.log(req.body)
    console.log("Request Body:", req.body);  
    try {
        let updateData = { ...req.body };
        if(updateData.username === ''){
            const user = await User.findById(req.params.id);
            updateData.username = user.username;
        }
        console.log("Update Data:", updateData);
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            
            { new: true, runValidators: true }
        );
        console.log("Updated User:", updatedUser); 

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Update Error:", error.message);
        res.status(400).json({ message: error.message });
    }
};
const followUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { followUserId } = req.body;

        if (userId === followUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const user = await User.findById(userId);
        const followUser = await User.findById(followUserId);

        if (!user || !followUser) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.following.includes(followUserId)) {
            user.following.push(followUserId);
            await user.save();
        }

        if (!followUser.followers.includes(userId)) {
            followUser.followers.push(userId);
            await followUser.save();
        }

        res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const unFollowUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { unFollowUserId } = req.body;

        if (userId === unFollowUserId) {
            return res.status(400).json({ message: "You cannot unfollow yourself" });
        }

        const user = await User.findById(userId);
        const unFollowUser = await User.findById(unFollowUserId);

        if (!user || !unFollowUser) {
            return res.status(404).json({ message: "User(s) not found" });
        }

        user.following = user.following.filter(id => id.toString() !== unFollowUserId.toString());
        await user.save();

        unFollowUser.followers = unFollowUser.followers.filter(id => id.toString() !== userId.toString());
        await unFollowUser.save();

        res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFollowStates = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).populate('following', '_id');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ following: user.following.map(followed => followed._id.toString()) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    login,
    getUserById,
    createUser,
    updateUser,
    followUser,
    unFollowUser,
    getAllUsers,
    getFollowStates,
};
