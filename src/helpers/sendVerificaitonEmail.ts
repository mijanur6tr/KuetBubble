import { ApiResponse } from "@/types/ApiResponse";
import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificatinEmail";

async function sendVerificationEmail(
    username:string,
    email:string,
    verifyCode:string
) : Promise<ApiResponse> {
    try {
    await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'KuetBubble Verification Code',
    react: VerificationEmail({username,otp:verifyCode}),
    })
    return {success:true,message:"Email sent"}
    } catch (error) {
        console.log(error,"Error in sending emails")
        return {success:false,message:"Error in sending emails"}
    }
}

export default sendVerificationEmail;
