import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';



const InviteToTeam = ({ onSubmit }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const handleInvite = () => {
    if (email && role) {
      onSubmit({ email, role });
      setEmail('');
      setRole('');
    }
  };

  return (
    <Box sx={{ padding: '16px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h6" gutterBottom>
          {t('Invite to Team')}
        </Typography>
      </Box>
      <TextField
        label={t('Email')}
        variant="outlined"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ marginBottom: '16px' }}
      />
      <TextField
        select
        label={t('Role')}
        variant="outlined"
        fullWidth
        value={role}
        onChange={(e) => setRole(e.target.value)}
        sx={{ marginBottom: '16px' }}
      >
        <MenuItem value="Guest">{t('Guest')}</MenuItem>
        <MenuItem value="Collaborator">{t('Collaborator')}</MenuItem>
      </TextField>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleInvite}
          disabled={!email || !role}
          sx={{ width: '20%' }}
        >
          {t('Invite')}
        </Button>
      </Box>
    </Box>
  );
};

export default InviteToTeam;

