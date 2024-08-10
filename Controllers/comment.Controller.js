// const Comment = require('../Models/comment');
// const Post = require('../Models/Post');
// const User = require('../Models/User');

// const createComment = async (req, res) => {
//     const { postId, authorId, content } = req.body;

//     try {
 
//         const post = await Post.findById(postId);
//         if (!post) {
//             return res.status(404).json({ message: "Post not found" });
//         }

     
//         const author = await User.findById(authorId);
//         if (!author) {
//             return res.status(404).json({ message: "Author not found" });
//         }

   
//         const newComment = new Comment({
//             post: postId,
//             author: authorId,
//             content: content,
//         });

//         const savedComment = await newComment.save();

     
//         post.comments.push(savedComment._id);
//         await post.save();

//         res.status(201).json(savedComment);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// const updateComment = async (req, res) => {
//     const { content } = req.body;

//     try {
//         const updatedComment = await Comment.findByIdAndUpdate(
//             req.params.id,
//             { content },
//             { new: true } 
//         );

//         if (!updatedComment) {
//             return res.status(404).json({ message: "Comment not found" });
//         }

//         res.status(200).json(updatedComment);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };

// const deleteComment = async (req, res) => {
//     try {
       
//         const comment = await Comment.findByIdAndDelete(req.params.id);

//         if (!comment) {
//             return res.status(404).json({ message: "Comment not found" });
//         }

       
//         const post = await Post.findById(comment.post);
//         if (post) {
//             post.comments.pull(comment._id);
//             await post.save();
//         }

//         res.status(200).json({ message: "Comment deleted successfully" });
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// };


// module.exports = {
//     createComment,
//     updateComment,
//     deleteComment,
// }

