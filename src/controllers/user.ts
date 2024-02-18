import { uDB } from "../models/user";
import { cDB } from "../models/chat";
import { Response , Request } from "express";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const findUser=async(number:string)=>{
    const data=await uDB.findOne({number});
    if(!data){
        return {present:false,user:null};
    }
    return {present:true,user:data};
}

export const logout=async(req:Request,res:Response)=>{
    res.cookie("jwt","",{
        httpOnly:true,
        sameSite: 'none',
        secure:true
    });
    res.status(202).json({message:"done"});
}

export const loggedIn=async(req:Request,res:Response)=>{
    if(req.user){
        return res.status(200).json({
            email:req.user.email,name:req.user.name,number:req.user.number
        })
    }
    res.status(200).json({name:'',number:'',email:''});
}

export const updateChat=async(from:string,to:string,message:string)=>{
    console.log(from,to);
    if(from<to){
        const chat=await cDB.findOne({number1:from,number2:to});
        if(chat){
            const data=await cDB.findOneAndUpdate({number1:from,number2:to},{
                "$push":{
                    messages:{number:from,text:message}
                }
            },{new:true});
            if(!data){console.log("error")}
        }
        else{
            const data=await cDB.create({
                number1:from,number2:to,messages:[{number:from,text:message}]
            })
        }
    }
    else{
        const chat=await cDB.findOne({number1:to,number2:from});
        if(chat){
            const data=await cDB.findOneAndUpdate({number1:to,number2:from},{
                "$push":{
                    messages:{number:from,text:message}
                }
            },{new:true});
            if(!data){console.log("error")}
        }
        else{
            const data=await cDB.create({
                number1:to,number2:from,messages:[{number:from,text:message}]
            })
        }
    }
    return true;
}

export const register=async(req:Request,res:Response)=>{
    const {name,number,email,password}=req.body;
    const hash=await bcrypt.hash(password,10);
    const id=Math.floor(Math.random()*100)+1;
    const user=await uDB.create({name,number,email,password:hash,avatar_id:id});
    if(!user){
        return res.status(411).json({message:"invalid inputs"});
    }
    res.status(202).json({message:"registered"});
}

export const login=async(req:Request,res:Response)=>{
    const {number,password}=req.body;
    const user=await uDB.findOne({number});
    if(user&&user.password){
        const val=await bcrypt.compare(password,user.password);
        if(!val){
            return res.status(403).json({message:"invalide credentials"});
        }
        var access_token="";
    if(process.env.ACCESS_TOKEN){access_token=process.env.ACCESS_TOKEN?.toString();}
        const token=jwt.sign({
            user:{
                id:user._id,
                email:user.email,
                number:user.number,
            }
        },access_token);
        res.cookie("jwt",token,{
            httpOnly:true,
            sameSite: 'none',
            secure:true
        });
        return res.status(200).json({message:"loggedIn..",
            email:user.email,number:user.number,name:user.name,avatar_id:user.avatar_id});
    }
    res.status(403).json({message:"number is not registered"});
}

export const getAll=async(req:Request,res:Response)=>{
    try{
        const users=await uDB.find({});
        res.status(200).json(users);
    }catch(err){
        console.log(err);res.status(500).json({message:"internal server error"});
    }
}

export const getChat=async(req:Request,res:Response)=>{
    const {id1,id2}=req.params;console.log(id1,id2);
    const tt=id1.substring(1);const tt2=id2.substring(1);
    console.log(tt,tt2);
    var number1,number2;
    if(tt<tt2){
        number1=tt;number2=tt2;
    }
    else{
        number1=tt2;number2=tt;
    }
    console.log(number1,number2);
    const chat=await cDB.find({number1,number2},{messages:1});
    console.log(chat);
    if(chat){
        return res.status(200).json(chat);
    }
    res.status(404).json({message:"Not chat found"});
}

