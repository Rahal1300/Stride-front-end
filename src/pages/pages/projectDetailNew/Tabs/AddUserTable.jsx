import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Typography, Snackbar, Alert, Modal, Paper } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';

function AddUserTable({ onClose }) {
  const router = useRouter();
  const [recipientEmail, setUsername] = useState('');
  const [roleinproject, setRole] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const { id} = router.query;

  const handleAddUser = async () => {
    try {
      // Your logic for adding the user (e.g., API call)
      const response = await axios.post(`http://192.168.30.200:8087/Invitations/send/${id}`, { recipientEmail, roleinproject});

      if (response.status === 200) {
        setSnackbarMessage('User added successfully!');
        setSnackbarSeverity('success');
      } else {
        throw new Error('Failed to add user.');
      }

      setSnackbarOpen(true);

      // Reload the entire page after 6 seconds
      setTimeout(() => {
        window.location.reload();
      }, 6000);
    } catch (error) {
      setSnackbarMessage('Error adding user. Please try again.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);

      // Optional: reload the page after showing the error message
      setTimeout(() => {
        window.location.reload();
      }, 6000);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: '500px', width: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add User
      </Typography>
      <TextField
        label="Username"
        value={recipientEmail}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Role"
        value={roleinproject}
        onChange={(e) => setRole(e.target.value)}
        fullWidth
        select
        sx={{ mb: 2 }}
      >
        <MenuItem value="Guest"> Guest</MenuItem>
        <MenuItem value="Collaborator">Collaborator</MenuItem>
        <MenuItem value="TeamLeader">TeamLeader</MenuItem>
      </TextField>
      <Button variant="contained" onClick={handleAddUser} fullWidth sx={{ mt: 2 }}>
        Add User
      </Button>

      {/* Snackbar for success and error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function AddUserModal({ open, onClose }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="add-user-modal-title"
      aria-describedby="add-user-modal-description"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '90%',
            maxWidth: '600px',
            padding: 4,
            backgroundColor: 'background.paper',
            borderRadius: '8px',
          }}
        >
          <AddUserTable onClose={onClose} />
        </Paper>
      </Box>
    </Modal>
  );
}

export default AddUserTable;
