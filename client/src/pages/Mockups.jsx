import React from 'react'
import { useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
function Mockups() {
    const canvasRef = useRef(null);
    const uploadMockupToCloudinary = async () => {
        const canvas = canvasRef.current;
      
        canvas.toBlob(async (blob) => {
          const formData = new FormData();
          formData.append("file", blob);
          formData.append("upload_preset", "your_upload_preset");
      
          try {
            const res = await axios.post("http://localhost:3000/api/mockup/upload", formData);
            console.log("Cloudinary URL:", res.data.url);
            toast.success("Mockup uploaded!");
          } catch (err) {
            toast.error("Upload failed");
            console.error(err);
          }
        }, "image/png");
      };
  return (
    <div>
        <canvas ref={canvasRef} />
        <button onClick={uploadMockupToCloudinary}>Upload Mockup</button>
    </div>
  )
}

export default Mockups