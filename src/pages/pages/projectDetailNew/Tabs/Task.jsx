import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TaskForm from './FormTask'; 
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

function getStatusColor(status) {
    switch (status) {
      case 'Active':
        return '#00B69B';
      case 'Inactive':
        return '#6226EF';
     
      default:
        return '#FFFFFF'; // default background color
    }
  }
  
    const data = [
      {
        role: 'Developer',
        name: 'John Doe',
        email: 'john@example.com',
        joinedDate: '2023-04-01',
        lastLogin: '2023-04-20',
        progress: 80,
        status: 'In progress'
      },    {
        role: 'Developer',
        name: 'John Doe',
        email: 'john@example.com',
        joinedDate: '2023-04-01',
        lastLogin: '2023-04-20',
        progress: 80,
        status: 'Done'
      },    {
        role: 'Developer',
        name: 'John Doe',
        email: 'john@example.com',
        joinedDate: '2023-04-01',
        lastLogin: '2023-04-20',
        progress: 80,
        status: 'In progress'
      },

      {
        role: 'Developer',
        name: 'John Doe',
        email: 'john@example.com',
        joinedDate: '2023-04-01',
        lastLogin: '2023-04-20',
        progress: 80,
        status: 'Rejected'
      },
      // Add more data as needed
    ];
  
  const customTheme = createTheme({
    components: {
      MuiAvatar: {
          styleOverrides: {
            root: {
              border: '2px solid #6226EF', // Change border color here
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
  
   
function Tasks() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
  
      <Button
  variant="contained"
  onClick={handleOpen}
  sx={{
 
    marginTop:'20px',
    backgroundColor: '#E2EAF8',
    opacity: 0.7,

    color: '#202224',
marginBottom:'10px',
    borderRadius: '10%',
  }}
>
  Create a new Task
</Button>
<Divider sx={{   
        borderColor: 'gray',
        borderWidth: '1px',width:'80%',marginBottom:'20px'
      }} />

    <ThemeProvider theme={customTheme}>


    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
          <TableRow >
              <TableCell align='right'sx={{ fontFamily: 'Nunito Sans', fontWeight: 600, fontSize: '16px', color: '#202224' }} >Member Name</TableCell>
              <TableCell align='right'sx={{ fontFamily: 'Nunito Sans', fontWeight: 600, fontSize: '16px', color: '#202224' }} >Task Name</TableCell>
              <TableCell align='right'sx={{ fontFamily: 'Nunito Sans', fontWeight: 600, fontSize: '16px', color: '#202224' }} >Start Date</TableCell>
              <TableCell align='right'sx={{ fontFamily: 'Nunito Sans', fontWeight: 600, fontSize: '16px', color: '#202224' }} >DeadLine</TableCell>
              <TableCell align='right' sx={{ fontFamily: 'Nunito Sans', fontWeight: 600, fontSize: '16px', color: '#202224' }}>Progress</TableCell>
              <TableCell align='right' sx={{ fontFamily: 'Nunito Sans', fontWeight: 600, fontSize: '16px', color: '#202224' }}>STATUS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(row => (
              <TableRow key={row.email}>
                <TableCell align='right'>{row.name}</TableCell>
                <TableCell align='right'>{row.email}</TableCell>
                <TableCell align='right'>{row.joinedDate}</TableCell>
                <TableCell align='right'>{row.lastLogin}</TableCell>
                <TableCell align='right'>{row.progress}%</TableCell>
                <TableCell align='right'>
                <Chip
    size='small'
    label={row.status} 
    style={{
      backgroundColor: 
        row.status === 'Done' ? 'rgba(0, 182, 155, 0.2)' :
        row.status === 'In progress' ? 'rgba(98, 38, 239, 0.2)' :
        row.status === 'Rejected' ? 'rgba(239, 56, 38, 0.2)' : '',
      color: 
        row.status === 'Done' ? '#00B69B' :
        row.status === 'In progress' ? '#6226EF' :
        row.status === 'Rejected' ? '#EF3826' : '',
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




      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-Task-modal-title"
        aria-describedby="create-Task-modal-description"
      >
        <TaskForm onClose={handleClose} />
      </Modal>
      {/* Display existing tickets here */}
    </Box>
  );
}

export default Tasks;
