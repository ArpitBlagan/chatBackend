import { NextFunction , Request , Response } from "express";
import jwt from 'jsonwebtoken';
export const auth=async(req:Request,res:Response,next:NextFunction)=>{
    const token=req.cookies.jwt;
    if(!token){
        return res.status(403).json({message:"unauthorized "});
    }
    var access_token="";
    if(process.env.ACCESS_TOKEN){access_token=process.env.ACCESS_TOKEN?.toString();}
    jwt.verify(token,access_token,(err:any,decoded:any)=>{
        if(err){
            return res.status(403).json({message:"unauthorized "});
        }
        req.user=decoded.user;
    });
    next();
}