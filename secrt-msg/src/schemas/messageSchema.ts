import { z } from "zod";


export const messageSchema = z.object({
	content: z.string().min(10, { message: "content must be of 10 length" }).max(300, { message: "content too large,300 at max" }),
});
