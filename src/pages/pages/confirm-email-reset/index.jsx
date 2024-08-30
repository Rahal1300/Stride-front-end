// pages/confirm-email-reset/[token].js
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorIcon from '@mui/icons-material/Error';

const ConfirmEmailReset = () => {
  const router = useRouter();
  const { token } = router.query;
  const [confirmationStatus, setConfirmationStatus] = useState('Confirming...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const confirmToken = async () => {
      if (token) {
        try {
          const response = await fetch(`http://192.168.30.200:8087/api/v1/auth/confirm-email-reset?token=${token}`);
          const result = await response.json();
          if (response.ok) {
            setConfirmationStatus('Token confirmed. You can now reset your password.');
          } else {
            setError(result.error || 'Unknown error');
            setConfirmationStatus('Token confirmation failed.');
          }
        } catch (error) {
          setError('An error occurred during confirmation.');
          setConfirmationStatus('An error occurred during confirmation.');
          console.error('Error:', error);
        }
      } else {
        setConfirmationStatus('Token not found.');
      }
    };

    confirmToken();
  }, [token]);

  const handleResetPasswordClick = () => {
    router.push(`/pages/password-reset?token=${token}`);
  };

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
              Error Confirming Token
            </Typography>
          ) : (
            <Typography variant="h5" gutterBottom>
              Token Confirmed
            </Typography>
          )}
          <Typography color={error ? 'error' : 'textSecondary'} mb={4}>
            {error || confirmationStatus}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleResetPasswordClick}
          >
            Reset Password
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConfirmEmailReset;
