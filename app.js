const express = require("express");
const {mongoose} = require("mongoose");
const dotenv = require("dotenv")
const authRouter = require("./routes/AuthRoutes")
const userRouter = require("./routes/UserRoutes")


const app = express();

dotenv.config()


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));



const PORT = 5000;

app.use("/",userRouter)
app.use("/auth",authRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    mongoose.connect(process.env.MONGO_URI);
})