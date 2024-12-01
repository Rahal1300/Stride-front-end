import React, { forwardRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CustomizedProgressBars from './loading';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import withAuth from '../../../features/reducers/withAuth';

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />;
});
CustomInput.displayName = 'CustomInputLeads2';

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
  const { id } = router.query; 
  const [loading, setLoading] = useState(false);
  const usertoken = useSelector(loginSuccess);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState(null);
  const [lead, setLead] = useState('');
  const [leadUpdates, setLeadUpdates] = useState({});
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Set loading to true before making the request
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/${id}`, {
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });
        const data = await response.json();
    
        if (response.ok) {
          setLead(data);
          setLeadUpdates({ ...data, leads_id: id }); // Set leads_id in leadUpdates
        } else {
          setError(data.error || 'Failed to fetch lead data.');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch lead data.');
      } finally {
        setLoading(false); // Set loading to false after the request completes
      }
    };
  
    if (id) {
      fetchData(); // Only fetch data when id is available
    }
  }, [usertoken, id]);

  const updateLead = async () => {
    setLoading(true);
    try {
      // Create a copy of leadUpdates without user_assigned_to
      const { user_assigned_to, ...dataToUpdate } = leadUpdates;

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
        body: JSON.stringify(dataToUpdate), // Send the updated data without user_assigned_to
      });
      const data = await response.json();
      if (response.ok) {
        goBack();
        setSnackbarMessage('Lead information updated successfully.');
        setSnackbarOpen(true);
      } else {
        setSnackbarMessage(data.error || 'Failed to update lead information.');
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage('Failed to update lead information.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setGender(event.target.value);
    handleLeadChange('gender', event.target.value); // Update the leadUpdates state with the new gender
  };

  const goBack = () => {
    router.back();
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleLeadChange = (field, value) => {
    setLeadUpdates({ ...leadUpdates, [field]: value });
  };

  const deleteLead = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });

      if (response.status === 200) {
        setSnackbarMessage('Lead deleted successfully.');
        setSnackbarOpen(true);
        setOpenDialog(false);
        router.back();
      } else {
        const data = await response.json(); // Ensure you get the error message
        setSnackbarMessage(data.error || 'Failed to delete lead.');
        setSnackbarOpen(true);
        setOpenDialog(false);
      }
    } catch (error) {
      console.error("Error while deleting lead:", error); // Log any errors that occur during deletion
      setSnackbarMessage('Failed to delete lead.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <CustomizedProgressBars />
      ) : (
        <>
          <DatePickerWrapper>
            <Typography variant="h3" component="h1" sx={{ fontFamily: 'Arial', fontWeight: 700, fontSize: '32px', color: '#202224', marginBottom: '20px' }}>
              Update
            </Typography>
            <Button variant="contained" onClick={handleOpenDialog} sx={{ marginBottom: 2 }}>
              Delete Lead
            </Button>

            <Dialog
              open={openDialog}
              onClose={handleCloseDialog}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{"Delete Lead"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this lead?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                <Button onClick={deleteLead} autoFocus>
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
            <Card sx={{ padding: 10 }}>
              <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right' }}>
                <Button variant="contained" color="primary" onClick={goBack} sx={{ background: '#6226EF' }}>Back</Button>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body1" gutterBottom>First Name *</Typography>
                  <TextField fullWidth sx={{ backgroundColor: '#F5F6FA', borderColor: '#F5F6FA' }}
                    value={leadUpdates.first_name || ''}
                    onChange={(e) => handleLeadChange('first_name', e.target.value)} />
                  <Typography variant="body1" gutterBottom>Email *</Typography>
                  <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} 
                    value={leadUpdates.email || ''}
                    onChange={(e) => handleLeadChange('email', e.target.value)} />
                  <Typography variant="body1" gutterBottom>Position (Optional)</Typography>
                  <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} 
                    value={leadUpdates.position || ''}
                    onChange={(e) => handleLeadChange('position', e.target.value)} />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1" gutterBottom>Last Name *</Typography>
                  <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} 
                    value={leadUpdates.last_name || ''}
                    onChange={(e) => handleLeadChange('last_name', e.target.value)} />
                  <Typography variant="body1" gutterBottom>Phone Number *</Typography>
                  <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} type="number" 
                    value={leadUpdates.phone_number || ''}
                    onChange={(e) => handleLeadChange('phone_number', e.target.value)} />
                  <Typography variant="body1" gutterBottom>Company *</Typography>
                  <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} 
                    value={leadUpdates.company || ''}
                    onChange={(e) => handleLeadChange('company', e.target.value)} />
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body1" gutterBottom>Channel *</Typography>
                  <TextField fullWidth sx={{ backgroundColor: '#F5F6FA', borderColor: '#F5F6FA' }} 
                    value={leadUpdates.channel || ''}
                    onChange={(e) => handleLeadChange('channel', e.target.value)} />
                  <Typography variant="body1" gutterBottom>Source *</Typography>
                  <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} 
                    value={leadUpdates.source || ''}
                    onChange={(e) => handleLeadChange('source', e.target.value)} />
                  <Typography variant="body1" gutterBottom>Date</Typography>
                  <DatePicker
                    selected={leadUpdates.added_date ? new Date(leadUpdates.added_date) : null}
                    onChange={(date) => handleLeadChange('added_date', date)}
                    dateFormat="yyyy-MM-dd" // Adjust the date format as needed
                    showYearDropdown
                    scrollableYearDropdown
                    dropdownMode="select"
                    placeholderText="Select Date"
                    customInput={<CustomInput />}
                  />
                </Grid>
              </Grid>
              <Box>
                <Typography variant="body1" gutterBottom>Notes (Optional)</Typography>
                <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} 
                  value={leadUpdates.notes || ''}
                  onChange={(e) => handleLeadChange('notes', e.target.value)} />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box>
                    <Typography variant="body1" gutterBottom>Referral email (Optional)</Typography>
                    <TextField fullWidth sx={{ backgroundColor: '#F5F6FA' }} 
                      value={leadUpdates.referral_email || ''}
                      onChange={(e) => handleLeadChange('referral_email', e.target.value)} />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box>
                    <Select
                      value={gender}
                      onChange={handleChange}
                      fullWidth
                      sx={{ backgroundColor: '#F5F6FA', borderColor: '#F5F6FA', marginTop: 4 }}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                  </Box>
                </Grid>
              </Grid>
            </Card>
            <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '15px' }}>
              <Button variant="contained" onClick={updateLead} sx={{ background: '#6226EF', width: '206px', height: '50.06px' }}>
                Update Lead
              </Button>
            </Box>
          </DatePickerWrapper>  
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000} // Adjust as needed
            onClose={handleCloseSnackbar}
            message={snackbarMessage}
            // You can customize Snackbar appearance further if needed
          />
        </>
      )}
    </ThemeProvider>
  );
};

export default withAuth(Index);