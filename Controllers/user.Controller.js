const User = require("../Models/User");
const cloudinary = require('cloudinary').v2;
const multer = require("multer");
const dotenv = require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const jwt = require("jsonwebtoken");;



cloudinary.config({
    cloud_name: "divlsorxk",
    api_key: "838881479133476",
    api_secret: process.env.CLOUDINARY_URL,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profile-Images",
        format: async (req, file) => ["jpg", "png", "jpeg"],
        public_id: (req, file) => file.originalname.split(".")[0],
    },
});

const upload = multer({ storage: storage });




const createUser = async (req, res) => {
    const { username , Bio , ProfilePicture } = req.body;
     try {
        // let image = null;
        // if(req,res){
        //     image = req.file.path;
        // }  
        const userExist = await User.findOne({username});
        if(userExist){
            return res.status(400).json({error:"User already exist"});
        }
        const newUser = new User({Bio,username,ProfilePicture});//:image 
        const savedUser = await newUser.save();
        const token = jwt.sign({id:savedUser._id},process.env.JWT_SECRET,{expiresIn:"3d"});
        res.status(200).json({message:"User logged in successfully",data:savedUser,token});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


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



const updateUser = async (req, res) => {
    try {
        let updateImage = {...req.body};
        if(req.file){
            updateImage.ProfilePicture = req.file.path;
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// const deleteUser = async (req, res) => {
//     try {
//         const deletedUser = await User.findByIdAndDelete(req.params.id);
//         if (!deletedUser) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         res.status(200).json({ message: "User deleted successfully" });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };


const followUser = async (req, res) => {
    
    try {
        const userId  = req.user.id; 
        const { followUserId } = req.body; 
        console.log(userId)
        console.log(followUserId)
       
        if (userId === followUserId) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const user = await User.findById(userId);
       const followUser = await User.findById(followUserId );
    //    console.log(followUser)
    //    console.log(user)

        if (!user || !followUser) {
            return res.status(404).json({ message: "User(s) not found" });
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
        const  userId  = req.user.id; 
        const { unFollowUserId } = req.body; 
        console.log(userId)
        console.log(unFollowUserId)

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

module.exports = {
    getUserById,
    createUser:[upload.single("ProfilePicture"),createUser],
    updateUser:[upload.single("ProfilePicture"),updateUser],
    followUser,
    unFollowUser,
    // deleteUser,
};
