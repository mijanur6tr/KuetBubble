import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import UserModel from "@/models/User.models";
import connectDb from "@/lib/dbConnect";
import bcrypt from 'bcrypt';
import { jwt } from "zod";


export const authOptions:NextAuthOptions = {

providers: [
  CredentialsProvider({
    id:"credentials",
    name: "Credentials",
  
    credentials: {
      email: { label: "Email", type: "text", },
      password: { label: "Password", type: "password" }
    },
    async authorize(credentials:any):Promise<any> {
        await connectDb()

        try {
            const user = await UserModel.findOne({
                $or:[
                    {username:credentials.identifier},
                    {email:credentials.identifier}
                ]
            })
    
            if(!user){
                throw new Error("User does not exist with this email or userid")
            }
    
            if(!user.isVerified){
                throw new Error("User is not verified. Verify your id before logging in")
            }
    
            const isPasswordMatch = bcrypt.compare(user.password,credentials.password)
    
            if(!isPasswordMatch){
                throw new Error("Invalid credential.")
            }
    
            return user;
        } catch (err:any) {
            console.log("Error in logging in user",err)
            throw new Error("Error in logging in the user.")
        }
     
      }
    }
  )
],

callbacks: {
    async jwt({ token, user}) {
        if(user){
            token._id= user._id.toString(),
            token.isVerified= user.isVerified,
            token.isAcceptingMessage= user.isAcceptingMessage,
            token.username= user.username
        }
      return token
    },
    async session({ session, token }) {
        if(token){
            session._id = token._id,
            session.isVerified = token.isVerified,
            session.isAcceptingMessage = token.isAcceptingMessage,
            session.username = token.username
        }
        return session
        },
},

secret:process.env.NEXT_AUTH_SECRET,

session:{
    strategy:"jwt",
},

pages:{
    signIn:"/sign-in"
}

}
