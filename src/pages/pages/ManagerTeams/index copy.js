import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useRouter } from 'next/router';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import InviteToTeam from './InviteToTeam'; // Import the InviteToTeam component
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const ManagerTeam = () => {
  const usertoken = useSelector(loginSuccess);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const { t } = useTranslation(); 
  const router = useRouter();
  const { teamId } = router.query;
  const [loading, setLoading] = useState(true);
  const [listOfTeam, setlistOfTeam] = useState(null);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const handleInviteSubmit = async (invitation) => {
    try {
      const { userId, role } = invitation;
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/assignRoleToTeamMember?teamId=${teamId}&userId=${userId}&role=${role}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });
      
      if (response.ok) {
        setSnackbarMessage('Invitation sent successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      } else {
        throw new Error('Failed to send invitation');
      }
    } catch (error) {
      console.error('Error inviting to team:', error);
      setSnackbarMessage('Failed to send invitation');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (usertoken.payload.token == null && isAuthenticated === false) {
      router.push('/pages/login');
    }
    fetchTeam();
  }, [isAuthenticated]);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/with-users-and-roles`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });
      const data = await response.json();
      setlistOfTeam(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError('Error fetching team data');
      console.error('Error fetching team data:', error);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  if (!isAuthenticated && usertoken.payload.token === null) {
    return null;
  }

  const teamIdNumber = parseInt(teamId, 10);
  const selectedTeam = listOfTeam ? listOfTeam.find(team => team.id === teamIdNumber) : null;

  return (
    <div>
      <Box sx={{ padding: '16px' }}>
        {loading ? (
          <Typography>{t('Loading')}</Typography>
        ) : (
          error ? (
            <Typography color="error">{error}</Typography>
          ) : (
            selectedTeam && (
              <Grid container justifyContent="center"  >
                <Grid item xs={12} md={8}>
                  <Card sx={{ width: '100%', minHeight: '500px', overflow: 'hidden' }}>
                    <Box sx={{ padding: '16px', textAlign: 'center' }}>
                      <Typography variant="h6" component="div" gutterBottom>
                       {selectedTeam.teamName}
                      </Typography>
                      
                      
                      {selectedTeam.teamusers && (
                        <div>
                          <TableContainer>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCell>{t('Name')}</TableCell>
                                  <TableCell>{t('Email')}</TableCell>
                                  <TableCell>{t('Role')}</TableCell>
                                  <TableCell>{t('Actions')}</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {selectedTeam.teamusers.map((user) => (
                                  <TableRow key={user.id}>
                                    <TableCell>
                                      <Typography variant="subtitle1" gutterBottom>
                                        {user.first_name}
                                      </Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2" >{user.email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Typography variant="body2" >{user.role_in_team}</Typography>
                                    </TableCell>
                                    <TableCell>
                                      <Button variant="contained" color="success" size="small" sx={{ margin: '16px', textAlign: 'center' }}>
                                        {t('Modify')} 
                                      </Button>
                                      <Button variant="contained" color="error" size="small" sx={{ margin: '16px', textAlign: 'center' }}>
                                        {t('Disable')} 
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                      )}
                    </Box>
                    <InviteToTeam onSubmit={handleInviteSubmit}  />
                    <Box sx={{ padding: '16px', textAlign: 'center' }}>
                      <Button variant="contained" color="secondary">
                          {t('Disable')} {t('Team')} 
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            )
          )
        )}
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
};

export default ManagerTeam;
