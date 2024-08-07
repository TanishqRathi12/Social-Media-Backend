const User = require("../Models/User");
//const {cloudinary , v2 } = require("cloudinary");
//const dotenv = require("dotenv").config();


// cloudinary.config({
//     cloud_user: "divlsorxk",
//     api_key: "838881479133476",
//     api_secret: process.env.CLOUDINARY_URL,
// });


const createUser = async (req, res) => {
    const { username , Bio } = req.body;
    try {
        const newUser = new User({Bio, username, });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
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

module.exports = {
    getUserById,
    createUser,
    updateUser,
    // deleteUser,
};
