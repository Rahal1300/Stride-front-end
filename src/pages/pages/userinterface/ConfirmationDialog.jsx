import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

const ConfirmationDialog = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      disableBackdropClick
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
        }}
      >
       <Typography variant="h6" gutterBottom>
          Confirm Action
        </Typography>
        <Typography variant="body1" gutterBottom>
          By skipping this step, you will automatically take on the roles of Leader Manager and Team Manager. This page will only be shown once.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant="outlined" onClick={onClose} sx={{ mr: 2 }}>
            Continue setup.
          </Button>
          <Button variant="contained" onClick={onConfirm}>
            Yes, I understand. Skip for now.
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationDialog;
