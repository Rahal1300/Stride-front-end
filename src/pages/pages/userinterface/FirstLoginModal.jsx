import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { loginSuccess,SetRole,Cr } from '../../../features/reducers/authReducer.js';
import { useDispatch, useSelector } from 'react-redux';
import ConfirmationDialog from './ConfirmationDialog';  // Import the new component
import { useRouter } from 'next/router';

const FirstLoginModal = ({ name, isOpen, onClose, onStartJourney }) => {

  const user = useSelector(loginSuccess);
  const dispatch = useDispatch(); 
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);  // State for confirmation dialog
  const router = useRouter();

  const SetOwner = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Invitations/setOwner`, {
        method: "POST",  

        headers: {
          Authorization: `Bearer ${user.payload.token}`,
        },
      });
      if (response.ok) {
    
        dispatch(SetRole("Subscriber"));
        dispatch(Cr("Owner"));
        router.push('/pages/user');

       // onClose();
      } else {
        console.error('Error Setting owner  :', response.statusText);
      }
    } catch (error) {
      console.error('Error  Setting owner data:', error);
    }
  };




  const handleSkip = () => {
    setShowConfirmationDialog(true);  // Show confirmation dialog when skip is clicked
  };

  const handleConfirmationClose = () => {
    setShowConfirmationDialog(false);
  };

  const handleConfirmationConfirm = () => {
    setShowConfirmationDialog(false);
    SetOwner();
  };
  const handleStartJourney = () => {
    onStartJourney(); 
  };

  return (
    <>
    <Modal
      open={isOpen}
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
        <Typography variant="h5" id="first-login-modal-title" gutterBottom>
          Welcome, {name}!
        </Typography>
        <Typography variant="body1" id="first-login-modal-description" gutterBottom>
          We are thrilled to have you here. As you log in for the first time, we d like to
          take you on a guided tour to help you get started and make the most of our
          application.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Button variant="outlined" onClick={handleSkip} sx={{ mr: 2 }}>
            Skip for Now
          </Button>
          <Button variant="contained" onClick={handleStartJourney}>
            Start My Journey
          </Button>
        </Box>
      </Box>
    </Modal>
    <ConfirmationDialog 
      isOpen={showConfirmationDialog}
      onClose={handleConfirmationClose}
      onConfirm={handleConfirmationConfirm}
    />
  </>
);
};

export default FirstLoginModal;
