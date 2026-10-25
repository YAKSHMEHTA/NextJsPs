import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { usernameValidation } from "@/schemas/signupSchema";
import { success } from "zod";

export async function POST(req:Request){
    await dbConnect();

    try{
        const {searchParams} = new URL(req.url);
        const {username,code} = await req.json();
        const parsed = usernameValidation.safeParse(username);
        console.log(parsed)
        const user = await UserModel.findOne({username:parsed.data});
        if(!user){
            return Response.json({success:'true',message:'no user found with the username'});
        }
        const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date(Date.now()) ? true : false;
        if(isCodeExpired){
            return Response.json({success:'true',message:'code expired try again '});
        }
        const validCode = user.verifyCode;
        if(code != validCode){
            return Response.json({success:'true',message:'invalid code'});
        }
        return Response.json({success:'true',message:'code correct'});

    }catch(err){
        console.log('error on /verify-code',err);
    }

}
