import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, TextField, Grid } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FolderIcon from '@mui/icons-material/Folder';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';

const FileManager = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fetchedFolders, setFetchedFolders] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [draggingFile, setDraggingFile] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const usertoken = useSelector(loginSuccess);

  useEffect(() => {
    const initializeFolderView = async () => {
      await Promise.all([
        fetchFolderContents(),
        fetchAllDocuments()
      ]);
    };
    initializeFolderView();
  }, []);

  const fetchFolderContents = async (folderId = null) => {
    setLoadingFetch(true);
    try {
      const url = folderId 
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/folders/${folderId}`
        : `${process.env.NEXT_PUBLIC_BASE_URL}/folders/all`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usertoken.payload.token}`,
        },
      });
      const data = await response.json();
      if (folderId) {
        setCurrentFolder(data);
      } else {
        setFetchedFolders(data);
        setCurrentFolder(null);
      }
    } catch (error) {
      console.error('Error fetching folder contents:', error);
    } finally {
      setLoadingFetch(false);
    }
  };

  const fetchAllDocuments = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/getdocuments`, {
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

  const handleFileChange = async (event) => {
    setLoadingUpload(true);
    const files = Array.from(event.target.files);

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      if (currentFolder) {
        formData.append('folderId', currentFolder.id);
      }

      try {
        await fetch('http://192.168.30.200:8087/projects/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${usertoken.payload.token}`,
          },
          body: formData,
        });
        
        await Promise.all([
          currentFolder ? fetchFolderContents(currentFolder.id) : fetchFolderContents(),
          fetchAllDocuments()
        ]);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
    setLoadingUpload(false);
  };

  const handleCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/folders/createe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${usertoken.payload.token}`,
          },
          body: JSON.stringify({
            name: newFolderName,
            parentId: currentFolder ? currentFolder.id : null
          }),
        });
        if (response.ok) {
          await Promise.all([
            currentFolder ? fetchFolderContents(currentFolder.id) : fetchFolderContents(),
            fetchAllDocuments()
          ]);
          setNewFolderName('');
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

      await Promise.all([
        currentFolder ? fetchFolderContents(currentFolder.id) : fetchFolderContents(),
        fetchAllDocuments()
      ]);
    } catch (error) {
      console.error('Error moving file:', error);
    }
  };

  const handleFolderClick = async (folder) => {
    try {
      await Promise.all([
        fetchFolderContents(folder.id),
        fetchAllDocuments()
      ]);
      setBreadcrumbs(prev => [...prev, folder]);
    } catch (error) {
      console.error('Error navigating to folder:', error);
    }
  };

  const handleBackClick = async () => {
    try {
      if (breadcrumbs.length > 1) {
        const newBreadcrumbs = breadcrumbs.slice(0, -1);
        setBreadcrumbs(newBreadcrumbs);
        await Promise.all([
          fetchFolderContents(newBreadcrumbs[newBreadcrumbs.length - 1].id),
          fetchAllDocuments()
        ]);
      } else {
        await Promise.all([
          fetchFolderContents(),
          fetchAllDocuments()
        ]);
        setBreadcrumbs([]);
      }
    } catch (error) {
      console.error('Error navigating back:', error);
    }
  };

  const handleDragStart = (file) => {
    setDraggingFile(file);
  };

  const handleDrop = async (folder) => {
    if (draggingFile) {
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

    {/* Breadcrumbs */}
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      {breadcrumbs.length > 0 && (
        <Button startIcon={<ArrowBackIcon />} onClick={handleBackClick}>
          Back
        </Button>
      )}
      {breadcrumbs.map((folder, index) => (
        <Typography key={folder.id} variant="body1">
          {index > 0 && " > "}
          {folder.name}
        </Typography>
      ))}
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
        {(currentFolder ? currentFolder.subFolders : fetchedFolders).map((folder) => (
          <Grid item key={folder.id} xs={12} sm={6} md={4}>
            <Box
              sx={{
                mb: 4,
                width: '100%',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '16px',
                backgroundColor: '#fafafa',
                cursor: 'pointer',
              }}
              onClick={() => handleFolderClick(folder)}
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
            </Box>
          </Grid>
        ))}
      </Grid>
    )}

    {/* Display files in current folder or all documents if no folder is selected */}
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
        {(currentFolder ? currentFolder.files : uploadedFiles).map((file) => (
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
  </Box>
);
};

export default FileManager;