import connectDb from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";;



export async function DELETE(
    request: Request,
    { params }: { params: Record<string, string> }
) {
    const messageid = params.messageid
    await connectDb();
    const session =await getServerSession(authOptions)
    const user: User = session?.user

    if (!user || !session) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }

    try {
        const updatedUser = await UserModel.updateOne({ _id: user._id }, { $pull: { messages: { _id: messageid } } })

        if (updatedUser.modifiedCount === 0) {
            return Response.json(
                { success: false, message: 'Already deleted' },
                { status: 401 }
            );
        }

        return Response.json({ message: "Message deleted", success: true }, { status: 200 })
    } catch (error) {
        console.error('Error deleting message:', error);
        return Response.json(
            { message: 'Error deleting message', success: false },
            { status: 500 }
        );

    }
}