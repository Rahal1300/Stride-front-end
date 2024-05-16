import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CustomizedProgressBars from './loading';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import withAuth from '../../../features/reducers/withAuth';


const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});
const Index = () => {
  const router = useRouter();
  const { id } = router.query; // Accessing project ID from query
  const [loading, setLoading] = useState(false);

  const usertoken = useSelector(loginSuccess);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [gender, setGender] = useState('');

  const handleChange = (event) => {
    setGender(event.target.value);
  };
  const goBack = () => {
    router.back();
  };

  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };


  return (
    <ThemeProvider theme={theme}>
                      {loading ? (<CustomizedProgressBars/>):(<> 

<DatePickerWrapper>
      <Typography variant="h3" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 700, fontSize: '32px', color: '#202224', marginBottom: '20px' }}>
        User
      </Typography>
   
      <Card sx={{ padding: 10 }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right' }}>
          <Button variant="contained" color="primary" onClick={goBack} sx={{background:'#6226EF'}}>Back</Button>
        </Box>
        <Grid  container spacing={2}>
        <Grid item xs={4}>
    <Typography variant="body1" gutterBottom>First Name *</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA', borderColor: '#F5F6FA' }} />
    <Typography variant="body1" gutterBottom>Email *</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} />
    <Typography variant="body1" gutterBottom>Position (Optional)</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} />
  </Grid>
  <Grid item xs={4}>
    <Typography variant="body1" gutterBottom>Last Name *</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} />
    <Typography variant="body1" gutterBottom>Phone Number *</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} />
    <Typography variant="body1" gutterBottom>Company *</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} />
  </Grid>
  <Grid item xs={4}>
    <Typography variant="body1" gutterBottom>Channel *</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA', borderColor: '#F5F6FA' }} />
    <Typography variant="body1" gutterBottom>Source *</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} />
    <Typography variant="body1" gutterBottom>Date</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} />
  </Grid>
</Grid>
<Box >
  <Typography variant="body1" gutterBottom>Notes (Optional)</Typography>
  <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} />
</Box>
<Grid container spacing={2}>
  <Grid item xs={6}>
    <Box >
      <Typography variant="body1" gutterBottom>Referral email (Optional)</Typography>
      <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} />
    </Box>
  </Grid>
  <Grid item xs={6}>
    <Box >
    <Select
        value={gender}
        onChange={handleChange}
        fullWidth
        sx={{ backgroundColor: '#F5F6FA',marginTop:3 }}
      >
        <MenuItem value="">Select Gender</MenuItem>
        <MenuItem value="male">Male</MenuItem>
        <MenuItem value="female">Female</MenuItem>
      </Select>
    </Box>
  </Grid>
</Grid>

      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right',marginTop:'15px' }}>
          <Button variant="contained"   sx={{background:'#6226EF',width:'206px',height:'50.06px'}}>Update Lead</Button>
        </Box>
    </DatePickerWrapper>  
    <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Adjust as needed
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        // You can customize Snackbar appearance further if needed
      />
    
    
     </>) } </ThemeProvider>


  );
};

export default withAuth(Index);
