import connectDb from "@/lib/dbConnect";
import UserModel from "@/models/User.models";
import sendVerificationEmail from "@/helpers/sendVerificaitonEmail";
import bcrypt from "bcrypt"



export async function Post(request:Request) {
     await connectDb();
     try {
        const {username,email,password} = await request.json();

        //checking if the user is already exists with this username and verified
        const existedUserByVerifiedUsername = await UserModel.findOne({
            username,
            isVerified:true
        })

        if(existedUserByVerifiedUsername){
            return Response.json(
                {success:false,message:"Username already taken"},
                {status:400}
            )
        }

        const existedUserByEmail = await UserModel.findOne({email})
        const otp =  Math.floor(100000 + Math.random() * 900000).toString();

        //checking user exist or not with email
        if(existedUserByEmail){

            //checking user exist with email is verified
            if(existedUserByEmail.isVerified){
               return Response.json(
                {success:false,message:"User with this email already exist"},
                {status:400}
            ) 
            }else{

                //if the user exist with email but not verified
                const hashedPassword = await bcrypt.hash(password,10)
                existedUserByEmail.password= hashedPassword;
                existedUserByEmail.verifyCode=otp;
                existedUserByEmail.verifyCodeExpiry= new Date( Date.now()+3600000)
                await existedUserByEmail.save()
            }
            
        }else{

            //if the user is not exist with email and not verified
            const hashedPassword = await bcrypt.hash(password,10)

            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode:otp,
                verifyCodeExpiry: new Date(Date.now()+3600000),
                isVerified:false,
                isAcceptMessage:true,
                messages:[]
            })

            await newUser.save()

        }

        //send verification code in the email
        const sendingEmailResponse = await sendVerificationEmail(username,email,otp)

        if(!sendingEmailResponse.success){
            return Response.json(
                {success:false,message:"Error in sending OTP"},
                {status:500}
            )
        }

        return Response.json(
            {success:true,message:"Verification code sent to email"},
            {status:200}
        )

     } catch (error) {
        console.log(error,"Error in sign up process")
        return Response.json({
            success:false,
            message:"Error in sign up"
        },
        {
            status:500
        }
    )
     }
}