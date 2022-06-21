import express from 'express';
import multer from "multer";
import https from 'https';
const router = express.Router();
const storage = multer.diskStorage({});
import {UploadApiResponse, v2 as cloudinary} from 'cloudinary';
import File from '../models/File';
let upload = multer({
    storage
})
router.post("/upload",upload.single("myFile"),async (req,res)=>{
    try{
      
        if(!req.file){
            return res.status(400).json({message:"Hey sweetie! We need the file."});
        }

        console.log(req.file);
        
        let uploadedFile:UploadApiResponse;
        try{
            uploadedFile = await cloudinary.uploader.upload(req.file.path,{
                folder:"sharemeYT",
                resource_type : "auto",
            });
        }catch(error){
              let  errorMessage = "Cloudinary Error";
              if (error instanceof Error) {
                errorMessage = error.message;
              }
            return res.status(400).json({message: errorMessage});
        }
        const {originalname} = req.file ;
        const {secure_url,bytes,format} = uploadedFile;
        const file = await File.create({
            filename : originalname,
            sizeInBytes: bytes,
            secure_url,
            format,
        });
        res.status(200).json({
            id:file._id,
            downloadPageLink:`${process.env.API_BASE_ENDPOINT_CLIENT}download/${file._id} `
        });
    }catch(error){
       let  errorMessage = 'Server Error :(';
       if (error instanceof Error) {
         errorMessage = error.message;
       }
       console.log(errorMessage);
        res.status(500).json({message : errorMessage})
    }
});
router.get("/:id", async(req,res) => {
    try{
        const id = req.params.id;
        const file = await File.findById(id)
        if(!file){
            return res.status(404).json({message : "File does not exist"})
        }
        const {filename,format,sizeInBytes} = file;
        return res.status(200).json({
            name: filename,
            sizeInBytes,
            format,
            id
        });
    }catch(error){
        let  errorMessage = 'Server Error :(';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
         res.status(500).json({message : errorMessage})
    }
});

router.get("/:id/download", async(req,res) => {
    try{
        const id = req.params.id;
        const file = await File.findById(id)
        if(!file){
            return res.status(404).json({message : "File does not exist"})
        }
        https.get(file.secure_url,(fileStream) => {
            fileStream.pipe(res)
        });
    }catch(error){
        let  errorMessage = 'Server Error :(';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
         res.status(500).json({message : errorMessage})
    }
});
router.post("/email", (req,res) =>{
    
})

export default router;