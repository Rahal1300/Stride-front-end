import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../../features/reducers/authReducer';
import { CircularProgress } from '@mui/material';

function Files({ id }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const usertoken = useSelector(loginSuccess);

  const fetchFiles = async () => {
    setLoadingFetch(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUploadedFiles(data.documents);
      } else {
        console.error('Failed to fetch files:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setLoadingFetch(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('files', file);
    setLoadingUpload(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id}/uploaddocuments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
        body: formData,
      });
      if (response.ok) {
        await fetchFiles(); // Refresh file list after successful upload
      } else {
        console.error('Error uploading file:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading file:', error.message);
    } finally {
      setLoadingUpload(false);
    }
  };

  const handleDownloads = async (fileName) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/projects/files/${id}/${fileName}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        }
      );
  
      if (response.ok) {
        const contentDisposition = response.headers.get('Content-Disposition');
        let downloadFileName = fileName; // Default to the passed file name
  
        if (contentDisposition && contentDisposition.includes('filename=')) {
          downloadFileName = contentDisposition
            .split('filename=')[1]
            .replace(/"/g, '')
            .trim();
        }
  
        const blob = await response.blob();
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.setAttribute('download', downloadFileName);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      } else {
        console.error('Error downloading file:', response.statusText);
      }
    } catch (error) {
      console.error('Error while downloading the file:', error.message);
    }
  };
  

  useEffect(() => {
    fetchFiles();
  }, [usertoken]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Upload Section */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '16px',
          width: '100%',
          maxWidth: '800px',
        }}
      >
        {loadingUpload && <CircularProgress color="primary" sx={{ marginBottom: 2 }} />}
        <Typography variant="body1" gutterBottom>
          Upload a file or drag and drop
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Upload any file type with a maximum size of 200MB
        </Typography>
        <label htmlFor="file-input">
          <Button
            component="span"
            variant="contained"
            color="primary"
            startIcon={<CloudUploadIcon />}
          >
            Upload File
          </Button>
          <input
            type="file"
            id="file-input"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </label>
      </Box>

      {/* Files Display */}
      {loadingFetch ? (
        <CircularProgress color="primary" />
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '16px',
          }}
        >
          {uploadedFiles.map((file, index) => (
            <Paper
              key={index}
              elevation={3}
              sx={{
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '240px',
              }}
            >
              <InsertDriveFileIcon fontSize="large" />
              <Typography variant="body1" sx={{ marginTop: '10px' }}>
                {file.documentName}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                sx={{ marginTop: '10px' }}
                onClick={() => handleDownloads(file.documentName)}
              >
                Download
              </Button>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default Files;
