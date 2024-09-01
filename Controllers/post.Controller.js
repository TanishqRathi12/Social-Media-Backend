const Post = require("../Models/Posts");
const Comment = require("../Models/comment");




const createPost = async (req, res) => {
    console.log(req.body);
    const { caption, image } = req.body;
    if ( !caption || !image) {
        return res.status(400).json({ message: 'Author, caption, and image are required.' });
    }
    
    try {
        const newPost = new Post({
            caption,
            image,
            author: req.user.id,
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



const getAllPosts = async (req, res) => {
    try {
        
        const posts = await Post.find().populate("author","username");
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("author","username");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updatePost = async (req, res) => {
    try {
        
        let updatedData = { ...req.body };
        if (req.file) {
            updatedData.image = req.file.path;  
        }
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const addLike = async (postId, userId) => {
    try {
        const post = await Post.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }

        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            post.likes = post.likes.filter(id => id.toString() !== userId);
        } else {
            post.likes.push(userId);
        }
        await post.save();

        return post;
    } catch (error) {
        throw new Error(error.message);
    }
};


const addComment = async (postId, authorId, content) => {
    try {
        const newComment = new Comment({
            post: postId,
            author: authorId,
            content: content.text,
        });
        await newComment.save();

        const post = await Post.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        post.comments.push(newComment._id);
        await post.save();

        return newComment;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getComment = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id }).populate("author", "username");
        if (comments.length === 0) {
            return res.status(404).json({ message: "No comments found for this post" });
        }
        res.status(200).json(comments);
    } catch (error) {
        
        console.error("Error fetching comments:", error.message);
        res.status(500).json({ message: error.message });
    }
};




const deletePost = async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ message: "Post not found" });
        }
        res.status(200).json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getAllPosts,
    createPost,
    getPostById,
    updatePost,
    deletePost,
    addLike,
    addComment,
    getComment,
};
