//all needed imports
import { WebSocket } from "ws";
import { findUser , updateChat } from "../controllers/user";
//all the needed interfaces
export interface user{
    number:string;
    socket:WebSocket;
}

export interface message{
    from:string;
    message:string;
}
// class logic below
export class userManager{
    private users:user[]
    constructor(){
        this.users=[]
    }
    addUser(number:string,socket:WebSocket){
        this.users.push({number,socket});
        console.log(this.users);
    }
    removeUser(ws:WebSocket){
        this.users=this.users.filter((ele)=>{
            return ele.socket!=ws
        });
        console.log(this.users);
    }
    async handleTyping(from:string,to:string){
        const data=JSON.stringify({
            from,type:"notification",message:"typing..."
        });
        console.log(from,to);
        this.users.forEach((ele,index)=>{
            if(ele.number==to){
                ele.socket.send(data);
            }
        });
        console.log("donee");
    }
    async handleMessage(from:string,to:string,socket:WebSocket,message:string){
        //put in db for both from and to
        //1> find the user to which we are sending exists or not
        console.log(from,to,message);
        const val1=await findUser(from);
        const val2=await findUser(to);
        if(!val1.present||!val2.present){return;}
        //2>if yes than store it in DB and send using websocket connection
        const val=await updateChat(from,to,message);
        if(!val){return;}
        //after that send to other user
        const data=JSON.stringify({
            from,type:"message",message
        })
        console.log(this.users.length);
        this.users.forEach((ele,index)=>{
            if(ele.number==to){
                ele.socket.send(data);
            }
        });
        console.log("send");
    }
}