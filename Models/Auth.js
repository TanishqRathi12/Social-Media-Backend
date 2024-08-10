const {Schema,model} = require("mongoose")

const loginSchema = new Schema({
    user:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});

const Auth = model("login",loginSchema);

module.exports = Auth;

