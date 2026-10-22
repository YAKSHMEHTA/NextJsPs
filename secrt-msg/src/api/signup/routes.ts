import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs";

import { sendMail } from "@/lib/resend";
import { success } from "zod";

export async function POST(request: Request) {
	await dbConnect();

	try {
		const { username, email, password } = await request.json();
		const usernameUsedByVerifyedUser = await UserModel.findOne({ username, isVerifyed: true });

		if (usernameUsedByVerifyedUser) {
			return Response.json({ status: 400, success: false, message: "username already taken" });
		}
		const emailAlreadyUsed = await UserModel.findOne({ email });
		const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

		if (emailAlreadyUsed) {
			if (emailAlreadyUsed.isVerifyed) {
				Response.json({ status: 400, success: false, message: "user already exists" });
			} else {
				const hashedPassword = await bcrypt.hash(password, 10);
				emailAlreadyUsed.password = hashedPassword;
				emailAlreadyUsed.verifyCode = verifyCode;
				emailAlreadyUsed.verifyCodeExpiry = new Date(Date.now() + 3600000);
				await emailAlreadyUsed.save();
			}
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const expiryDate = new Date();
			expiryDate.setHours(expiryDate.getDate() + 1);
			const newUser = new UserModel({
				username,
				email,
				password: hashedPassword,
				verifyCode,
				verifyCodeExpiry: expiryDate,
				isVerifyed: false,
				isAcceptingMsg: true,
				messages: [],
			});
			await newUser.save();
		}

		// send verification email
		const emailResponse = await sendMail(email, username, verifyCode);
		if (!emailResponse.success) {
			Response.json({ status: 500, success: false, message: emailResponse.message });
		}

		Response.json({ status: 201, success: true, message: "user registerd successfully" });
	} catch (error) {
		console.log("error registering user", error);
		return Response.json({ status: 500, success: false, message: "error registering user" });
	}
}
