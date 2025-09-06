import connectDb from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

//making post request to change the isAcceptingMessage field 
export async function POST(request:Request){
    await connectDb();

    const session = await getServerSession(authOptions)
    const user = session?.user;

    if (!session || !user) {
        return new Response("Unauthorized", { status: 401 });
    }


    const userId = user._id;
    const {acceptMessage} = await request.json()

    try {

        //find user with the userId and update the isAccepting message field
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{isAcceptingMessage:acceptMessage},{new:true})


        if(!updatedUser){
            return Response.json({success:false,message:"User not found for updating the isAcceptingMessage field"},{status:404})
        }

        return Response.json({
            success:true,
            message:"isAcceptingMessage updated"
        },{status:200})
        
    } catch (error) {
        console.log("error in accept message",error)
        return Response.json({success:false,message:"Error in accept message"},{status:500})
    }


}

//getting the value if message accepting or not
export async function GET(request:Request){
    await connectDb();

    const session = await getServerSession(authOptions)
    const user = session?.user;

    if (!session || !user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        //find user with the userId and update the isAccepting message field
        const getUser = await UserModel.findById(userId)

        if(!getUser){
            return Response.json({success:false,message:"User not found"},{status:404})
        }

        return Response.json({
            success:true,
            isAcceptingMessage:getUser.isAcceptingMessage
        },{status:200})
        
    } catch (error) {
        console.log("Error retrieving message acceptance status",error)
        return Response.json({success:false,message:"Error retrieving message acceptance status"},{status:500})
    }


}