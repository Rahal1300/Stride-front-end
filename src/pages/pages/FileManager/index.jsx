import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress, TextField, Grid } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FolderIcon from '@mui/icons-material/Folder';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';

const FileManager = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fetchedFolders, setFetchedFolders] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [draggingFile, setDraggingFile] = useState(null);
  const usertoken = useSelector(loginSuccess);

  useEffect(() => {
    fetchDocuments();
    fetchFolders();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('http://192.168.30.200:8087/projects/getdocuments', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usertoken.payload.token}`,
        },
      });
      const data = await response.json();
      setUploadedFiles(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await fetch('http://192.168.30.200:8087/folders/all', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usertoken.payload.token}`,
        },
      });
      const data = await response.json();
      setFetchedFolders(data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoadingFetch(false);
    }
  };

  const handleFileChange = async (event) => {
    setLoadingUpload(true);
    const files = Array.from(event.target.files);

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await fetch('http://192.168.30.200:8087/projects/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${usertoken.payload.token}`,
          },
          body: formData,
        });
        await fetchDocuments();
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    setLoadingUpload(false);
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        const response = await fetch('http://192.168.30.200:8087/folders/folders/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken.payload.token}`,
          },
          body:  newFolderName ,
        });

        if (response.ok) {
          const newFolder = await response.json();
          setFetchedFolders((prev) => [...prev, { ...newFolder, files: [] }]);
          setNewFolderName('');
        } else {
          console.error('Error creating folder');
        }
      } catch (error) {
        console.error('Error creating folder:', error);
      }
    }
  };

  const moveFile = async (fileId, folderId) => {
    try {
      const response = await fetch(`http://192.168.30.200:8087/folders/files/move?fileId=${fileId}&folderId=${folderId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${usertoken.payload.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to move file');
      }

      const updatedFile = await response.json();
      console.log('File moved successfully:', updatedFile);
    } catch (error) {
      console.error('Error moving file:', error);
    }
  };

  const handleDragStart = (file) => {
    setDraggingFile(file);
  };

  const handleDrop = async (folder) => {
    if (draggingFile) {
      const updatedFolders = fetchedFolders.map((f) => {
        if (f.id === folder.id) {
          return { ...f, files: [...f.files, draggingFile] };
        }
        if (f.files.includes(draggingFile)) {
          return { ...f, files: f.files.filter((file) => file !== draggingFile) };
        }
        return f;
      });

      setFetchedFolders(updatedFolders);
      await moveFile(draggingFile.id, folder.id);
      setDraggingFile(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = `data:${file.type};base64,${file.content}`;
    link.download = file.documentName;
    link.click();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
      {/* Upload Section */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 4,
          width: '100%',
          maxWidth: '800px',
        }}
      >
        <Box
          sx={{
            border: '2px dashed #ccc',
            padding: '22px 26px',
            width: '100%',
            maxWidth: '800px',
            borderRadius: '6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
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
          <Typography variant="body1" gutterBottom sx={{ textAlign: 'center' }}>
            Upload a file or drag and drop
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ textAlign: 'center' }}>
            Upload any file type with a maximum size of 200MB
          </Typography>
          <label htmlFor="file-input">
            <Button
              component="span"
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 2 }}
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
      </Box>

      {/* Folder Creation */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <TextField
          label="New Folder Name"
          variant="outlined"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleCreateFolder}>
          Create Folder
        </Button>
      </Box>

      {/* Files and Folders */}
      {loadingFetch ? (
        <CircularProgress color="primary" />
      ) : (
        <Grid container spacing={3} sx={{ width: '100%', maxWidth: '800px' }}>
          {console.log(fetchedFolders)}
          {fetchedFolders.map((folder) => (
            <Grid item key={folder.id} xs={12} sm={6} md={4}>
              <Box
                sx={{
                  mb: 4,
                  width: '100%',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '16px',
                  backgroundColor: '#fafafa',
                }}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(folder)}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <FolderIcon sx={{ mr: 1 }} />
                  {folder.name}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {folder.files.map((file) => (
                    <Box
                      key={file.id}
                      sx={{
                        padding: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        mb: 1,
                        backgroundColor: draggingFile === file ? '#e0e0e0' : 'transparent',
                      }}
                      draggable
                      onDragStart={() => handleDragStart(file)}
                    >
                      <InsertDriveFileIcon sx={{ mr: 1 }} />
                      <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        {file.documentName}
                      </Typography>
                      <Button onClick={() => handleDownload(file)} variant="contained" color="primary">
                        Download
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Display files not in any folder */}
      <Box
        sx={{
          mb: 4,
          width: '100%',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '16px',
          backgroundColor: '#fafafa',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <InsertDriveFileIcon sx={{ mr: 1 }} />
          Files
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {uploadedFiles.map((file) => (
            <Box
              key={file.id}
              sx={{
                padding: '8px',
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '4px',
                mb: 1,
              }}
              draggable
              onDragStart={() => setDraggingFile(file)} 
            >
              <InsertDriveFileIcon sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ flexGrow: 1 }}>
                {file.documentName}
              </Typography>
              <Button onClick={() => handleDownload(file)} variant="contained" color="primary">
                Download
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default FileManager;
