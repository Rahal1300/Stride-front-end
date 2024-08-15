import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Chip from '@mui/material/Chip';
import { useRouter } from 'next/router'; 

function Team({Team}) {
  function getStatusColor(status) {
  switch (status) {
    case 'Active':
      return '#00B69B';
    case 'Inactive':
      return '#6226EF';
   
    default:
      return '#FFFFFF'; 
  }
}

 
  const router = useRouter(); 

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
const handleViewTeam = () => {
  router.push('/pages/Team/'); 
};
  return (
    <ThemeProvider theme={customTheme}>

    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
      Team
      <AvatarGroup
  max={4}
  sx={{margin: '20px 20px',marginLeft: '15px'}}>
  
          {Team?.map(member => (
        <Avatar key={member.id} src={`data:image/png;base64,${member.image}`} /> 
      ))}
        </AvatarGroup>
        <Button sx={{ backgroundColor: '#E2EAF8', width: '126px', height: '38px', color: '#202224', fontWeight: '550' }} onClick={handleViewTeam}> View Team</Button>
      </Box>
    </Box>

    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
          <TableRow >
              <TableCell sx={{ fontFamily: 'Arial', fontWeight: 600, fontSize: '16px', color: '#202224' }}>Role</TableCell>
              <TableCell align='center'sx={{ fontFamily: 'Arial', fontWeight: 600, fontSize: '16px', color: '#202224' }} >Name</TableCell>
              <TableCell align='center'sx={{ fontFamily: 'Arial', fontWeight: 600, fontSize: '16px', color: '#202224' }} >Email</TableCell>
              {/* <TableCell align='right'sx={{ fontFamily: 'Arial', fontWeight: 600, fontSize: '16px', color: '#202224' }} >Joined Date</TableCell>
              <TableCell align='right'sx={{ fontFamily: 'Arial', fontWeight: 600, fontSize: '16px', color: '#202224' }} >Last Login</TableCell> */}
              <TableCell align='center' sx={{ fontFamily: 'Arial', fontWeight: 600, fontSize: '16px', color: '#202224' }}>phone Number</TableCell>
              <TableCell align='center' sx={{ fontFamily: 'Arial', fontWeight: 600, fontSize: '16px', color: '#202224' }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Team?.map(row => (
              <TableRow key={row.email}>
                {row.projectRole === 'TeamManager' ? (
   <TableCell component='th'  scope='row'>Team Manager</TableCell>
) : (
  <TableCell component='th' scope='row'>{row.projectRole}</TableCell>
)}

                <TableCell align='center'>{row.first_name ? row.first_name : 'Empty'}</TableCell>
                <TableCell align='center'>{row.email}</TableCell>
                {/* <TableCell align='right'>{row.joinedDate}</TableCell>
                <TableCell align='right'>{row.lastLogin}</TableCell> */}
                <TableCell align='center'>{row.phone_number ? row.phone_number : 'Empty'}</TableCell>
                <TableCell align='center'>
                <Chip
    size='small'
    label={row.status} 
    style={{
      backgroundColor: row.status === 'Active' ? 'rgba(0, 182, 155, 0.2)' :
   
      row.status === 'Inactive' ? 'rgba(239, 56, 38, 0.2)' : '',
                       color: row.status === 'Active' ? '#00B69B' :
                    
                       row.status === 'Inactive' ? '#EF3826' : '',      height: 27,
      width: 93,
      fontSize: '0.75rem',
      fontWeight: 600,
      borderRadius: '4px',marginRight: '10px' 
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
