const Post = require("../Models/Posts")

const createPost = async (req,res)=>{
    const {author , caption } = req.body;
    try{
        const newPost = new Post({caption,body});
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    }catch(error){
        res.status(400).json({message:error.message});
    }
}

const getPostById = async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(404).json({message:"Post not found"});
        }
        res.status(200).json(post);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}

const updatePost = async (req,res)=>{
    try{
        const updatedPost = await Post.findByIdAndUpdate
        (req.params.id,req.body,{new:true});
        if(!updatedPost){
            return res.status(404).json({message:"Post not found"});
        }
        res.status(200).json(updatedPost);
    }
    catch(error){
        res.status(400).json({message:error.message});
    }
}

const deletePost = async (req,res)=>{
    try{
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if(!deletedPost){
            return res.status(404).json({message:"Post not found"});
        }
        res.status(200).json({message:"Post deleted successfully"});
    }catch(error){
        res.status(400).json({message:error.message});
    }
}

module.exports = {
    createPost,
    getPostById,
    updatePost,
    deletePost,
}


