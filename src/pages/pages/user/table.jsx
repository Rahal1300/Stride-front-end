import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Chip from '@mui/material/Chip'
import Image from 'next/image';
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useSelector } from 'react-redux';
import { loginSuccess} from '../../../features/reducers/authReducer';
import Avatar from '@mui/material/Avatar';
import Snackbar from '@mui/material/Snackbar';
import CustomizedProgressBars from './loading';
const TableUser = ({ Company }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [Companylist, setCompanylist] = useState(Company);
  const [acces, setacces] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const  usertoken  = useSelector(loginSuccess);  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const Upadterole = async (id) => {
    setLoading(true);  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${id}/update-role-to-team-manager`, {
        method: 'POST', 
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });

      const data = await response.json(); 
      if (!response.ok) {
        setLoading(false);    
        setSnackbarMessage('Failed to Update');
        setSnackbarOpen(true);   
        setAnchorEl(null);
      }
      if (response.status===200) {
        setLoading(false);    
        setSnackbarMessage("Updated to Team Manager ");
        setSnackbarOpen(true); 
        setAnchorEl(null);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setSnackbarMessage('error');
      setSnackbarOpen(true); 
      setAnchorEl(null);

    }
  };
  const Updaterolelead = async (id) => {
    setLoading(true);  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${id}/update-role-to-team-lead`, {
        method: 'POST', 
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });

      const data = await response.json(); 
      if (!response.ok) {
        setLoading(false);    
        setSnackbarMessage('Failed to Update');
        setSnackbarOpen(true);   
        setAnchorEl(null);
      }
      if (response.status===200) {
        setLoading(false);    
        setSnackbarMessage("Updated to Team lead ");
        setSnackbarOpen(true); 
        setAnchorEl(null);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setSnackbarMessage('error');
      setSnackbarOpen(true); 
      setAnchorEl(null);

    }
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <> {loading ? (<CustomizedProgressBars/>):(
      <>
    <TableContainer component={Paper}>
       <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        />
      <Table sx={{ minWidth: 850 }} aria-label="a dense table">
      <TableHead  sx={{ 
    width: '88px', 
    height: '19px', 
    top: '276px', 
    left: '445px', 
    fontFamily: 'Nunito Sans', 
    fontWeight: 600, 
    fontSize: '14px', 
    lineHeight: '19.1px', 
    color: 'black' 
  }}>          <TableRow>
            <TableCell>Image</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Access</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Companylist && Companylist.map((row) => (
            <TableRow key={row.id}>
              <TableCell  style={{  fontSize: '14px', color: 'black' }}> <Avatar
      alt='John Doe'
      sx={{ width: 44, height: 44 }}
      src={row && row.image ? `data:image/png;base64,${row.image}` : '/images/avatars/1.png'}
    /></TableCell>
              <TableCell  style={{  fontSize: '14px', color: 'black' }}>{row.first_name}</TableCell>
              <TableCell  style={{  fontSize: '14px', color: 'black' }}>{row.email}</TableCell>
              <TableCell  style={{  fontSize: '14px', color: 'black' }}>{row.company}</TableCell>
              <TableCell  style={{  fontSize: '14px', color: 'black' }}>{row.companyRole}</TableCell>
              <TableCell    style={{  fontSize: '14px', color: 'black' }}> 
            
                  <Chip
                    size='small'
                    label={row.companyStatus}
                    style={{
                      backgroundColor: row.companyStatus === 'ACTIVE' ? 'rgba(0, 182, 155, 0.2)' :
                        row.companyStatus === 'Suspended' ? 'rgba(255, 167, 86, 0.3)' :
                        row.companyStatus === 'OUT' ? 'rgba(239, 56, 38, 0.2)' : '',
                      color: row.companyStatus === 'ACTIVE' ? '#00B69B' :
                        row.companyStatus === 'Suspended' ? '#FFA756' :
                        row.companyStatus === 'OUT' ? '#EF3826' : '',
                      height: 27,
                      width: 93,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      borderRadius: '4px',marginRight: '10px' 
                    }}
                  />
                        <Image
                    src={'/images/icons/modify.png'}
                    alt="Selected Image"
                    width={15}
                    height={15}
                    onClick={handleClick}

                  />
<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleClose}

  
>
<MenuItem onClick={() => Updaterolelead(row.id)}>Update Role to Lead Manager</MenuItem>
  <Divider sx={{  borderWidth: '1px',borderColor:'#979797' }}/>

  <MenuItem onClick={() => Upadterole(row.id)}>Update Role to Team Manager</MenuItem>
  <Divider sx={{  borderWidth: '1px',borderColor:'#979797' }}/>

  <MenuItem>Change status</MenuItem>
  <Divider sx={{  borderWidth: '1px',borderColor:'#979797' }}/>

  <MenuItem onClick={handleClose}>Add to a team</MenuItem>
  <Divider sx={{  borderWidth: '1px',borderColor:'#979797' }}/>

  <MenuItem onClick={handleClose}>Suspend</MenuItem>

</Menu>

    
</TableCell>            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer></>  ) }</>
  );
};

export default TableUser;
