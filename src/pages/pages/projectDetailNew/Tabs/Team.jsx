import React, { useState, useEffect } from 'react';
import { Box, Button, AvatarGroup, Avatar, ThemeProvider, createTheme, Paper, Table, TableRow, TableHead, TableBody, TableCell, TableContainer, Chip } from '@mui/material';
import { useRouter } from 'next/router'; 
import { useSelector } from 'react-redux';
import { loginSuccess } from 'src/features/reducers/authReducer'; // Adjust the import path as needed


function Team({ Team }) {
  const router = useRouter();
  const userToken = useSelector(loginSuccess);
  const base64Url = userToken?.payload?.token?.split('.')[1];
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  const { id } = router.query; 

  let isAdmin = false;
  let isTeamManager = false;
  let currentUserId = null;

  if (base64Url) {
    try {
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const decodedToken = JSON.parse(window.atob(base64));

      isAdmin = decodedToken.role === 'Admin';
      isTeamManager = decodedToken.cr === 'TeamManager';
      currentUserId = decodedToken.userId; // Assigning userId here
    } catch (error) {
      console.error('Error decoding token:', error.message);
    }
  }

  const shouldShowModifyIcon = isAdmin || isTeamManager;

  const userrole = useSelector(state => state.Role);
  const cr = useSelector(state => state.Cr);

  // Define roles that should hide the delete button
  const rolesThatCannotDelete = ['Employee', 'Free', 'Viewer'];

  // Check if the current user role and cr are such that they cannot delete
  const canDeleteUser = userrole !== 'Subscriber' || !rolesThatCannotDelete.includes(cr);

  // Custom theme for MUI components
  const customTheme = createTheme({
    components: {
      MuiAvatar: {
        styleOverrides: {
          root: {
            border: '2px solid #6226EF', 
          },
          colorDefault: {
            color: '#6226EF',
            backgroundColor: '#E2EAF8',
          },
          rounded: {
            borderRadius: 5,
          }
        }
      }
    }
  });

  // Function to get the background color for different statuses
  function getStatusStyles(status) {
    switch (status) {
      case 'Active':
        return { backgroundColor: 'rgba(0, 182, 155, 0.2)', color: '#00B69B' };
      case 'Inactive':
        return { backgroundColor: 'rgba(239, 56, 38, 0.2)', color: '#EF3826' };
      default:
        return { backgroundColor: '#FFFFFF', color: '#000000' };
    }
  }

  // Function to handle delete user
  const handleDeleteUser = async (userId) => {
    if (userId === currentUserId) {
      alert("You cannot delete yourself.");
      return;
    }
    try {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/delete/${id}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken.payload.token}`, // Adjust token extraction as needed
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const data = await response.json();
      setMessage(data.message); // Set the success message
      setError(''); // Clear any existing error message

     

    } catch (error) {
     
      setError('An error occurred while deleting the user.');
      setMessage(''); 
    }
  };

  // Handle view team button click
  const handleViewTeam = () => {
    router.push('/pages/Team/');
  };

  return (
    <ThemeProvider theme={customTheme}>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* Team display with Avatars and View Team button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          Team
          <AvatarGroup max={4} sx={{ margin: '20px 20px', marginLeft: '15px' }}>
            {Team?.map(member => (
              <Avatar key={member.id} src={`data:image/png;base64,${member.image}`} /> 
            ))}
          </AvatarGroup>
          <Button sx={{ backgroundColor: '#E2EAF8', width: '126px', height: '38px', color: '#202224', fontWeight: '550' }} onClick={handleViewTeam}>View Team</Button>
        </Box>
      </Box>

      {/* Team details table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='team details table'>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontFamily: 'Arial', fontWeight: 600, fontSize: '16px', color: '#202224' }}>Role</TableCell>
              <TableCell align='center' sx={{ fontFamily: 'Arial', fontWeight: 600, fontSize: '16px', color: '#202224' }}>Name</TableCell>
              <TableCell align='center' sx={{ fontFamily: 'Arial', fontWeight: 600, fontSize: '16px', color: '#202224' }}>Email</TableCell>
              <TableCell align='center' sx={{ fontFamily: 'Arial', fontWeight: 600, fontSize: '16px', color: '#202224' }}>Phone Number</TableCell>
              <TableCell align='center' sx={{ fontFamily: 'Arial', fontWeight: 600, fontSize: '16px', color: '#202224' }}>Status</TableCell>
              {userToken.payload.userId !== undefined && <TableCell align='center' sx={{ fontFamily: 'Arial', fontWeight: 600, fontSize: '16px', color: '#202224' }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {Team?.map(row => (
              <TableRow key={row.email}>
                <TableCell component='th' scope='row'>
                  {row.projectRole === 'TeamManager' ? 'Team Manager' : row.projectRole}
                </TableCell>
                <TableCell align='center'>{row.first_name || 'Empty'}</TableCell>
                <TableCell align='center'>{row.email}</TableCell>
                <TableCell align='center'>{row.phone_number || 'Empty'}</TableCell>
                <TableCell align='center'>
                  <Chip
                    size='small'
                    label={row.companyStatus}
                    sx={{
                      ...getStatusStyles(row.companyStatus),
                      height: 27,
                      width: 93,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      borderRadius: '4px',
                      marginRight: '10px'
                    }}
                  />
                </TableCell>
                {(row.id !== currentUserId && canDeleteUser) && (
                  <TableCell align='center'>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>handleDeleteUser(row.id)}
                      sx={{ ml: 1 }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}

export default Team;
