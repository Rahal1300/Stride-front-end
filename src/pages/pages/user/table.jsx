import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Chip from '@mui/material/Chip';
import Image from 'next/image';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import Snackbar from '@mui/material/Snackbar';
import CustomizedProgressBars from './loading';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

const TableUser = ({ Company }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [Companylist, setCompanylist] = useState(Company);
  const [filteredCompanyList, setFilteredCompanyList] = useState(Company);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const usertoken = useSelector(loginSuccess);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [decodedToken, setDecodedToken] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    setCompanylist(Company);
    setFilteredCompanyList(Company);

    if (usertoken) {
      const base64Url = usertoken.payload.token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const decodedToken = JSON.parse(window.atob(base64));
      setDecodedToken(decodedToken);
    }
  }, [usertoken, Company]);




  const isAdmin = decodedToken && decodedToken.role === 'Admin';
  const isTeamManager = decodedToken && decodedToken.cr === 'TeamManager';
  const shouldShowModifyIcon = isAdmin || isTeamManager;





  const userrole = useSelector(state => state.Role); 
  const  cr  = useSelector(state => state.Cr); 
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredList = Companylist.filter((row) =>
      row.first_name.toLowerCase().includes(query) ||
      row.email.toLowerCase().includes(query) ||
      row.company.toLowerCase().includes(query)
    );
    setFilteredCompanyList(filteredList);
  };

  const Upadterole = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${id}/update-role-to-team-manager`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });

      if (!response.ok) {
        setLoading(false);
        setSnackbarMessage('Failed to Update');
        setSnackbarOpen(true);
        setAnchorEl(null);
      } else {
        setLoading(false);
        setSnackbarMessage('Updated to Team Manager');
        setSnackbarOpen(true);
        setAnchorEl(null);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setSnackbarMessage('Error');
      setSnackbarOpen(true);
      setAnchorEl(null);
    }
  };

  const Updaterolelead = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${id}/update-role-to-leads-manager`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });

      if (!response.ok) {
        setLoading(false);
        setSnackbarMessage('Failed to Update');
        setSnackbarOpen(true);
        setAnchorEl(null);
      } else {
        setLoading(false);
        setSnackbarMessage('Updated to Leads Manager');
        setSnackbarOpen(true);
        setAnchorEl(null);
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setSnackbarMessage('Error');
      setSnackbarOpen(true);
      setAnchorEl(null);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };
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
  
  return (
    <ThemeProvider theme={customTheme}>

      {loading ? (
        <CustomizedProgressBars />
      ) : (
        <>                       


          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            style={{ marginBottom: 16,marginRight:50 ,  width: '20%', 
            height: '44px',}}
            onChange={handleSearch}  
          />
  {filteredCompanyList && filteredCompanyList.length > 0 ? (
<TableContainer component={Paper} style={{ marginTop: 16 }}>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
              message={snackbarMessage}
            />
            <Table sx={{ minWidth: 850 }} aria-label="a dense table">
              <TableHead
                sx={{
                  width: '88px',
                  height: '19px',
                  top: '276px',
                  left: '445px',
                  fontFamily: 'Arial',
                  fontWeight: 600,
                  fontSize: '14px',
                  lineHeight: '19.1px',
                  color: 'black',
                }}
              >
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Access</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
  {filteredCompanyList.map((row) => (
    <TableRow key={row.id}>
      <TableCell style={{ fontSize: '14px', color: 'black' }}>
        <Avatar
          alt='John Doe'
          sx={{ width: 44, height: 44 }}
          src={row && row.image ? `data:image/png;base64,${row.image}` : '/images/avatars/1.png'}
        />
      </TableCell>
      <TableCell style={{ fontSize: '14px', color: 'black' }}>{row.first_name}</TableCell>
      <TableCell style={{ fontSize: '14px', color: 'black' }}>{row.email}</TableCell>
      <TableCell style={{ fontSize: '14px', color: 'black' }}>{row.company}</TableCell>
      <TableCell style={{ fontSize: '14px', color: 'black' }}>
        {row.companyRole === 'LeadsManager' ? 'Leads Manager' : row.companyRole === 'TeamManager' ? 'Team Manager' : row.companyRole}
      </TableCell>
      <TableCell style={{ fontSize: '14px', color: 'black' }}>
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
            borderRadius: '4px',
            marginRight: '10px'
          }}
        />
        {(cr==='Owner')  || (cr==='TeamManager')|| (cr==='TeamManager')?(
          <>
            <Image
              src={'/images/icons/modify.png'}
              alt="Selected Image"
              width={15}
              height={15}
              onClick={(event) => handleClick(event, row.id)}
            />
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
                         { row.companyRole !=='Owner' &&(<>
                           <MenuItem onClick={() => Updaterolelead(selectedUserId)}>Update Role to Lead Manager</MenuItem>
                           <Divider sx={{ borderWidth: '1px', borderColor: '#979797' }} />
                           <MenuItem onClick={() => Upadterole(selectedUserId)}>Update Role to Team Manager</MenuItem>
                           <Divider sx={{ borderWidth: '1px', borderColor: '#979797' }} />

                           </>
                         )}
 
              <MenuItem disabled>Change status</MenuItem>
              <Divider sx={{ borderWidth: '1px', borderColor: '#979797' }} />
              <MenuItem onClick={handleClose} disabled>Add to a team</MenuItem>
              <Divider sx={{ borderWidth: '1px', borderColor: '#979797' }} />
              <MenuItem onClick={handleClose} disabled>Suspend</MenuItem>
            </Menu>
          </>
        ):(null)}
      </TableCell>
    </TableRow>
  ))}
</TableBody>


            </Table>
          </TableContainer>   ) : (
          <Paper style={{ padding: 20, marginTop: 20, textAlign: 'center' }}>
            <Typography variant="subtitle1">No users found. Please add users to the company.</Typography>
          </Paper>
        )}
      </>
    )}
      </ThemeProvider>
  );
};

export default TableUser;
