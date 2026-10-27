import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";    
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";


export async function POST(req:Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;
    if(!session || ! session.user){
        return Response.json({success:false,message:'error verifying user'},{status:401});
    } 

    const userId = user.id;
    const {acceptingMsg} = await req.json();
    try {
        const user = await UserModel.findByIdAndUpdate(userId,{isAcceptingMsg:acceptingMsg},{new:true});
        if(!user){
            return Response.json({success:false,message:'failed to update user'},{status:401});
        }
        return Response.json({success:true,message:'user updated'},{status:401});

    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:'error on the backend'},{status:500});
    }    


}

export async function GET(req:Request){
    await dbConnect();
    const session = await getServerSession(authOptions);
    const user:User = session?.user as User;
    if(!session || ! session.user){
        return Response.json({success:false,message:'error verifying user'},{status:401});
    } 
    const userId = user.id;

    try {
        const user = await UserModel.findOne({_id:userId});
        
        if(!user){
            return Response.json({success:false,message:'failed to found user'},{status:401});
        }
        const acceptingMsg = user.isAcceptingMsg;
        return Response.json({success:true,isAcceptingMsg:acceptingMsg,message:""},{status:200});

    } catch (error) {
        console.log(error);
        return Response.json({success:false,message:'error on the backend'},{status:500});
    }   

}
