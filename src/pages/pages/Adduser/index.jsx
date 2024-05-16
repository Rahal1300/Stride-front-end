import React, { forwardRef, useState,useEffect } from 'react';
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
import withAuth from '../../../features/reducers/withAuth';
const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref}  autoComplete='off' />;
});
CustomInput.displayName = 'CustomInputuser';

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
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');

  const [selectedImage, setSelectedImage] = useState(null); // State variable to hold selected image
  const usertoken = useSelector(loginSuccess);
  const [startDate, setStartDate] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const isAuthenticated = useSelector((state) => state.isAuthenticated);



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };
  const goBack = () => {
    router.back();
  };
  const ADD = async ()  => {
    setLoading(true);
  
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Invitations/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
        body: JSON.stringify({'recipientEmail': email }),
      });
      if (response.ok) {
        setLoading(false);
        setSnackbarMessage('Invitation sent successfully');
        setSnackbarOpen(true);
      } else {
        setLoading(false);
        setSnackbarMessage('Failed to send invitation');
        setSnackbarOpen(true);      }
    } catch (error) {
      setLoading(false);
      setSnackbarMessage('Failed to send invitation');
      setSnackbarOpen(true);
            console.error('Error sending invitation:', error);
    }
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
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
          <Box sx={{ marginRight: '20px' }}>
            <Image
              src={'/images/icons/Photo.png'}
              alt="Selected Image"
              height={192}
              width={192}
            />
            <Typography variant="body1" sx={{ color: '#4379EE', fontWeight: 500, marginRight: '20px',marginBottom:'60px',marginLeft:'50px' }}>
              Profile Picture
              <label htmlFor="image-upload">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            </Typography>
            <Typography variant="body1" gutterBottom>Bio</Typography>
            <TextField fullWidth     multiline rows={5} sx={{ backgroundColor: '#F5F6FA',border:'none',width:'223px' }} />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ padding: '20px' }}>
                <Typography variant="body1" gutterBottom>Name and Last Name</Typography>
                <TextField fullWidth  sx={{ backgroundColor: '#F5F6FA' ,borderColor:'#F5F6FA' }} />
                <Typography variant="body1" gutterBottom>Phone Number</Typography>
                <TextField fullWidth  sx={{ backgroundColor: '#F5F6FA' }} />
                <Typography variant="body1" gutterBottom>Country</Typography>
                <TextField fullWidth  sx={{ backgroundColor: '#F5F6FA' }} />
                <Typography variant="body1" gutterBottom>Company</Typography>
                <TextField fullWidth  sx={{ backgroundColor: '#F5F6FA' }} />
                <Typography variant="body1" gutterBottom>Position</Typography>
                <TextField fullWidth  sx={{ backgroundColor: '#F5F6FA' }} />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ padding: '20px' }}>
                <Typography variant="body1" gutterBottom>Email</Typography>
                <TextField fullWidth  sx={{ backgroundColor: '#F5F6FA' }}   value={email}
  onChange={(e) => setEmail(e.target.value)}/>
                <Typography variant="body1" gutterBottom>Link</Typography>
                <TextField fullWidth  sx={{ backgroundColor: '#F5F6FA' }} />
                <Typography variant="body1" gutterBottom>City</Typography>
                <TextField fullWidth  sx={{ backgroundColor: '#F5F6FA' }} />
                <Typography variant="body1" gutterBottom>Date joined</Typography>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    showYearDropdown
                    showMonthDropdown
                    placeholderText="MM-DD-YYYY"
                    className="custom-datepicker-input" // Add custom CSS class
                   sx={{ width: '100%', backgroundColor:'red' }}
                   customInput={<CustomInput />}


                  />

                
                            <Typography variant="body1" gutterBottom>Years Of Experience</Typography>
                <TextField fullWidth  sx={{ backgroundColor: '#F5F6FA' }} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right',marginTop:'15px' }}>
          <Button variant="contained" color="primary" onClick={ADD} sx={{background:'#6226EF'}}>+ Add User</Button>
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
