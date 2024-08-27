import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileManager = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingUpload, setLoadingUpload] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://192.168.30.200:8087/projects/getdocuments');
      const data = await response.json();
      setUploadedFiles(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoadingFetch(false);
    }
  };

  const handleFileChange = (event) => {
    // Handle file upload logic here
  };

  const handleDownload = (file) => {
    try {
      // Decode the Base64 content
      const byteCharacters = atob(file.content);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create a Blob from the binary data
      const blob = new Blob([byteArray], { type: file.type });
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
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Upload section */}
      <Box
        sx={{
          position: 'relative',
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
            width: '100%',
            maxWidth: '800px',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: '16px',
          }}
        >
          {loadingUpload && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
              }}
            >
              <CircularProgress color="primary" />
            </Box>
          )}

          <Typography variant="body1" gutterBottom sx={{ textAlign: 'center', mt: { xs: 2, sm: 0 } }}>
            Upload a file or drag and drop
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ textAlign: 'center', mt: { xs: 1, sm: 0 } }}>
            Upload any file type with a maximum size of 200Mb
          </Typography>
          <label htmlFor="file-input">
            <Button
              component="span"
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              sx={{ marginTop: { xs: '16px', sm: 0 } }}
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
            width: 'calc(100% - 239px)',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}
        >
          {loadingFetch ? (
            <Typography variant="body1">Loading...</Typography>
          ) : (
            uploadedFiles.slice(0, 2).map((file, index) => (
              <Paper key={index} elevation={3} sx={{ padding: '10px', marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: '16px', width: '240px' }}>
                <InsertDriveFileIcon />
                <Typography variant="body1" sx={{ marginLeft: '10px' }}>
                  {file.documentName}
                </Typography>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                  <Typography color="text.secondary" gutterBottom sx={{ fontSize: 12 }}>
                    {/* Size: {formatFileSize(file.size)} */}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => handleDownload(file)}
                  sx={{ marginTop: '10px' }}
                >
                  Download
                </Button>
              </Paper>
            ))
          )}
        </Box>
      </Box>

      <Box
        sx={{
          width: 'calc(100% - 239px)',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'flex-start',
        }}
      >
        {uploadedFiles.slice(2).map((file, index) => (
          <Box key={index} sx={{ width: '100%', marginRight: '16px', marginBottom: '16px', '@media (min-width: 600px)': { width: 'calc(50% - 16px)' }, '@media (min-width: 960px)': { width: 'calc(33.33% - 16px)' } }}>
            <Paper elevation={3} sx={{ padding: '10px', marginBottom: '10px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: '16px', width: '240px' }}>
              <InsertDriveFileIcon />
              <Typography variant="body1" sx={{ marginLeft: '10px' }}>
                {file.documentName}
              </Typography>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                <Typography color="text.secondary" gutterBottom sx={{ fontSize: 12 }}>
                  {/* Size: {formatFileSize(file.size)} */}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => handleDownload(file)}
                sx={{ marginTop: '10px' }}
              >
                Download
              </Button>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default FileManager;
