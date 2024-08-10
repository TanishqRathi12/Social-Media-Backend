const verifyToken = require("../middleware/Auth.middleware")
const userController = require("../Controllers/user.Controller")
const {Router} = require("express")

const userRouter = Router();

userRouter.post("/createUser",userController.createUser)
userRouter.get("/getUserById/:id",verifyToken,userController.getUserById)
userRouter.put("/updateUser/:id",verifyToken,userController.updateUser)
// userRouter.delete("/deleteUser/:id", verifyToken, userController.deleteUser)
userRouter.post('/follow', verifyToken, userController.followUser);
userRouter.post('/unFollow', verifyToken, userController.unFollowUser);



module.exports = userRouter;