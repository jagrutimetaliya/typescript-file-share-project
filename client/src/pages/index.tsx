import DropZoneComponent from "@components/DropZoneComponent";
import RenderFile from "@components/RenderFile";
import { useState } from "react";
import axios from 'axios';
import DownloadFile from "@components/DownloadFile";
import EmailForm from "@components/EmailForm";

export default function Home() {
  const [file,setFile] = useState(null);
  const [id,setId] = useState(null)
  const [downloadPageLink,setDownloadPageLink] = useState(null)
  const [uploadState,setUploadState] = useState<"Uploading"|"Upload Failed"|"Uploaded"|"Upload">("Upload")
  
  const handleUpload = async() =>{
    if(uploadState === "Uploading") return;
    setUploadState("Uploading");
    const formData = new FormData();
    formData.append("myFile",file)
    try{
      const {data} = await axios({
        method:"post",
        data:formData,
        url:"api/files/upload",
        headers:{
            "Content-Type" : "multipart/form-data"          
        },
      });
      setDownloadPageLink(data.downloadPageLink);
      setId(data.id)
    }catch(error){  
      setUploadState("Upload Failed");
    }
  }

  const resetComponent = () => { 
    setFile(null);
    setDownloadPageLink(null);
    setUploadState('Upload');
   }
  return (
    <div className="flex flex-col item-center justify-center">
      <h1 className="my-4 text-3xl font-medium">Got a File ? Share it Like Fake News</h1>
      <div className="flex flex-col items-center justify-center bg-gray-800 shadow-xl w-96  rounded-xl">  
        {/** dropzone */}
        { !downloadPageLink && <DropZoneComponent setFile={setFile}/>}
        {/** render file */}
        {file && <RenderFile file={{
          format:file?.type.split("/")[1],
          name:file?.name,
          sizeInBytes:file.size,
          }}/>}


        {/** upload button */}
        { !downloadPageLink && file && <button className="button" onClick={handleUpload}>{uploadState}</button>
}
        {downloadPageLink && 
          <div className="p-2 text-center">

              <DownloadFile downloadPageLink={downloadPageLink}/>
              {/** Email Form */}
              <EmailForm id={id}/>
              <button className="button" onClick={resetComponent}>Upload New File</button>
          </div>}


      </div>
    </div>  
  );
}
