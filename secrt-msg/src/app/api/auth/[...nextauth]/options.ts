import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials: any): Promise<any> {
				await dbConnect();
                console.log('wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww')
				try {
					const user = await UserModel.findOne({
						$or: [{ email: credentials.identifier }, { username: credentials.identifier }],
					});
					if (!user) {
						throw new Error("No userFound with this email");
					}
					if (user.isVerifyed) {
						throw new Error("please verify your account first");
					}

					const isPassCorrect = await bcrypt.compare(credentials.password, user.password);

					if (isPassCorrect) {
						return user;
					} else {
						throw new Error("Inccorect email or password");
					}
				} catch (error: any) {
					throw new Error(error);
				}
			},
		}),
	],
	callbacks: {
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.isVerifyed = token.isVerifyed;
				session.user.isAcceptingMsg = token.isAcceptingMsg;
				session.user.username = token.username;
			}
			return session;
		},
		async jwt({ token, user }) {
			if (user) {
				token.id = user._id;
				token.isVerifyed = user.isVerifyed;
				token.isAcceptingMsg = user.isAcceptingMsg;
				token.username = user.username;
			}
			return token;
		},
	},
	pages: {
		signIn: "/auth/signin",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
