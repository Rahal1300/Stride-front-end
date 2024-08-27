import React, { useState } from 'react';
import { Box, Button, TextField, MenuItem, Typography, Snackbar, Alert, Modal, Paper } from '@mui/material';
import axios from 'axios';

function AddUserTable({ onClose }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleAddUser = async () => {
    try {
      // Your logic for adding the user (e.g., API call)
      const response = await axios.post('/api/add-user', { username, role });

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
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        fullWidth
        select
        sx={{ mb: 2 }}
      >
        <MenuItem value="Admin">Admin</MenuItem>
        <MenuItem value="TeamManager">Team Manager</MenuItem>
        <MenuItem value="Employee">Employee</MenuItem>
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
