import z from "zod";

export const signInSchema = z.object({
    email:z.string().email({message:"Invalid email"}),
    password:z.string().min(8,{message:"Password must contain 8 digit"})
})