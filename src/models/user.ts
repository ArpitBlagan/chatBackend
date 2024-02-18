import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:String,
    email:{
        type:String,
        unique:true
    },
    number:{
        type:String,
        unique:true
    },
    password:String,
    avatar_id:Number,
    createdAt:{
        type:Date,
        default:Date.now()
    },
});
export const uDB=mongoose.model('uDB',userSchema);