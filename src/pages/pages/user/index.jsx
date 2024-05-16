import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box ,Grid  } from '@mui/material';
// Adjust the path according to your project structure
import Image from 'next/image';
import { MarginRounded } from '@mui/icons-material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import CustomizedProgressBars from './loading';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import TableUser from './table';
import Snackbar from '@mui/material/Snackbar';
import ImportExcelButton from './ImportExcelButton ';
import withAuth from '../../../features/reducers/withAuth';

const Index = () => {
    const router = useRouter();
    const [dateAnchorEl, setDateAnchorEl] = useState(null);
    const [typeAnchorEl, setTypeAnchorEl] = useState(null);
    const [statusAnchorEl, setStatusAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [Company, setCompany] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const usertoken = useSelector(loginSuccess);
    const [templateUrl, setTemplateUrl] = useState('/assets/templateUsers.xlsx');



  
    useEffect(() => {
    
      const fetchData = async () => {
        setLoading(true);  
        try {
          // const response = await fetch('${process.env.NEXT_PUBLIC_BASE_URL}/listuserswithoutteam', {
            // const response = await fetch('${process.env.NEXT_PUBLIC_BASE_URL}/listusers', {

          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/listuserswithoutteam`, {
            headers: {
              Authorization: `Bearer ${usertoken.payload.token}`,
            },
          });
          const data = await response.json();

          if (!response.ok) {
            setSnackbarMessage('Something went wrong !!');
            setSnackbarOpen(true);     
               }
          if (!data || data.length === 0) {
            setSnackbarMessage("Oops, you don't have any members yet");
            setSnackbarOpen(true);          }
          if (response.ok) {
            setCompany(data);
            setLoading(false);          }
      
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
    
      fetchData();

    }, [usertoken]);
 

    const handleDateOpen = (event) => {
      setDateAnchorEl(event.currentTarget);
    };
  
    const handleDateClose = () => {
      setDateAnchorEl(null);
    };
  
    const handleTypeOpen = (event) => {
      setTypeAnchorEl(event.currentTarget);
    };
  
    const handleTypeClose = () => {
      setTypeAnchorEl(null);
    };
  
    const handleStatusOpen = (event) => {
      setStatusAnchorEl(event.currentTarget);
    };
  
    const handleStatusClose = () => {
      setStatusAnchorEl(null);
    };
  
    const SendAdduser = () => {
      router.push('/pages/Adduser') ;  };
  
      const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
      };
      const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = templateUrl;
        link.download = 'templateUsers.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

    return (
      <div>
                {loading ? (<CustomizedProgressBars/>):(
                  <>
<Box sx={{ marginTop: 2 }}>
  <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
    <Grid item xs={12} sm={6}>
      <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
      Users
      </Typography>
    </Grid>
    <Grid item xs={12} container alignItems="center" spacing={2}>
  <Grid item xs={6} sm={6}>
    <input
      type="text"
      placeholder="Search"
      style={{
        width: '50%', // Adjusted width
        height: '44px',
        border: '1px solid #ccc',
        borderRadius: '20px',
        padding: '0 10px 0 40px',
        backgroundImage: `url('/images/icons/search.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '10px ',
        backgroundSize: '20px',
      }}
    />
  </Grid>
  <Grid item xs={6} sm={2}>
<ImportExcelButton/>
  </Grid>
  <Grid item xs={6} sm={2}>
    <Button
      type="submit"
      onClick={handleDownloadTemplate}

      sx={{
        color: 'white',
        height: '44px',
        textTransform: 'none',      
        background: '#6226EF',
        '&:hover': {
          background: '#6226EF',
        },
        width: '100%', // Make the button take up full width
      }}
    >
      + Download Template
    </Button>
  </Grid>
  <Grid item xs={6} sm={2}>
    <Button
      type="submit"
      sx={{
        color: 'white',
        height: '44px',
        textTransform: 'none',
        background: '#6226EF',
        '&:hover': {
          background: '#6226EF',
        },
        width: '100%', // Make the button take up full width
      }}
      onClick={SendAdduser}
    >
      + Add new user
    </Button>
  </Grid>
</Grid>

  </Grid>
</Box>


  
  
  
        <TableContainer style={{ borderRadius: 10, border: '0.6px  #D5D5D5 ', maxWidth: 818,marginTop:100 }}>
          <Table size="small" aria-label="filter options" style={{ borderCollapse: 'collapse', backgroundColor: '#FFFFFF', maxWidth: 818, borderRadius: 10, border: '0.6px solid #D5D5D5' }}>
            <TableBody>
              <TableRow>
                <TableCell >
             
                    <Image src="/images/icons/filter.png" width={20} height={20} alt="Filter Icon" />
             
                </TableCell>
                {/* Filter By label with icon */}
                <TableCell style={{ borderRight: '1px solid #CCCCCC', borderLeft: '1px solid #CCCCCC' }}>
                  <Button
                    onClick={handleDateOpen}
                    style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
                  >
                    Filter By
                  </Button>
                  <Menu anchorEl={dateAnchorEl} open={Boolean(dateAnchorEl)} onClose={handleDateClose}>
                    {/* Add date options here */}
                    <MenuItem onClick={handleDateClose}>Option 1</MenuItem>
                    <MenuItem onClick={handleDateClose}>Option 2</MenuItem>
                    <MenuItem onClick={handleDateClose}>Option 3</MenuItem>
                  </Menu>
                </TableCell>
                {/* Date filter dropdown */}
                <TableCell style={{ borderRight: '1px solid #CCCCCC', borderLeft: '1px solid #CCCCCC' }}>
                  <Button
                    onClick={handleDateOpen}
                    style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
                  >
                    Date
                  </Button>
                  <Image src="/images/icons/path.png" width={12} height={7} alt="Filter Icon" />
  
                  <Menu anchorEl={dateAnchorEl} open={Boolean(dateAnchorEl)} onClose={handleDateClose}>
                    {/* Add date options here */}
                    <MenuItem onClick={handleDateClose}>Option 1</MenuItem>
                    <MenuItem onClick={handleDateClose}>Option 2</MenuItem>
                    <MenuItem onClick={handleDateClose}>Option 3</MenuItem>
                  </Menu>
  
                  <Button
                    onClick={handleTypeOpen}
                    style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
                  >
                    Order Type
                  </Button>
                  <Image src="/images/icons/path.png" width={12} height={7} alt="Filter Icon" />
  
                  <Menu anchorEl={typeAnchorEl} open={Boolean(typeAnchorEl)} onClose={handleTypeClose}>
                    {/* Add order type options here */}
                    <MenuItem onClick={handleTypeClose}>Option 1</MenuItem>
                    <MenuItem onClick={handleTypeClose}>Option 2</MenuItem>
                    <MenuItem onClick={handleTypeClose}>Option 3</MenuItem>
                  </Menu>
                </TableCell>
                {/* Order Status filter dropdown */}
                <TableCell >
                  <Button
                    onClick={handleStatusOpen}
                    sx={{}}
  
                    style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
                  >
                     Status
                  </Button>
                  <Image src="/images/icons/path.png" width={12} height={7} alt="Filter Icon" />
  
                  <Menu anchorEl={statusAnchorEl} open={Boolean(statusAnchorEl)} onClose={handleStatusClose}   >
                    <MenuItem >Active</MenuItem>
                    <MenuItem >Suspended</MenuItem>
                    <MenuItem >Out</MenuItem>
                  </Menu>
                </TableCell>
                <TableCell >
                  <Button
                    style={{ backgroundColor: '#FFFFFF', color: '#EA0234', textTransform: 'none' }}
                  >
                    <Image src="/images/icons/replay.png" width={18} height={18} alt="Reset Icon" />
                    Reset Filter
                  </Button>
  
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer> 
      
        <Box sx={{margin :10}}>
        <TableUser Company={Company} />


        </Box>   <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        /></>  ) }
      </div>
    );
  };
  
  export default withAuth(Index);
