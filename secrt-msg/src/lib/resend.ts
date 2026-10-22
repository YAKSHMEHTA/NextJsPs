import { Resend } from "resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { apiResponse } from "@/types/apiResponse";


export const resend = new Resend(process.env.RESEND_API_KEY);

export const sendMail = async (email: string, username: string, code: string): Promise<apiResponse> => {
	try {
		await resend.emails.send({
			from: "onboarding@resend.dev",
			to: email,
            subject:'verifiction code',
            react:VerificationEmail({username,code})
		});

		return { success: true, message: "email sent successfully" };
	} catch (error) {
		console.log("error while sendin email", error);
		return { success: false, message: "failed to send verification email" };
	}
};
