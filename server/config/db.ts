import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const connectDb = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI!,{ autoIndex: false});
    
    }catch(error){
        let errorMessage = "Failed to do something exceptional";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        console.log('connection : ',errorMessage);
    }
    const connection = mongoose.connection;
    if(connection.readyState >=1 ){
        console.log("Connected to database.");
        return;
    }
    connection.on("error",()=>console.log("Connection failed.")) 

}
export default connectDb;