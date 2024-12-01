// pages/reset-password.js
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setIsRequesting(true);

    try {
      const response = await fetch('http://192.168.30.200:8087/api/v1/auth/user/resetPasswordrequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Password reset link has been sent to your email.');
        setEmail(''); // Clear email input
      } else {
        setError(result.error || 'Failed to send password reset link.');
      }
    } catch (error) {
      setError('An error occurred while sending the password reset link.');
      console.error('Error:', error);
    } finally {
      setIsRequesting(false);
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
            Request Password Reset
          </Typography>
          <form onSubmit={handleRequestReset}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2 }}
              disabled={isRequesting}
            >
              Request Password Reset
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
