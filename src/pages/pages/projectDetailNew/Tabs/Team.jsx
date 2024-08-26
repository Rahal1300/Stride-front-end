import React from 'react';
import { Box, Button, AvatarGroup, Avatar, ThemeProvider, createTheme, Paper, Table, TableRow, TableHead, TableBody, TableCell, TableContainer, Chip } from '@mui/material';
import { useRouter } from 'next/router'; 

function Team({ Team }) {
  const router = useRouter();

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
  function getStatusStyles(companyStatus) {
    switch (companyStatus) {
      case 'Active':
        return { backgroundColor: 'rgba(0, 182, 155, 0.2)', color: '#00B69B' };
      case 'Inactive':
        return { backgroundColor: 'rgba(239, 56, 38, 0.2)', color: '#EF3826' };
      default:
        return {};
    }
  }

  // Handle view team button click
  const handleViewTeam = () => {
    router.push('/pages/Team/');
  };

  // Main return block for rendering the component
  return (
    <ThemeProvider theme={customTheme}>
      {/* Team display with Avatars and View Team button */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          Team
          <AvatarGroup max={4} sx={{ margin: '0 15px' }}>
            {Team?.map(member => (
              <Avatar key={member.id} src={`data:image/png;base64,${member.image}`} />
            ))}
          </AvatarGroup>
          <Button sx={{ backgroundColor: '#E2EAF8', width: '126px', height: '38px', color: '#202224', fontWeight: 550 }} onClick={handleViewTeam}>
            View Team
          </Button>
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
            </TableRow>
          </TableHead>
          <TableBody>
            {Team?.map(row => (
              <TableRow key={row.email}>
                <TableCell component='th' scope='row'>{row.projectRole === 'TeamManager' ? 'Team Manager' : row.projectRole}</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}

export default Team;
