import UserModel from "@/models/User.models";
import connectDb from "@/lib/dbConnect";
import z, { success } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { messageSchema } from "@/schemas/messageSchema";


const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {
    await connectDb();
    try {
        const { searchParams } = new URL(request.url)

        const queryParams = {
            username: searchParams.get("username")
        }

        const result = usernameQuerySchema.safeParse(queryParams)
        console.log(result)

        if (!result.success) {
            const usernameError = result.error.format().username?._error || ""
            return Response.json(
                {
                    success: false,
                    message: usernameError.length>0 ? usernameError.join(', '): "Promlem in username validation... : invalid query parameters"
            },
                {
                    status: 400
                })
        }

        const {username} = result.data;

        const existedverifiedUser = await UserModel.findOne({
            username,
            isVerified:true,
        })

        if(!existedverifiedUser){
            return Response.json({
                success:false,message:"Verified user with this username does not exist"
            },{status:400})
        }

        return Response.json({
            success:true,
            message:"Username is unique"
        },{status:200})

    } catch (error) {
        console.log("Error in unique id checkhing username unique",error)
        return Response.json({
            success:false,
            message:"Error in unique id generating"
        },{status:500})
    }
}