import UserModel from "@/models/User.models";
import connectDb from "@/lib/dbConnect";
import { Message } from "@/models/User.models";


export async function POST (request:Request){
    await connectDb();
    try {
        const {username,content} = await request.json();
        const user = await UserModel.findOne({username}).exec();

        //checking the user 
        if(!user){
            return Response.json({success:false,message:"User not found"},{status:404})
        }

        //checking if user accepting messages
        if(!user.isAcceptingMessage){
            return Response.json({success:false,message:"User is not accepting message current now."},{status:403})
        }

        //creating newMessages
        const newMessage = {content,createdAt : new Date()}

        //pushing the messages to the user
        user.messages.push(newMessage as Message)
        await user.save();

        return Response.json({success:true,message:"Message sent successfully"},{status:200})

    } catch (error) {
        console.log("Error in sending the message",error)
        return Response.json({success:false,message:"Internal Error in sending the message"},{status:500})
    }
}