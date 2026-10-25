import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { sendMail } from "@/lib/resend";
import UserModel from "@/model/user";
import { signupSchema } from "@/schemas/signupSchema";

export async function POST(request: Request) {
    
	try {
		const body = await request.json();
		const parsed = signupSchema.safeParse(body);
        console.log('hit signup',parsed)
		if (!parsed.success) {
			return Response.json(
				{
					success: false,
					message: parsed.error.issues[0]?.message || "Invalid signup data",
				},
				{ status: 400 }
			);
		}

		const { username, email, password } = parsed.data;
		await dbConnect();

		const usernameTaken = await UserModel.findOne({ username, isVerifyed: true });
		if (usernameTaken) {
			return Response.json(
				{ status: 400, success: false, message: "username already taken" },
				{ status: 400 }
			);
		}

		const emailAlreadyUsed = await UserModel.findOne({ email });
		const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
		const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);

		if (emailAlreadyUsed) {
			if (emailAlreadyUsed.isVerifyed) {
				return Response.json(
					{ status: 400, success: false, message: "user already exists" },
					{ status: 400 }
				);
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			emailAlreadyUsed.password = hashedPassword;
			emailAlreadyUsed.verifyCode = verifyCode;
			emailAlreadyUsed.verifyCodeExpiry = verifyCodeExpiry;
			await emailAlreadyUsed.save();
		} else {
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = new UserModel({
				username,
				email,
				password: hashedPassword,
				verifyCode,
				verifyCodeExpiry,
				isVerifyed: false,
				isAcceptingMsg: true,
				messages: [],
			});
			await newUser.save();
		}

		const emailResponse = await sendMail(email, username, verifyCode);
		if (!emailResponse.success) {
			return Response.json(
				{ status: 500, success: false, message: emailResponse.message },
				{ status: 500 }
			);
		}

		return Response.json(
			{ status: 201, success: true, message: "user registered successfully" },
			{ status: 201 }
		);
	} catch (error) {
		console.error("error registering user", error);
		return Response.json(
			{ status: 500, success: false, message: "error registering user" },
			{ status: 500 }
		);
	}
}
