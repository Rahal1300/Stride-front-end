import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import LockIcon from '@mui/icons-material/Lock';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const CreateTeam = ({TeamList}) => {
  const router = useRouter();
  const usertoken = useSelector(loginSuccess);
  const [listOfTeam, setlistOfTeam] = useState(TeamList);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
useEffect(() => {
  setlistOfTeam(TeamList);
}, [TeamList]);
const handleCardClick = (teamId, enabled) => {
  if (enabled) {
    router.push({
      pathname: '/pages/ManagerTeams',
      query: {
        teamId: teamId,
      },
    });
  } else {
    handleEnableTeam(teamId);
  }
};
const handleSnackbarClose = (event, reason) => {
  if (reason === 'clickaway') {
    return;
  }
  setSnackbarOpen(false);
};
const handleEnableTeam = async (teamId) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Do you really want to enable the team?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '<i class="fas fa-check-circle me-1"></i> Yes, I am!',
    cancelButtonText: '<i class="fas fa-times-circle me-1"></i> No, I\'m Not',
    customClass: {
      confirmButton: 'btn btn-primary',
      cancelButton: 'btn btn-danger me-3',
    },
    buttonsStyling: false,
    reverseButtons: true,
    focusConfirm: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/teams/${teamId}/enable`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${usertoken.payload.token}`,
          },
        });

 
        if (response.status ===200) {
          setlistOfTeam(prevList => prevList.map(team => {
            if (team.id === teamId) {
              return { ...team, enabled: true };
            }
            return team;
          }));
          setSnackbarMessage('Team enabled successfully');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          Swal.fire({
            icon: 'success',
            title: 'Team Enabled',
            text: 'The team has been enabled successfully.',
          });
        } else {
          throw new Error('Failed to enable team');
        }
      } catch (error) {
        console.error('Error enabling team:', error);
        setSnackbarMessage('Failed to enable team');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to enable the team.',
        });
      }
    }
  });
};
  return (
    <div style={{ marginTop: '50px'
    }}>
     

      <Grid container spacing={2} >
        {listOfTeam ? (
          listOfTeam.map((team, index) => (
            <Grid item xs={12} sm={6} key={team.id} sx={{ background: 'none', boxShadow: 'none',border:'none'}}>
              <Button                 onClick={() => handleCardClick(team.id, team.enabled)}
 sx={{ width: '100%' }}>


               <Card
  sx={{
    margin: '10px',
    marginTop: '10px',
    height: '325px',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: 'none',
    
    border: 'none',
    transition: '0.3s',
    '&:hover': {
      transform: 'translateY(-15px)',
      boxShadow: 'none',
      border: 'none',
    },
    maxWidth: '500px', 
    maxHeight: '325px', 
  }}
>

                  <CardContent>
  <Box sx={{ display: 'flex' }}>
    {team.enabled ? null : <LockIcon sx={{ marginRight: 1 }} />} {/* LockIcon with marginRight */}
    </Box>

    <Box sx={{ marginLeft: 'auto' }}> 
    <Typography variant="h6" align="center" sx={{ color: '#333', marginBottom: 2 }}>
      {team.teamName}
    </Typography>{/* Aligns LockIcon to the right */}
      <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>{t('Name')}</TableCell>
                            <TableCell>{t('Email')}</TableCell>
                            <TableCell>{t('Role')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {team.teamusers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.first_name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.role_in_team}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      </TableContainer>
    </Box>
</CardContent>
                </Card>
              </Button>
            </Grid>
          ))
        ) : (
          <Typography variant="h6" color="textSecondary" align="center">
            {t('No_teams_created_yet')}
          </Typography>
        )}
      </Grid>
    </div>
  );
};

export default CreateTeam;
