import React, { useState ,useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import SnackbarContent from '@mui/material/SnackbarContent';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../../features/reducers/authReducer';
import CreateTeam from './Components/team_user';

const Modify = ({ isOpen, onClose, eventData , onEventAdded , accesstoken , idproject,}) => {
  const usertoken = useSelector(loginSuccess);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [attendees, setAttendees] = useState([]);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [modifiedDetails, setModifiedDetails] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    
  });
  const jwtDecode = (token) => {
    if (!token) {
      return null; // Return null if token is null or undefined
    }
  
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  };
  
  
  const userEmail = usertoken.payload.token ? jwtDecode(usertoken.payload.token).sub : null;
  
  useEffect(() => {
    
    if (eventData) {

      setModifiedDetails({
        id: eventData.id || '',
        idBackend: eventData.idBackend,
        title: eventData.title || '',
        description: eventData.description || '',
        startDate: eventData.startDate || '',
        endDate: eventData.endDate || '',
        attendees: (eventData.attendees || []).map(attendee => attendee.email),
        creator:eventData.creator.email,

      });
    }

    if (shouldRefetch) {
      onEventAdded();

      setShouldRefetch(false);
    }
  }, [eventData,shouldRefetch]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModifiedDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleDateChange = (date, name) => {
    setModifiedDetails((prevDetails) => ({ ...prevDetails, [name]: date }));
  };
  const updateGoogleCalendarEvent = async (ID, modifiedDetails, accesstoken) => {
    try {
      const { title, description, startDate, endDate,attendees } = modifiedDetails;
  const attendeesWithEmailObjects = attendees.map(email => ({ email }));

      const eventBody = {
        summary: title,
        description: description,
        start: { dateTime: startDate.toISOString(), timeZone: 'UTC' },
        end: { dateTime: endDate.toISOString(), timeZone: 'UTC' },
        attendees:attendeesWithEmailObjects,
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
      const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accesstoken}`,
        },
        body: JSON.stringify(eventBody),
      });

      if (response.ok) {
        console.log('Event updated successfully');
       

      } else {
        console.error('Failed to update event:', response.statusText);

      }
    } catch (error) {
      console.error('An error occurred while updating the event:', error);
    }
  };
  
  // Usage example:
  
  const handleApplyChanges = async () => {
    try {
      const calendarId = 'primary'; // Replace 'primary' with your calendar ID
      if (!modifiedDetails.id) {
        setSnackbarMessage('Event ID is missing');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        onClose();
        return;
      }
      const formatDate = (dateString) => {
        const dateObject = new Date(dateString);
        return dateObject.toISOString().slice(0, 19).replace("T", " ");
      };
              // 
              const modifiedEvent = {
                name: modifiedDetails.title,
                description: modifiedDetails.description,
                startDate: formatDate(modifiedDetails.startDate),
                endDate: formatDate(modifiedDetails.endDate),
              };
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/visits/update/${modifiedDetails.idBackend}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modifiedEvent),

      });
      if (response.ok) {
        const ID = modifiedDetails.id;
      updateGoogleCalendarEvent(ID, modifiedDetails, accesstoken);

        setSnackbarMessage('Event modified successfully');
        setSnackbarSeverity('success');
        setShouldRefetch(true);

      } else {
        console.error('Failed to modify event');
        setSnackbarMessage('Failed to modify event');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('An error occurred while modifying the event', error);
      setSnackbarMessage('An error occurred');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      onClose();
    }
  };

  const handleEmailSelection = (selectedEmails) => {
    setAttendees(selectedEmails);
  };

  return (
    <Card>
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Modify Event</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="body2">Title:</Typography>
              <TextField
                type="text"
                name="title"
                value={modifiedDetails.title || ''}  // Set the value to the title from modifiedDetails
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2">Description:</Typography>
              <TextField
                multiline
                fullWidth
                rows={3}
                name="description"
                value={modifiedDetails.description}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2">Start Date:</Typography>
              <DatePickerWrapper>
                <DatePicker
                  selected={modifiedDetails.startDate}
                  onChange={(date) => handleDateChange(date, 'startDate')}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm:ss"  
                  customInput={<TextField variant="standard" />}
                />
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2">End Date:</Typography>
              <DatePickerWrapper>
                <DatePicker
                  selected={modifiedDetails.endDate}
                  onChange={(date) => handleDateChange(date, 'endDate')}
                  showTimeSelect
                  dateFormat="yyyy-MM-dd HH:mm:ss"  

                  customInput={<TextField variant="standard" />}
                />
              </DatePickerWrapper>
            </Grid>

            {/* <Grid item xs={12}>
              <Typography variant="body2">Attendees:</Typography>
              <CreateTeam onEmailSelect={handleEmailSelection} />
            </Grid> */}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleApplyChanges} color="primary">
            Apply Changes
          </Button>
          <Button variant="outlined" onClick={onClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
        <SnackbarContent
          message={snackbarMessage}
          severity={snackbarSeverity}
        />
      </Snackbar>
    </Card>
  );
};

export default Modify;