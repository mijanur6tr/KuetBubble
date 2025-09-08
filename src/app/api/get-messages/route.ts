import UserModel from "@/models/User.models";
import connectDb from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
    await connectDb();

    const session = await getServerSession(authOptions)
    const user = session?.user;

    if (!user || !session) {
        return Response.json({ success: false, message: "Not Authenticated" }, { status: 404 })
    }

    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const userMessagesAgg = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ]).exec()

        const messages = userMessagesAgg[0]?.messages || []

        return Response.json({ success: true, messages }, { status: 200 })

       


    } catch (error) {
        console.log("Error in getting the messages", error)
        return Response.json({ success: false, message: "Error in getting the messages" }, { status: 404 })
    }
}