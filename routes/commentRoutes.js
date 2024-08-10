const verifyToken = require("../Middlewares/verifyToken")
const commentController = require("../Controllers/comment.Controller4")    
const {Router} = require("express")

const commentRouter = Router();

commentRouter.post("/createComment", verifyToken ,commentController.createComment)