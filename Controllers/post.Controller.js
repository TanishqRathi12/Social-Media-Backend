const Post = require("../Models/Posts");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const Comment = require("../Models/comment");


cloudinary.config({
    cloud_name: "divlsorxk",
    api_key: "838881479133476",
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "posts",  
        allowed_formats: ["jpg", "png", "jpeg"],
        public_id: (req, file) => file.originalname.split(".")[0],
    },
});

const upload = multer({ storage: storage });


const createPost = async (req, res) => {
    const { author, caption ,image } = req.body;
     try {
        // let image = null;
        // if (req.file) {
        //     image = req.file.path;  
        // }
        const newPost = new Post({ author, caption, image });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
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
            content: content,
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
    createPost: [upload.single("image"), createPost],
    getPostById,
    updatePost: [upload.single("image"), updatePost],
    deletePost,
    addLike,
    addComment,
};
