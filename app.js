const express = require("express");
const {mongoose} = require("mongoose");
const dotenv = require("dotenv")
const userRouter = require("./routes/UserRoutes")
const postRouter = require("./routes/postRoutes")
const cors = require("cors");

const app = express();

// const corsOptions = {
//     origin: 'https://social-media-front-end-seven.vercel.app',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true,
//     optionsSuccessStatus: 200
// }

// app.use(cors(corsOptions));

app.use(cors(
    {
        origin: "http://localhost:3000",
        credentials: true,
    }
));





dotenv.config()


app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));






app.use("/",userRouter)
app.use("/",postRouter)


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>console.log("Database connected"))
    .catch((err)=>console.log(err));
})