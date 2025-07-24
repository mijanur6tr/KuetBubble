import mongoose, { mongo } from "mongoose";
import { exit } from "process";

type isConnnectedObj = {
    isConnect ?: number,
}

const connection:isConnnectedObj = {}


async function connectDb():Promise<void> {
    if(connection.isConnect){
        console.log("Already connected to the database")
        return
    }

    try {
        //if database is not already connected then connecting
        const db = await mongoose.connect(process.env.MONGO_DB_URI || "")
        //putting the connection.inconnect value from the database
        connection.isConnect = db.connections[0].readyState;
        console.log("Database Connected Successfully")
        
    } catch (error) {
        console.log(error, "Error in connecting Mongodb")
        //graceful exit
        exit(1);
    }
}

export default connectDb;