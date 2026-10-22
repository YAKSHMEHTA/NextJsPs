import { Message } from "@/model/user"

export interface apiResponse{
    success:boolean,
    message:string
    isAccepting?:boolean,
    messages?:Array<Message>,
    
}
