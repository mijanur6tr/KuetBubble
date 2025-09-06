import mongoose,{Schema,Document, mongo} from "mongoose";


export interface Message extends Document{
    _id:string,
    content:string,
    createdAt:Date
}

const messageSchema:Schema<Message> = new mongoose.Schema({
    content:{
        type:String,
        require:true,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifyCodeExpiry:Date,
    isVerified:boolean,
    isAcceptingMessage:boolean,
    messages:Message[]
}


const userSchema:Schema<User> = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"],
        unique:true,
        trim:true,
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    verifyCode:{
        type:String,
        required:[true,"verify code is required"],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,"expiry time of code is required"],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true
    },
    messages:[messageSchema]
})


 const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User",userSchema)

 export default UserModel;