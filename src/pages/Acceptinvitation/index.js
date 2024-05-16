import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import { loginSuccess } from '../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/Error';

function AcceptInvitation() {
  const router = useRouter();
  const { uuid } = router.query;
  const { token } = router.query;

  const [confirmationStatus, setConfirmationStatus] = useState('Confirming...');
  const [error, setError] = useState(null);
  const usertoken = useSelector(loginSuccess);
  
    const handleGetStartedClick = () => {
      // Use router.push to navigate to the desired page
      router.push('https://front-two-sigma-23.vercel.app/pages/addproject/');
    };
  useEffect(() => {
    const confirmInvitation = async () => {
      if ((uuid)&&(token)) {
        try {
          const requestOptions = {
            method: 'GET',
      
          };
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Invitations/accept-platform-invitation?uuid=${uuid}&token=${token}`, requestOptions);
          const responseText = await response.text();
  
          if (response.ok) {
            // Handle success
            setConfirmationStatus('Invitation confirmed successfully');
          } else {
            // Handle failure with detailed error message
            setError(responseText || 'Unknown error ');
            setConfirmationStatus(`Email confirmation failed: ${responseText || 'Unknown error'}`);
          }
        } catch (error) {
          // Handle network errors or unexpected exceptions
          setError('An error occurred during confirmation.');
          setConfirmationStatus('An error occurred during confirmation.');
          console.error('Error:', error);
        }
      } else {
        setConfirmationStatus('Token not found.');
      }
    };
  
    confirmInvitation();
  }, [uuid, usertoken,token]);
  

  return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#f4f4f4',
      padding: 4,
    }}
  >
    <Card sx={{ width: '80%', maxWidth: 500, textAlign: 'center', boxShadow: 8, p: 4 }}>
      <CardContent>
        {error ? (
          <ErrorIcon color="error" sx={{ fontSize: 100, mb: 2 }} />
        ) : (
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 100, mb: 2 }} />
        )}
        {error ? (
          <Typography variant="h5" gutterBottom color="error">
            Error Confirming Invitation
          </Typography>
        ) : (
          <Typography variant="h5" gutterBottom>
            Invitation Confirmed
          </Typography>
        )}
        <Typography color={error ? 'error' : 'textSecondary'} mb={4}>
          {error || confirmationStatus}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleGetStartedClick}
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  </Box>
  );
}

AcceptInvitation.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default AcceptInvitation;
