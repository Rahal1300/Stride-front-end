import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../../features/reducers/authReducer';

function Files({id}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);



  
  const usertoken = useSelector(loginSuccess);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('documents', file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id}/adddocuments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        console.log('File uploaded successfully.');
      } else {
        console.error('Error uploading file:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error.message);
    }
  };


  const handleDownload = (file) => {
    try {
      const blob = new Blob([file.content]);
      const downloadLink = document.createElement('a');
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.setAttribute('download', file.documentName);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Something went wrong while downloading the file:', error);
    }
  };
  
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  useEffect(() => {
  
     const fetchFiles = async () => {
         try {
             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id}`, {
                method: 'GET',
                headers: {
                     Authorization: `Bearer ${usertoken.payload.token}`,
                },
            });
            const data = await response.json();
           setUploadedFiles(data.documents );
           console.log(data);
       } catch (error) {
           console.error('Error fetching files:', error);
         }
    };

     fetchFiles();
}, [ usertoken]);



  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: '16px',
          width: '100%',
          maxWidth: '800px',
        }}
      >
<Box
  sx={{
    border: '2px dashed #ccc',
    padding: '22px 26px',
    marginBottom: '16px',
    width: '100%', // Adjusted width to occupy full width on smaller screens
    maxWidth: '800px', // Maximum width for larger screens
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: '16px',
  }}
>
  {/* Conditionally render the icon based on screen width */}
  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
    <CloudUploadIcon sx={{ fontSize: 40 }} /> {/* Show only the icon on smaller screens */}
  </Box>
  <Typography variant="body1" gutterBottom sx={{ textAlign: 'center', mt: { xs: 2, sm: 0 } }}>
    Upload a file or drag and drop
  </Typography>
  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ textAlign: 'center', mt: { xs: 1, sm: 0 } }}>
    Upload any file type with a maximum size of 200Mb
  </Typography>
  <label htmlFor="file-input" >
  <Button
    component="span"
    variant="contained"
    color="primary"
    startIcon={<CloudUploadIcon />}
    sx={{ marginTop: { xs: '16px', sm: 0 } }} // Adjust marginTop based on screen size
  >
    Upload File
  </Button>
  <input
    type="file"
    accept="image/*, application/pdf"
    multiple
    onChange={handleFileChange}
    id="file-input"
    style={{ display: 'none' }}
  />
</label>

</Box>



        <Box
  sx={{
    width: 'calc(100% - 239px)', // Adjusted width to accommodate the button
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align items to the start of the row
  }}
>
  {uploadedFiles.slice(0, 2).map((file, index) => (
   <Paper key={index} elevation={3} sx={{ padding: '10px', marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: '16px',width:'240px' }}>
   <InsertDriveFileIcon />
   <Typography variant="body1" sx={{ marginLeft: '10px' }}>
     {file.documentName}
   </Typography>
   <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}> {/* Flex container to center icon at the bottom */}
        <Typography  color="text.secondary" gutterBottom sx={{  fontSize: 12 }}>
  {/* Size: {formatFileSize(file.size)} Display formatted file size */}
</Typography>
        </Box>
   <Button
     variant="outlined"
     color="primary"
     size="small"
     onClick={() => handleDownload(file)}
     sx={{ marginTop: '10px' }} // Add marginTop to separate buttons vertically
   >
     Download
   </Button>

 </Paper>
 
  ))}
</Box>

      </Box>
      <Box
  sx={{
    width: 'calc(100% - 239px)', // Adjusted width to accommodate the button
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow items to wrap to the next line
    justifyContent: 'flex-start', // Align items to the start of the row
  }}
>
  {files.slice(2).map((file, index) => (
    <Box key={index} sx={{ width: '100%', marginRight: '16px', marginBottom: '16px', '@media (min-width: 600px)': { width: 'calc(50% - 16px)' }, '@media (min-width: 960px)': { width: 'calc(33.33% - 16px)' } }}>
      <Paper elevation={3} sx={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}> {/* Flex container to center icon at the bottom */}
          <Typography variant="body1" sx={{ marginLeft: '10px', '@media (max-width: 600px)': { fontSize: '12px' } }}>
            {file.name}
          </Typography>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}> {/* Flex container to center icon at the bottom */}
          <Typography variant="body1" sx={{ marginLeft: '10px' }}>
            <InsertDriveFileIcon sx={{ fontSize: '40px' }} />
          </Typography>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}> {/* Flex container to center buttons at the bottom */}
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleDownload(file)}
            sx={{ marginRight: '20px', '@media (max-width: 600px)': { fontSize: '6px', padding: '6px 12px',marginRight: '2px' } }}
          >
            Download
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={{ marginTop: '10px', '@media (max-width: 600px)': { fontSize: '6px', padding: '2px 2px' } }}
          >
            Access
          </Button>
        </Box>
      </Paper>
    </Box>
  ))}
</Box>





    </Box>
  );
}

export default Files;
