const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    ProfilePicture:{
        type:String,
    
    },
    Bio:{
        type:String,
    },
    followers:[{
        type:mongoose.schema.Types.ObjectId,
        ref:"User"
    }],
    following:[{
        type:mongoose.schema.Types.ObjectId,
        ref:"User"
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;