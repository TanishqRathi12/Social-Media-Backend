const express = require("express");
const {mongoose} = require("mongoose");
const dotenv = require("dotenv")
//const authRouter = require("./routes/AuthRoutes")
const userRouter = require("./routes/UserRoutes")
const postRouter = require("./routes/postRoutes")
const cors = require("cors");

const app = express();

app.use(cors({
    origin: 'https://social-media-front-end-gilt.vercel.app', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://social-media-front-end-gilt.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});



dotenv.config()


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));




const PORT = 5000;

app.use("/",userRouter)
app.use("/",postRouter)


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("Database connected"))
    .catch((err)=>console.log(err));
})