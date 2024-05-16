import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';

import Typography from '@mui/material/Typography';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';

const ModalCard = ({ open, onClose, onTeamCreated }) => {
  const usertoken = useSelector(loginSuccess);
    const [teamName, setTeamName] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarOpenerro, setSnackbarOpenerro] = useState(false);
    const router = useRouter();
    const createTeam = async () => {
        if (!teamName.trim()) {
          
          setSnackbarOpenerro(true);
          return;
        }
      
        setLoading(true);
    
        const formData = new FormData();
        formData.append('teamName', teamName);
    
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/createTeam`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${usertoken.payload.token}`,
            },
            body: formData,
          });
    
          if (response.ok) {
            setSnackbarOpen(true);
            setLoading(false);
            setTeamName('');
            onTeamCreated(formData);    
                } else {
            setLoading(false);
            setSnackbarOpenerro(true);
          }
        } catch (error) {
          setLoading(false);
          setSnackbarOpenerro(true);
          console.error('Error creating team:', error);
        }
      };
      const handleSnackbarClose = () => {
        setSnackbarOpen(false);
        setSnackbarOpenerro(false);
    
      };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'center' }}>Create Team</DialogTitle>

    <DialogContent>
        <CardContent>
          {/* Your card content here */}
        
          <TextField
            label="Team Name"
            variant="outlined"
            fullWidth
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            style={{ marginBottom: '10px' }}
            required 
          />
        <Button onClick={createTeam} variant="contained" color="primary" sx={{ display: 'block', margin: 'auto',marginTop:'5px' }}>
  Create Team
</Button>

                  <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <SnackbarContent



          sx={{ background: '#4caf50' }}
          message="Team Created Successfully"
        />
      </Snackbar>
      <Snackbar
        open={snackbarOpenerro}
        autoHideDuration={1000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <SnackbarContent
          sx={{ background: 'red' }}
          message="Please enter a team name"
          />
      </Snackbar>

        </CardContent>
    </DialogContent>
    
  </Dialog>
);
};

export default ModalCard;
