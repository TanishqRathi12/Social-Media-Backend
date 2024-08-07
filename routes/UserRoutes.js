const verifyToken = require("../Middlewares/verifyToken")
const userController = require("../Controllers/user.Controller")
const {Router} = require("express")

const userRouter = Router();

userRouter.post("/createUser", verifyToken ,userController.createUser)



module.exports = userRouter