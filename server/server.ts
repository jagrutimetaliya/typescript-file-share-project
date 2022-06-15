import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDb from './config/db';
import fileRoutes from './routes/files';
import {v2 as cloudinary} from 'cloudinary';
const app = express();
dotenv.config();

connectDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended:true,
}));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_CLOUD,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
app.use("/api/files",fileRoutes);
const PORT = process.env.PORT;
app.listen(PORT,() => console.log(`Server is listen to Jagruti PORT ${PORT}`));