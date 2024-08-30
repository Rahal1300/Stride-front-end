// pages/reset-password.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const ResetPassword = () => {
  const router = useRouter();
  const { token } = router.query;

  const [newPassword, setNewPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmationPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`http://192.168.30.200:8087/api/v1/auth/ResetPassword?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword, confirmationPassword }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Password has been reset successfully.');
        router.push('/pages/login');
      } else {
        setError(result.error || 'Failed to reset password.');
      }
    } catch (error) {
      setError('An error occurred while resetting the password.');
      console.error('Error:', error);
    }
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
          <Typography variant="h5" gutterBottom>
            Reset Your Password
          </Typography>
          <form onSubmit={handlePasswordChange}>
            <TextField
              label="New Password"
              type="password"
              fullWidth
              margin="normal"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              value={confirmationPassword}
              onChange={(e) => setConfirmationPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
              Change Password
            </Button>
            {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
            {message && <Typography color="success" sx={{ mt: 2 }}>{message}</Typography>}
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPassword;
