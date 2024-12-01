import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Modal from '@mui/material/Modal';
import { Step1Page, Step2Page, Step3Page, Step4Page ,Step5Page } from './StepPages'; // Import step page components
import ConfirmationDialog from './ConfirmationDialog';  // Import the new component
import { loginSuccess,SetRole,Cr } from '../../../features/reducers/authReducer.js';
import { useDispatch, useSelector } from 'react-redux';
const StepContent = ({ step, handleNext }) => {
  switch (step) {
      case 0:
        return <Step1Page />;
      case 1:
        return <Step2Page />;
      case 2:
        return <Step3Page />;
        case 3:
          return <Step4Page handleNext={handleNext} />;
          case 4:
            return <Step5Page />;
      default:
        return null;
    }
  };
const StepperModal = ({ isOpen, onClose }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [invitationSent, setInvitationSent] = useState(false);
    const user = useSelector(loginSuccess);
    const dispatch = useDispatch(); 
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);  // State for confirmation dialog
  
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
          onClose();
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
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };
    const steps = ['Step 1', 'Step 2', 'Step 3' , 'Step 4', 'Step 5']; // Replace with your actual steps

  return (
    <Modal
      open={isOpen}
      disableBackdropClick 
       aria-labelledby="modal-title"
  aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 1200,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
        }}
      >
     <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box sx={{ mt: 3 }}>
        <StepContent step={activeStep} handleNext={handleNext} />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSkip}
              sx={{ mr: 2 }}
              disabled={ activeStep === 4}

            >
             Skip
            </Button>

            <Box sx={{ flexGrow: 1 }} />

            <Button
              variant="contained"
              onClick={handleBack}
              disabled={activeStep === 0 || activeStep === 4 || activeStep === 5}

              sx={{ mr: 2 }}

            >
              Back
            </Button>

            <Button
              variant="contained"
              onClick={activeStep === steps.length - 1 ? onClose : handleNext}
              disabled={activeStep === 3 && !invitationSent}
            >
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>

        {/* Confirmation Dialog */}
        <ConfirmationDialog
          isOpen={showConfirmationDialog}
          onClose={handleConfirmationClose}
          onConfirm={handleConfirmationConfirm}
        />
      </Box>
     
    </Modal>
  );
};

export default StepperModal;
