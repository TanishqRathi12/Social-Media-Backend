


const mongoose = require('mongoose');

const postSchema = new Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    caption:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    comments:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }],
    CommentAuthor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    CommentContent:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
})

const Post = mongoose.model('Post',postSchema);

module.exports = Post;