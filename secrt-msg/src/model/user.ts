import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerifyed:boolean,
    isAcceptingMsg:boolean,
    messages:Message[]
}

const userSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,"email is required"],
        trim:true,
        unique:true,
        match:[/^[^\s@]+@[^\s@]+\.[^\s@]+$/,"please enter a valid email"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        trim:true,
        unique:true,
    },
    verifyCode:{
        type:String,
        required:[true,"verifyCode is required"],
        trim:true,
        unique:true,
    },
     verifyCodeExpiry:{
        type:Date,
        required:[true,"verifyCodeExpiry is required"],
        trim:true,
        unique:true,
    },
    isVerifyed:{
        type:Boolean,
        default:false,
    },
    isAcceptingMsg:{
        type:Boolean,
        default:true
    },
    messages:[messageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || (mongoose.model<User>("User",userSchema))

export default UserModel;