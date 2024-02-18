import mongoose from "mongoose";
const messsageSchema=new mongoose.Schema({
    text:String,
    number:String,
    createdAt:{
        type:Date,default:Date.now()
    }
})
const chatSchema=new mongoose.Schema({
    number1:String,
    number2:String,
    messages:[messsageSchema]
});
export const cDB=mongoose.model('cDB',chatSchema);