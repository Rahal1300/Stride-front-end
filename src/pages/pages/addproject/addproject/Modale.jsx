import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import DatePicker from 'react-datepicker';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TextField from '@mui/material/TextField';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '../../../../features/reducers/authReducer';
import { loginSuccessGoogle, logoutGoogle } from '../../../../features/reducers/authReducer';
import { useGoogleLogin } from '@react-oauth/google';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import CardContent from '@mui/material/Grid';
import CreateTeam from './Components/team_user.js';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import AddCircleIcon from '@mui/icons-material/AddCircle';

export default function EditableModal({
  open,
  handleClose,
  idproject,
  importance,
  onEventAdded,
}) {
  const [date3, setDate3] = useState(new Date());
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const usertoken = useSelector(loginSuccess);
  const [accesstoken, setAccesstoken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [googleCalendarId, setGoogleCalendarId] = useState('primary'); 
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [loading, setLoading] = useState(false); 
  const dispatch = useDispatch();

  const [description, setDescription] = useState('');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [selectedHours, setSelectedHours] = useState(1); 

  const [meetingType, setMeetingType] = useState('');

  const handleChange = (event) => {
    setMeetingType(event.target.value);
  };

  const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleEmailSelection = (emails) => {
    setAdditionalEmails(emails);
  };

  const jwtDecode = (token) => {
    if (!token) {
      return null; // Return null if token is null or undefined
    }
  
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  };
  
  const userEmail = usertoken.payload.token ? jwtDecode(usertoken.payload.token).sub : null;

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      setAccesstoken(codeResponse.access_token);
      setIsLoggedIn(true);

      dispatch(loginSuccessGoogle(codeResponse.access_token));

      const currentTime = Math.floor(Date.now() / 1000);

      if (codeResponse.expires_in && codeResponse.expires_in > currentTime) {
        dispatch(logoutGoogle());
      }
    },
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',
  });

  const googleToken = useSelector((state) => state.googleToken);
  useEffect(() => {
    if (googleToken) {
      setAccesstoken(googleToken);
    }
    if (shouldRefetch) {
      // Perform re-fetch
      onEventAdded();

      // Reset shouldRefetch state
      setShouldRefetch(false);
    }
  }, [accesstoken, shouldRefetch]);

  const handleAddEvent = async () => {
    setLoading(true);

    if (!accesstoken) {
      setLoading(false);
      openSnackbar('Please login with Google first');      return;
    }

    if (title && startDate && selectedHours) {
      try {
        const newEvent = {
          summary: title,
          description: description,
          start: {
            dateTime: startDate.toISOString(),
            timeZone: 'UTC',
          },
          end: {
            dateTime: new Date(startDate.getTime() + selectedHours * 60 * 60 * 1000).toISOString(),
            timeZone: 'UTC',
          },
          attendees: [
            ...((additionalEmails || []).map((email) => ({ email }))),
            { email: userEmail }
          ],
                    reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 10 },
            ],
          },
          extendedProperties: {
            private: {
              customProperty1: 'HK',
              customProperty2: idproject,
            },
          },
          conferenceData: {
            createRequest: {
              requestId: 'Mirak12134',
              conferenceSolutionKey: {
                type: 'hangoutsMeet',
              },
            },
          },
        };

        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events?conferenceDataVersion=1&sendNotifications=true`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accesstoken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEvent),
          }
        );

        if (response.ok) {
          const eventData = await response.json();
          const userEmails = eventData.attendees.map((attendee) => attendee.email);

          const postData = {
            name: eventData.summary,
            description: eventData.description,
            visit_date: eventData.start.dateTime,
            startDate: eventData.start.dateTime,
            endDate: eventData.end.dateTime,
            meetingLink: eventData.hangoutLink,
            userEmails: userEmails,
            importance: importance,
            obligationToAssist: 2,
            department: 'Engineering',
          };

          // Append project data as JSON
          const postDataJson = JSON.stringify(postData);

          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/create_meeting/${idproject}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json', // Specify the content type
                Authorization: `Bearer ${usertoken.payload.token}`,
              },
              body: postDataJson,
            });

            if (response.ok) {
              openSnackbar('Event added to Google Calendar');
              setShouldRefetch(true);
              setLoading(false);

            } else {
              openSnackbar('Error adding event to Google Calendar to server');
              setLoading(false);

            }
          } catch (error) {
            console.error('Error occurred:', error.message);
            setLoading(false);

            openSnackbar('Error adding event to Google Calendar');
          }
        } else {
          openSnackbar('Error adding event to Google Calendar to google');
          console.error('Error adding event to Google Calendar google: ', response.statusText);
          setLoading(false);

        }
      } catch (error) {
        console.error('Error adding event to Google Calendar server:', error);
        setLoading(false);


        if (error.response && error.response.body) {
          console.error('Response Body:', error.response.body);
          setLoading(false);

        }

        openSnackbar('An unexpected error occurred. Please try again.');
        setLoading(false);

      }
    } else {
      console.error('Missing required data for event creation');
      openSnackbar('Missing required data for event creation');
      setLoading(false);

    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    handleClose();
  };

  return (
    <DatePickerWrapper>
      <Dialog open={open} onClose={handleClose}>
        {(!googleToken) ? (
          <Card style={{ margin: '20px', padding: '20px', textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={login}
              style={{ backgroundColor: '#4285F4', color: '#fff', marginTop: '20px' }}
            >
              <AddCircleIcon style={{ marginRight: '8px' }} />
              Login with Google
            </Button>
          </Card>
        ) : (
          <>
            <Card
              sx={{
                padding: '20px',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                maxHeight: '80vh',
                overflowY: 'auto',
                maxWidth: '80vw',
              }}
            >
              <DialogTitle sx={{ marginLeft: '35%' }}>ADD Meeting</DialogTitle>
              <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => handleSnackbarClose()}
              >
                <SnackbarContent
                  message={snackbarMessage}
                  style={{ backgroundColor: snackbarMessage.includes('added') ? 'green' : 'red' }}
                />
              </Snackbar>
              <DialogContent>
                <Container maxWidth="xl">
                  <Grid item xs={12} md={3}>
                    <CardContent style={{ padding: '20px' }}>
                      <TextField
                        autoFocus
                        fullWidth
                        id="Title"
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ marginBottom: 2, fontWeight: 'bold' }}
                      />
                      <TextField
                        autoFocus
                        multiline
                        fullWidth
                        id="Description"
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ marginBottom: 2 }}
                      />
                      <Typography variant="body2">Start Time</Typography>
                      <DatePickerWrapper>
                        <DatePicker
                          showTimeSelect
                          selected={startDate}
                          onChange={(date) => setStartDate(date)}
                          showYearDropdown
                          showMonthDropdown
                          placeholderText="MM-DD-YYYY"
                          id="form-layouts-separator-date"
                          sx={{ width: '100%', margin: '10px 0' }}
                        />
                      </DatePickerWrapper>

                      <CreateTeam onEmailSelect={handleEmailSelection} />

                      <FormControl sx={{ margin: '10px 0' }}>
                        <Select
                          value={selectedHours}
                          sx={{ width: '160%', margin: '10px 0' }}
                          onChange={(e) => setSelectedHours(e.target.value)}
                        >
                          {[1, 2, 3, 4, 5].map((hours) => (
                            <MenuItem key={hours} value={hours}>
                              {hours} {hours === 1 ? 'hour' : 'hours'}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </CardContent>
                  </Grid>
                </Container>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleAddEvent} color="primary">
                  ADD Event
                </Button>
              </DialogActions>
            </Card>
          </>
        )}
      </Dialog>
    </DatePickerWrapper>
  );
}
