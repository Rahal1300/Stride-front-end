import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, CircularProgress, TextField } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const FileManager = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fetchedFiles, setFetcheddFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const usertoken = useSelector(loginSuccess);

  useEffect(() => {
    fetchDocuments();
    fetchDFolders();
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
    } finally {
      setLoadingFetch(false);
    }
  };
  const fetchDFolders = async () => {
    try {
      const response = await fetch('http://192.168.30.200:8087/folders/all', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${usertoken.payload.token}`,
        },
      });
      const data = await response.json();
      setFetcheddFiles(data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    } finally {
      setLoadingFetch(false);
    }
  };

  const handleFileChange = (event) => {
    // Handle file upload logic here
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = `data:${file.type};base64,${file.content}`;
    link.download = file.documentName;
    link.click();
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
          body: JSON.stringify( newFolderName ),
        });

        if (response.ok) {
          const newFolder = await response.json();
          setFolders([...folders, { ...newFolder, files: [] }]);  // Initialize files array
          
          setNewFolderName('');
          fetchFolders();
        } else {
          console.error('Error creating folder');
        }
      } catch (error) {
        console.error('Error creating folder:', error);
      }
    }
  };


  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    // Reordering documents within a folder
    if (source.droppableId === destination.droppableId) {
      const folderId = source.droppableId;
      const folder = folders.find((f) => f.id === folderId);
      const newDocuments = Array.from(folder.documents);
      const [removed] = newDocuments.splice(source.index, 1);
      newDocuments.splice(destination.index, 0, removed);

      const updatedFolders = folders.map((f) =>
        f.id === folderId ? { ...f, documents: newDocuments } : f
      );
      setFolders(updatedFolders);
    } else {
      // Moving document to another folder
      const sourceFolder = folders.find((f) => f.id === source.droppableId);
      const destinationFolder = folders.find((f) => f.id === destination.droppableId);
      const [removed] = sourceFolder.documents.splice(source.index, 1);
      destinationFolder.documents.splice(destination.index, 0, removed);

      const updatedFolders = folders.map((f) => {
        if (f.id === source.droppableId) return { ...f, documents: sourceFolder.documents };
        if (f.id === destination.droppableId) return { ...f, documents: destinationFolder.documents };
        return f;
      });

      setFolders(updatedFolders);
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
      </Box>

      {/* Folder Creation */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
        <TextField
          label="New Folder Name"
          variant="outlined"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          sx={{ marginBottom: '16px' }}
        />
        <Button variant="contained" color="primary" onClick={handleCreateFolder}>
          Create Folder
        </Button>
      </Box>

      {/* File and Folder Display */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-documents">
          {(provided) => (
            <Box
              ref={provided.innerRef}
              {...provided.droppableProps}
              sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}
            >
              {/* Render documents separately */}
              {uploadedFiles.slice(0, 2).map((file, index) => (
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
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
     

        {fetchedFiles.map((folder) => (
  <Droppable key={folder.id} droppableId={String(folder.id)} type="droppableDocument">
    {(provided) => (
      <Box
        ref={provided.innerRef}
        {...provided.droppableProps}
        sx={{
          border: '1px solid #ccc',
          borderRadius: '6px',
          padding: '10px',
          marginBottom: '16px',
          width: '300px',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" gutterBottom>
          {folder.name}
        </Typography>
        {/* Show 'No documents' message if the folder is empty */}
        {folder.files && folder.files.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No documents
          </Typography>
        )}
        {folder.files && folder.files.map((file, index) => (
          <Draggable key={file.id} draggableId={file.id} index={index}>
            {(provided) => (
              <Paper
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                sx={{
                  padding: '10px',
                  marginBottom: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  width: '100%',
                }}
              >
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
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </Box>
    )}
  </Droppable>
))}

      </DragDropContext>
    </Box>
  );
};

export default FileManager;
