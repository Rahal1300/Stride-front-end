import React, { useState,useEffect } from 'react';
import { Typography, TextField, Button, Grid, Box } from '@mui/material';
import DOMPurify from 'dompurify';
import { loginSuccess } from '../../../features/reducers/authReducer'
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import { useSelector } from 'react-redux';

const SupportTicket = () => {
  const [ticketData, setTicketData] = useState({
    description: '',
    title: '',
  });
  const [errors, setErrors] = useState({});
  const [snackbarSuccessOpen, setSnackbarSuccessOpen] = useState(false);
  const [snackbarErrorOpen, setSnackbarErrorOpen] = useState(false);
  const user = useSelector(loginSuccess);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTicketData({ ...ticketData, [name]: DOMPurify.sanitize(value) }); // Sanitize user input
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tickets/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.payload.token}`,
          },
          body: JSON.stringify({
            title: ticketData.title,
            description: ticketData.description,
          }),
        });

        if (response.ok) {
          setSnackbarSuccessOpen(true);
          setTicketData({ title: '', description: '' });
          setErrors({});
        } else {
          setSnackbarErrorOpen(true);
        }
      } catch (error) {
        console.error('Error submitting ticket:', error);
        setSnackbarErrorOpen(true);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = () => {
    let errors = {};
    if (!ticketData.title.trim()) {
      errors.title = 'Title is required';
    }
    if (!ticketData.description.trim()) {
      errors.description = 'Description is required';
    }
    return errors;
  };

  const handleSnackbarSuccessClose = () => {
    setSnackbarSuccessOpen(false);
  };

  const handleSnackbarErrorClose = () => {
    setSnackbarErrorOpen(false);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" align="center" gutterBottom>
        Submit a Support Ticket
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Title"
              variant="outlined"
              fullWidth
              value={ticketData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              placeholder="Enter the title of your issue"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={ticketData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              placeholder="Describe your issue in detail"
              sx={{borderColor: '#6226EF'}}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained"  sx={{bgcolor: '#6226EF', color: 'white'}}>
              Submit Ticket
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackbarSuccessOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarSuccessClose}
      >
        <SnackbarContent
          message="Ticket submitted successfully"
          style={{ backgroundColor: 'green' }}
          action={
            <Button color="secondary" size="small" onClick={handleSnackbarSuccessClose}>
              Close
            </Button>
          }
        />
      </Snackbar>
      <Snackbar
        open={snackbarErrorOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarErrorClose}
      >
        <SnackbarContent
          message="Error submitting ticket"
          style={{ backgroundColor: 'red' }}
          action={
            <Button color="secondary" size="small" onClick={handleSnackbarErrorClose}>
              Close
            </Button>
          }
        />
      </Snackbar>
    </Box>
  );
};

export default SupportTicket;
