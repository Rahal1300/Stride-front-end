import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Button, Typography, Box, Grid } from '@mui/material';
import { useSelector,useDispatch } from 'react-redux';
import CustomizedProgressBars from './loading';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import withAuth from '../../../features/reducers/withAuth';
import { loginSuccessGoogle ,logoutGoogle,parseToken,loginSuccess  } from '../../../features/reducers/authReducer';
import Container from '@mui/material/Container';
import { useGoogleLogin } from '@react-oauth/google';

const Meeting = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const usertoken = useSelector(loginSuccess);
  const router = useRouter();
  const [accesstoken, setAccesstoken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const cardRef = useRef(null);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const googleToken = useSelector((state) => state.googleToken);
  const dispatch = useDispatch()
  const [calendarEvents, setCalendarEvents] = useState([]);

  // Sample meetings data


      useEffect(() => {
     
        if (googleToken) {
          setAccesstoken(googleToken);
          fetchGoogleCalendarEvents();
        }
    
        const handleClickOutside = (event) => {
          if (cardRef.current && !cardRef.current.contains(event.target)) {
            setIsCardOpen(false);
          }
        };
    
        document.addEventListener('click', handleClickOutside);
    
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
      }, [accesstoken, isLoggedIn, cardRef, isAuthenticated, googleToken, router]);

  const CreateMeeting = () => {
    router.push('/pages/CreateMeeting') ;  };





    const fetchGoogleCalendarEvents = async () => {
      try {
        const calendarId = "primary"; // Set calendarId to "primary" to fetch events from the primary calendar only
    
        const eventsResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accesstoken}`,
            'Content-Type': 'application/json',
          },
        });
    
        if (eventsResponse.ok) {
          const eventData = await eventsResponse.json();
          // Filter events that have the extended property 'HK'
          const filteredEvents = eventData.items.filter((event) => {
            const customProperty1 = event.extendedProperties?.private?.customProperty1;
            const customProperty2 = event.extendedProperties?.private?.customProperty2;
            // return customProperty1 === 'HK' && customProperty2 === '1';
                        return customProperty1 === 'HK' ;

          });
          // Update state or do whatever you need with filteredEvents
                     setCalendarEvents(filteredEvents);

        } else {

          console.error('Error fetching events:', eventsResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching events from Google Calendar:', error);
      }
    };




    const login = useGoogleLogin({

      onSuccess: (codeResponse) => {

        setAccesstoken(codeResponse.access_token);
        setIsLoggedIn(true);
        dispatch(loginSuccessGoogle(codeResponse.access_token));
        setTimeout(() => {
        dispatch(logoutGoogle());
        setAccesstoken('');

},  3600 * 1000); 


      },
      scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
  
    }
 
 
    
    );
    const handleLogout = async () => {

      dispatch(logoutGoogle());

    }

    if (!accesstoken ) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center">
          <Container component="main" maxWidth="xs">
            <Button
              variant="contained"
              color="primary"
              onClick={login}
              style={{ backgroundColor: '#6226EF', color: '#fff', marginTop: '20px' }}
            >
              Login with Google
            </Button>
          </Container>
          <Typography variant="body1" gutterBottom style={{ marginTop: '20px', textAlign: 'center',marginRight:'180px' }}>
            To create a meeting, please log in to your Gmail account.
          </Typography>
        </Box>
      );
    }









  return (
    <div>
       {!loading ? (
        <div><CustomizedProgressBars /></div>
      ) : (
          <>
      <Box sx={{ marginTop: 2 }}>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
              Meetings
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={6}>
              <input
                type="text"
                placeholder="Search "
                style={{
                  width: '100%', // Adjusted width
                  height: '44px',
                  border: '1px solid #ccc',
                  borderRadius: '20px',
                  padding: '0 10px 0 40px',
                  backgroundImage: `url('/images/icons/search.png')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '10px center',
                  backgroundSize: '20px',
                }}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <Button
                type="submit"
                onClick={CreateMeeting}
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
                // onClick={SendAdduser}
              >
                + Add new Meeting
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ margin: 10 }}>
        {calendarEvents.map((meeting, index) => (
    <Box key={index} sx={{ marginTop: 8 }}>
    <Grid container>
    <Grid container sx={{ backgroundColor: '#F9F8F9', marginBottom: 2 }}>
  <Grid item xs={6}>
    <Typography variant="h6" component="div" sx={{ fontWeight: 600, marginRight: '10px', margin: '0px 8px 8px 0', fontSize: '14px' }}>
    {format(new Date(meeting.start.dateTime), 'MMMM dd, yyyy')}
    </Typography>
  </Grid>
  <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
    <Typography variant="h6" component="div" sx={{ fontWeight: 600, marginRight: '10px', margin: '0px 8px 8px 0', fontSize: '14px' }}>
    {format(new Date(meeting.start.dateTime), 'EEEE')}
    </Typography> 
  </Grid>
</Grid>

      
      <Grid item xs={4}>
        <Typography variant="body1" color="text.secondary">
        {format(new Date(meeting.start.dateTime), 'h:mm a')} - {format(new Date(meeting.end.dateTime), 'h:mm a')}
        </Typography>
      </Grid>
      <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            display: 'inline-block',
            borderRadius: '50%',
            width: '10px',
            height: '10px',
            marginTop:'5px',            marginRight:'5px',

            backgroundColor: getLabelColor(meeting.label),
          }}

        >         
        </Box> {meeting.label}
      </Grid>
      <Grid item xs={4}>
        <Typography variant="body1" color="text.secondary">

        </Typography>
      </Grid>
    </Grid>
  </Box>
  
      
        ))}
      </Box>
      </>
        )}
    </div>
  );
};

const getLabelColor = (label) => {
  switch (label) {
    case 'Meeting':
      return '#F44336'; // Red
    case 'Review':
      return '#2196F3'; // Blue
    case 'Game':
      return '#4CAF50'; // Green
    case 'Social':
      return '#FFC107'; // Yellow
    default:
      return '#9E9E9E'; // Grey
  }
};


export default withAuth(Meeting);