import React, { useState, useEffect } from 'react';
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { InputLabel,Select,MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import { useRouter } from 'next/router';
import DOMPurify from 'dompurify';
import BlankLayout from 'src/@core/layouts/BlankLayout'

const PaymentForm = () => {
  const router = useRouter();

  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [subscriptionTypedesired, setSubscriptionType] = useState('');

  const handleChangeSubscription = (event) => {
    setSubscriptionType(event.target.value);
  };

  const usertoken = useSelector(loginSuccess);
  const { title, price } = router.query;
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
    if (usertoken.payload.token == null && isAuthenticated === false) {
      router.push('/pages/login');
    }
    return () => clearTimeout(timeout);
  }, [successMessage,isAuthenticated]);
  if (!isAuthenticated && usertoken.payload.token === null) {
    
    return null;
  }

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    try {
      setLoading(true);

      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: {
          name: DOMPurify.sanitize(e.target.name.value),
          email: DOMPurify.sanitize(e.target.email.value),
          phone: DOMPurify.sanitize(e.target.phone.value),
        },
        
      });

      if (error) {
        console.error('Error creating payment method:', error);
        setPaymentError(error.message);
        setSuccessMessage(null);
        setSnackbarOpen(false);
        setErrorSnackbarOpen(true);

        setLoading(false); // Set loading to false in case of error

      } else {
        setPaymentError(null);

     
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/Payment/upgrade`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${usertoken.payload.token}`,
              },
              body: JSON.stringify({ companyName: e.target.Company.value,
                subscriptionType: title.toLocaleUpperCase(),
                country: e.target.Country.value ,
                state: e.target.State.value,
                phoneNumber: e.target.phone.value,
                address: e.target.Adresse.value,
                subscriptionTypedesired:subscriptionTypedesired}),
            }

          );         
          if (response.ok) {
            try {
              // Check if the response is JSON before attempting to parse
              const contentType = response.headers.get('content-type');
              if (contentType && contentType.includes('application/json')) {
                const responseData = await response.json();
        
                // Check if responseData is a valid JSON object
                if (responseData.status===200) {
                  setSnackbarOpen(true);

                  setSuccessMessage('Payment successful!');
                  setTimeout(() => {
                    router.push('/pages/login');
                  }, 5000); 
                } else {
                  console.error('Invalid JSON structure in the response:', responseData);
                  setPaymentError('Invalid server response format.');
                  setLoading(false); // Set loading to false in case of error
                  const errorMessage = await responseData.text();
                  console.error('Error response from API:', errorMessage);
              
                }
              } else {
                // Handle non-JSON response
                const textResponse = await response.text();
                setSnackbarOpen(true);

                setSuccessMessage('Payment successful!');                setTimeout(() => {
                  router.push('/pages/login');
                }, 5000); 

              }
            } catch (jsonError) {
              console.error('Error parsing JSON:', jsonError);
              setPaymentError('Error parsing server response.');
              setLoading(false); // Set loading to false in case of error
              console.error('Error response from API:', jsonError);
            }
          } else {
            console.error('Failed Payment:', response.status, response.statusText);
            setPaymentError('Failed to process payment.');
            setLoading(false); // Set loading to false in case of error
            const errorMessage = await response.text();
            console.error('Error response from API:', errorMessage);
          }
          } catch (error) {
            console.error('Error during payment request:', error);
            setPaymentError('An unexpected error occurred during payment.');
            setLoading(false); // Set loading to false in case of error
            const errorMessage = await response.text();
            console.error('Error response from API:', errorMessage);
          } finally {
            setLoading(false);
          }
      }
    } catch (error) {
      console.error('Error during payment method creation:', error);
      setPaymentError('An unexpected error occurred during payment method creation.');
      setSuccessMessage(null);
      setPaymentError('An unexpected error occurred during payment.');

      setLoading(false);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSuccessMessage(null);
  };
  const handleErrorSnackbarClose = () => {
    setErrorSnackbarOpen(false);
    setPaymentError(null);
  };
 
  const cardElementStyle = {
    base: {
      fontWeight:'20px',
      fontFamily: '"Arial", sans-serif',
      color: '#32325d',
             // Optional: Add padding for better visual appearance
      '::placeholder': {
        color: '#aab7c4',
      },

    },
    invalid: {
      color: '#fa755a',
    },
  };
  const styles = {
    centeredContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContent: {
      textAlign: 'center',
      padding: '20px',
      borderRadius: '10px',
      maxWidth: '400px',
      margin: 'auto',
      
    },
    subscriptionTitle: {
      color: '#333',
      marginBottom: '20px',
      fontWeight: 'bold',
    },
    price: {
      color: '#555',
      marginBottom: '10px',
    },
  };
  return (
    <div>
    {loading && (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          flexDirection: 'column', // Updated to column layout
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
      <CircularProgress size={70} />
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
        Processing payment...
      </Typography>
  </div>
    )}
    <Card>
         
      <Grid container justifyContent="center" mt={5}>
        <Grid item xs={12} md={6}>
          {/* Left Column (Subscription Information) */}
          <div style={styles.centeredContainer}>

          <CardContent style={styles.cardContent}>
        <Typography variant="h4" gutterBottom style={styles.subscriptionTitle}>
          Your  Subscription
        </Typography>
        <Typography variant="h6" style={styles.price}>
          {title} - ${price}/month
        </Typography>
      </CardContent>
    </div>

        </Grid>
        <Grid item xs={12} md={6}>
          {/* Right Column (Payment Form) */}
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Payment Details
            </Typography>
            <form onSubmit={handlePayment}>
              <TextField
                label="Card holder Name"
                name="name"
                fullWidth
                margin="normal"
                required
              />
               <TextField
                label="Company Name"
                name="Company"
                fullWidth
                margin="normal"
                required
              />
                  <TextField
                label="Adresse"
                name="Adresse"
                fullWidth
                margin="normal"
                required
              />
                     <TextField
                label="Country"
                name="Country"
                fullWidth
                margin="normal"
                required
              />
                 <InputLabel>Subscription Type</InputLabel>
        <Select
          value={subscriptionTypedesired}
          onChange={handleChangeSubscription}
          label="Subscription Type"
        >
          <MenuItem value="FREE">Free</MenuItem>
          <MenuItem value="BASIC">Basic</MenuItem>
          <MenuItem value="STANDARD">Standard</MenuItem>
          <MenuItem value="CUSTOM">Custom</MenuItem>
        </Select>
                      <TextField
                label="State"
                name="State"
                fullWidth
                margin="normal"
                required
              />
              <div className="form-group">
              <Typography variant="h5" gutterBottom>
Card details</Typography>
<div style={{  border: '2px solid gray ',padding:'20px', fontSize: '16px',borderRadius:'7px' }}>
<CardElement options={{ style: cardElementStyle }} />
</div>

             </div>
              <TextField label="Email" name="email" fullWidth margin="normal" required />
              <TextField label="Phone Number" name="phone" fullWidth margin="normal" required />
              {paymentError && (
  <Snackbar
    open={errorSnackbarOpen}
    autoHideDuration={5000} // Snackbar will close automatically after 5 seconds
    onClose={handleErrorSnackbarClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <SnackbarContent
      sx={{ background: '#f44336' }} // Customize the background color
      message={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '10px' }}>
            {/* You can add an icon or other content here if needed */}
          </div>
          <div>
            Payment failed. Please check your information and try again.
            {paymentError}
          </div>
        </div>
      }
      action={null} // Remove the default close icon
    />
  </Snackbar>
)}
               {successMessage && (
  <Snackbar
    open={snackbarOpen}
    autoHideDuration={5000} // Snackbar will close automatically after 5 seconds
    onClose={handleSnackbarClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <SnackbarContent
      sx={{ background: '#4caf50' }} // Customize the background color
      message={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ marginRight: '10px' }}>
            {/* You can add an icon or other content here if needed */}
          </div>
          <div>{successMessage}</div>
        </div>
      }
      action={null} // Remove the default close icon
    />
  </Snackbar>
)}

     
          {!loading && (
            <Button
              type="submit"
              disabled={!stripe}
              variant="contained"
              sx={{ bgcolor: '#6226EF', color: 'white',marginTop:2 }}
              fullWidth
            >
              Pay Now
            </Button>
          )}
            </form>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
    </div>
  );
};

export default PaymentForm;
