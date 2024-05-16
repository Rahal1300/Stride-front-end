import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Image from 'next/image';
import Grid from '@mui/material/Grid';
import withAuth from '../../../features/reducers/withAuth';
function Files() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).map(file => ({
      name: file.name,
      url: URL.createObjectURL(file), // Generate URL for accessing the file
      type: file.type, // Include file type
      size: file.size, // Include file size
    }));

    setFiles([...files, ...newFiles]);
  };
  const handleDownload = (file) => {
    try {
      const downloadLink = document.createElement('a');
      downloadLink.href = file.url;
      downloadLink.download = file.name;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  return (
    <>   
  <Box sx={{ marginTop: 2,marginBottom:18 }}>
  <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
    <Grid item xs={12} sm={6}>
      <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
      File Manager      </Typography>
    </Grid>
  
  </Grid>
</Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  
<Box
  sx={{
    border: '2px dashed #ccc',
    padding: '22px 26px',
    marginBottom: '16px',
    width: '100%', // Set width to 100% to occupy full width on smaller screens
    maxWidth: { xs: '1030px', sm: '1050px' }, // Set maxWidth based on screen size
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }}
>
  {/* Conditionally render the icon based on screen width */}
  <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
    <CloudUploadIcon sx={{ fontSize: 50 }} /> {/* Show only the icon on smaller screens */}
  </Box>
  <Typography
  variant="body1"
  gutterBottom
  sx={{
    textAlign: 'center',
    mt: { xs: 2, sm: 0 },
    fontSize: { xs: 0, sm: 40 }, // Adjust font size based on screen size
    display: { xs: 'none', sm: 'block' } // Show on small and medium screens, hide on extra small screens
  }}
>
  Upload a file or drag and drop
</Typography>

  <Typography variant="body2" color="text.secondary" gutterBottom sx={{ textAlign: 'center', mt: { xs: 1, sm: 0 },fontSize: 22 ,    display: { xs: 'none', sm: 'block' }}}>
    Upload any file type 
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
  {files.map((file, index) => (
    <Box key={index} sx={{ width: '100%', marginRight: '16px', marginBottom: '16px', '@media (min-width: 600px)': { width: 'calc(50% - 16px)' }, '@media (min-width: 960px)': { width: 'calc(33.33% - 16px)' } }}>
      <Paper elevation={3} sx={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}> {/* Flex container to center icon at the bottom */}
          <Typography variant="body1" sx={{ marginLeft: '10px', '@media (max-width: 600px)': { fontSize: '12px' } }}>
            {file.name}
          </Typography>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}> {/* Flex container to center icon at the bottom */}
        <Typography  color="text.secondary" gutterBottom sx={{  fontSize: 12 }}>
  Size: {formatFileSize(file.size)} {/* Display formatted file size */}
</Typography>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}> {/* Flex container to center icon at the bottom */}
          <Typography variant="body1" sx={{ marginLeft: '10px' }}>
            <InsertDriveFileIcon sx={{ fontSize: '40px', fontSize: { xs: 'none', sm: 'block' } }} />
          </Typography>
        </Box>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}> {/* Flex container to center buttons at the bottom */}
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleDownload(file)}
            sx={{ marginRight: '20px', '@media (max-width: 600px)': { fontSize: '6px', padding: '6px 12px',marginRight: '2px' }, fontSize: { xs: 'none', sm: 'block' } }}
          >
            Download
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => window.open(file.url, '_blank')} // Replace file.url with the actual URL of the file

            sx={{ marginTop: '10px', '@media (max-width: 600px)': { fontSize: '6px', padding: '2px 2px' } }}
          >
            Access
          </Button>
        </Box>
      </Paper>
    </Box>
  ))}
</Box>





   </>
  );
}

export default withAuth(Files);
