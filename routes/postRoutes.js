const verifyToken = require("../middleware/Auth.middleware")
const postController = require("../Controllers/post.Controller")
const {Router} = require("express")

const postRouter = Router();

postRouter.post("/createPost",verifyToken, postController.createPost);

postRouter.get("/posts",postController.getAllPosts);

postRouter.get("/getPostById/:id",verifyToken,postController.getPostById);

postRouter.patch("/updatePost/:id",verifyToken,postController.updatePost);

postRouter.delete("/deletePost/:id",verifyToken,postController.deletePost);


postRouter.post("/posts/:id/like",verifyToken,  async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        const updatedPost = await postController.addLike(postId, userId);
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

postRouter.post("/posts/:id/comment", verifyToken, async (req, res) => {
    try {
        const { content } = req.body;
        const userId = req.user.id;
        const postId = req.params.id;
        const newComment = await postController.addComment(postId, userId, content);
        res.status(201).json(newComment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = postRouter;

