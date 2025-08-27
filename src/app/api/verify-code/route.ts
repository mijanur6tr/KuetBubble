import UserModel from "@/models/User.models";
import connectDb from "@/lib/dbConnect";


export async function POST(request:Request){
    await connectDb();
    try {
        const {username,code} =await request.json()
        
        const user =await UserModel.findOne({username})

        if(!user){
            return Response.json({success:false,message:"user is not found"},{status:400})
        }

        const isCodeMatch = user.verifyCode===code;
        const isValid = new Date(user.verifyCodeExpiry)  > new Date();

        if(isCodeMatch && isValid ){
            user.isVerified=true;
            await user.save();
            return Response.json({success:true,message:"User Verified"},{status:200})
        }else if(!isValid){
            return Response.json({success:false,message:"CODE Expired"},{status:400})
        }else{
            return Response.json({success:false,message:"Code does not match"},{status:400})
        }

    } catch (error) {
        console.log("Error in verifying the user : ",error)
        return Response.json({success:false,message:"Error while verifying the user"},{status:500})
    }
}