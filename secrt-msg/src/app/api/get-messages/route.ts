import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";    
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { success } from "zod";
import mongoose from "mongoose";

export async function GET(req:Request){
    await dbConnect();

    try{
        const session = await getServerSession(authOptions);
        const user:User = session?.user as User;

        if(!session || !session.user){
            return Response.json({success:false,message:'not authenticated'},{status:401});
        }
        const userId = new mongoose.Types.ObjectId(user.id);
        const USER = await UserModel.aggregate([
            {$match:{id:userId}},
            {$unwind:'$messages'},
            {$sort:{'messages.createdAt':-1}},
            {$group:{_id:'$_id',messages:{$push:'$messages'}}},

        ])

        if(!USER || USER.length === 0 ){
            return Response.json({success:false,message:'user not found'},{status:401})
        }

        return Response.json({success:true,messages:USER[0].messages},{status:200})

    }catch(e){
        console.log("error getting messages",e);
        return Response.json({success:false,message:'server faliure at get messages'},{status:500})
    }

}
