//all need imports
import express , { Request } from 'express';
import cors from 'cors';
import http from 'http';
import cookieParser from 'cookie-parser';
import { WebSocket, WebSocketServer } from 'ws';
import mongoose from 'mongoose';
import Router from './router';
import url from 'url';
import { userManager } from './managers/user';
require('dotenv').config();
//connection to DB
var URL="";
if(process.env.URL){
    URL=process.env.URL;
}
mongoose.connect(URL).then(()=>{
    console.log("connected to DB");
})
//creating an app out of express
const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:['*','http://localhost:5173','https://chat-frontend-plum.vercel.app'],
    credentials:true
}));
app.use(Router);
//creating instances of class that we need to implement the functionality
const users=new userManager();
const server=http.createServer(app);
//creating ws server
const wss=new WebSocketServer({server});
wss.on('connection',(ws:WebSocket,req:Request)=>{
    console.log('connected..');
    const uri=url.parse(req.url,true);
    var {number}=uri.query;console.log(number);
    if(number){users.addUser(number.toString(),ws);}
    ws.on('message',(message:any)=>{
        const data=JSON.parse(message);
        if(data.type=="text"){
            users.handleMessage(data.from,data.to,ws,data.message)
        }
        else if(data.type=="typing"){
            users.handleTyping(data.from,data.to);
        }
    })
    ws.on('close',()=>{
        console.log("connection closed");
        users.removeUser(ws);
    })
});
//listening to port
server.listen(process.env.PORT,()=>{console.log(`listening on port ${process.env.PORT}`)})