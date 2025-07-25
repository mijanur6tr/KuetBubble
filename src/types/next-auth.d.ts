import NextAuth, { DefaultSession } from "next-auth"


declare module "next-auth"{
   
    interface Session {
       
        _id:string,
        isVerified:Boolean,
        isAcceptingMessage:Boolean,
        username:string}
    interface User {
        _id:string,
        isVerified:Boolean,
        isAcceptingMessage:Boolean,
        username:string
    }
}

declare module "next-auth/jwt"{
    interface JWT {
        _id:string,
        isVerified:Boolean,
        isAcceptingMessage:Boolean,
        username:string
    }
}