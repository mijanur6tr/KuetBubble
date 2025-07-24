import z from "zod";

export const usernameValidation = z
   .string()
   .min(4,"Username must be at least four character")
   .max(15,"Username shouln't be more than 15 character")
   .regex(/^[a-zA-Z0-9_]+$/,"Special characters are not allowed")


   export const signUpSchema = z.object({
    username:usernameValidation,

    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(8,{message:"Password must contain 8 digit"})

   })