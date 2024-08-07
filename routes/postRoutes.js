const verifyToken = require("../middleware/Auth.middleware")
const postController = require("../Controllers/post.Controller")
const {Router} = require("express")

const postRouter = Router();

postRouter.post("/createPost",verifyToken,postController.createPost);

postRouter.get("/getPostById/:id",verifyToken,postController.getPostById);

postRouter.patch("/updatePost/:id",verifyToken,postController.updatePost);

postRouter.delete("/deletePost/:id",verifyToken,postController.deletePost);

module.exports = postRouter;

