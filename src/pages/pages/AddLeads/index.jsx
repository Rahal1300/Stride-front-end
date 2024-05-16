import React, { forwardRef, useState, useEffect } from 'react';
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

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />;
});
CustomInput.displayName = 'CustomInputadd';

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

  const [formData, setFormData] = useState({
    First_name: '',
    Last_name: '',
    email: '',
    Position: '',
    Phone_number: '',
    company: '',
    channel: '',
    source: '',
    date: '',
    notes: '',
    referral_email: '',
    gender: '',
  });
  const handleChange = (event) => {
    const { name, value } = event.target;
    
    if (name === 'gender') {
      setGender(value); // Update gender state
    } else {
      // For other fields, update the form data state
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  const handleSubmit = async () => {
    const updatedFormData = {
      ...formData,
      gender: gender // Include the gender value from state
    };
    console.log(updatedFormData);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/create`, {
        method: 'POST',
        headers: {
          
          Authorization: `Bearer ${usertoken.payload.token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(formData),
      });
  
       // Check if the request was successful
       if (response.ok) {
       // Handle success
         setSnackbarMessage('Lead added successfully.');
        setSnackbarOpen(true);
  
     } else {
        throw new Error('Failed to add lead. Please try again.');
      }
  } catch (error) {
       setSnackbarMessage(error.message || 'Failed to add lead. Please try again.');
       setSnackbarOpen(true);
    }
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
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA', borderColor: '#F5F6FA' }}   value={formData.First_name}
  name="First_name"
  onChange={handleChange} />
    <Typography variant="body1" gutterBottom>Email *</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }}   value={formData.email}
  name="email"
  onChange={handleChange} />
    <Typography variant="body1" gutterBottom>Position (Optional)</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }}   value={formData.Position}
  name="Position"
  onChange={handleChange} />
  </Grid>
  <Grid item xs={4}>
    <Typography variant="body1" gutterBottom>Last Name *</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }}  value={formData.Phone_number}
  name="Phone_number"
  onChange={handleChange} />
    <Typography variant="body1" gutterBottom>Phone Number *</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }}  value={formData.Last_name}
  name="Last_name"
  onChange={handleChange} />
    <Typography variant="body1" gutterBottom>Company *</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} value={formData.company}
  name="company"
  onChange={handleChange}  />
  </Grid>
  <Grid item xs={4}>
    <Typography variant="body1" gutterBottom>Channel *</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA', borderColor: '#F5F6FA' }} value={formData.channel}
  name="channel"
  onChange={handleChange} />
    <Typography variant="body1" gutterBottom>Source *</Typography>
    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }}   value={formData.source}
  name="source"
  onChange={handleChange} />
    <Typography variant="body1" gutterBottom>Date</Typography>
    <DatePickerWrapper>

    <DatePicker
      showYearDropdown
      showMonthDropdown
      placeholderText="MM-DD-YYYY"
      className="custom-datepicker-input"
      selected={formData.date}
                  onChange={(date) =>
                    setFormData((prevData) => ({ ...prevData, date }))
                  }
      customInput={<CustomInput />}
    />
       </DatePickerWrapper>

  </Grid>
</Grid>
<Box >
  <Typography variant="body1" gutterBottom>Notes (Optional)</Typography>
  <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }}  value={formData.notes}
  name="notes"
  onChange={handleChange}/>
</Box>
<Grid container spacing={2}>
  <Grid item xs={6}>
    <Box sx={{ display: 'flex' }}> {/* Use flexbox to align items horizontally */}
      <Box sx={{ marginRight: 2 }}> {/* Add some margin to separate the components */}
        <Typography variant="body1" gutterBottom>Referral email (Optional)</Typography>
        <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} value={formData.referral_email}
  name="referral_email"
  onChange={handleChange} />
      </Box>
      <Box>
        <Typography variant="body1" gutterBottom>Gender</Typography>
        <Select
  value={gender}
  onChange={handleChange}
  fullWidth
  name="gender" // Add the name attribute
  sx={{ backgroundColor: '#F5F6FA', minWidth: '250px' }}
>
  <MenuItem value="">Select Gender</MenuItem>
  <MenuItem value="male">Male</MenuItem>
  <MenuItem value="female">Female</MenuItem>
</Select>

      </Box>
    </Box>
  </Grid>
  <Grid item xs={6}>
    {/* "Add Lead" button */}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
      <Button variant="contained" onClick={handleSubmit} sx={{ background: '#6226EF', width: '206px', height: '50.06px' }}>Add Lead</Button>
    </Box>
  </Grid>
</Grid>




      </Card>
   
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
