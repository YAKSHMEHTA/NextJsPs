import {z} from 'zod';


export const usernameValidation = z
    .string()
    .min(3)
    .max(25)
    .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username can only contain letters, numbers, and underscores.',
    });

export const signupSchema = z.object({
    username:usernameValidation,
    email:z.string().email({message:'please enter a email'}).min(4),
    password:z.string().min(6,{message:'enter minimum 6 characters'})
})
