const verifyToken = require("../middleware/Auth.middleware")
const authController = require("../Controllers/Auth.Controller")
const {Router} = require("express")

const authRouter = Router();

authRouter.get("/signup",(req,res)=>{
    res.render("signup");
})

authRouter.post("/signup",authController.signUp)

authRouter.get("/login",(req,res)=>{
    res.render("login")
})

authRouter.post("/login",authController.login)

authRouter.get("/getUser",verifyToken,authController.getUsers)


module.exports = authRouter

