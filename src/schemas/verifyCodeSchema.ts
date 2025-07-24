import z from "zod";

export const verifyCodeSchema = z.object({
    code:z.string().length(6,{message:"verification code must be six digits"})
})