import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { usernameValidation } from "@/schemas/signupSchema";

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const username = searchParams.get("username");
		const parsed = usernameValidation.safeParse(username);

		if (!parsed.success) {
			return Response.json(
				{
					success: false,
					message: parsed.error.issues[0]?.message || "Invalid username",
				},
				{ status: 400 }
			);
		}

		await dbConnect();
		const user = await UserModel.findOne({ username: parsed.data });

		return Response.json({
			success: true,
			available: !user,
			message: user ? "username already taken" : "username available",
		});
	} catch (error) {
		console.error("error checking username", error);
		return Response.json(
			{ success: false, message: "error checking username" },
			{ status: 500 }
		);
	}
}
