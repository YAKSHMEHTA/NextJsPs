import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface User {
		_id?: string;
		username?: string;
		isVerifyed?: boolean;
		isAcceptingMsg?: boolean;
	}
	interface Session {
		user: {
			id?: string;
			username?: string;
			isVerifyed?: boolean;
			isAcceptingMsg?: boolean;
		} & DefaultSession["user"];
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id?: string;
		username?: string;
		isVerifyed?: boolean;
		isAcceptingMsg?: boolean;
	}
}
