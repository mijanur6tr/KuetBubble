import UserModel from "@/models/User.models";
import connectDb from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { useId } from "react";

export async function GET(request:Request){
    await connectDb();

    const session = await getServerSession(authOptions)
    const user = session?.user;

    if(!user || !session){
        return Response.json({success:false,message:"Not Authenticated"},{status:404})
    }
    
    const userId = user._id
    try {
        const messages = await UserModel.aggregate([
            {$match:{_id:userId}},
            {$unwind:'$messages'},
            {$sort:{'message.createdAt':-1}},
            {$group:{_id:'$_id',message:{$push:"$messages"}}}
        ]).exec()

        if(!messages || messages.length === 0){
            return Response.json({success:false,message:"Message not found"},{status:404})
        }

        return Response.json({success:true,messages},{status:200})

    } catch (error) {
        console.log("Error in getting the messages",error)
        return Response.json({success:false,message:"Error in getting the messages"},{status:404})
    }
}