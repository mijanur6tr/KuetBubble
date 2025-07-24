import z from "zod";

export const messageSchema = z.object({
    content:z.string()
    .min(10,{message:"Must contain 10 character"})
    .max(255,{message:"Message should be within 255 characters"}),
    
})