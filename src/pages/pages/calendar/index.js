import React, { useState,useRef, useEffect } from 'react';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Button, Box, CardContent } from '@mui/material';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import 'react-datepicker/dist/react-datepicker.css';
import { Tooltip } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
 import ModifyEventModal from'../addproject/addproject/modify';
 import { useRouter } from 'next/router';


import { useGoogleLogin } from '@react-oauth/google';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector,useDispatch } from 'react-redux';
import { loginSuccessGoogle ,logoutGoogle,parseToken,loginSuccess  } from '../../../features/reducers/authReducer';

import GroupIcon from '@mui/icons-material/Group';
import LinkIcon from '@mui/icons-material/Link';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import withAuth from '../../../features/reducers/withAuth';
const DemoApp = () => {
  const user = useSelector(loginSuccess);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const router = useRouter();
  const googleToken = useSelector((state) => state.googleToken);

    const [weekendsVisible, setWeekendsVisible] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [selectedHours, setSelectedHours] = useState(1); // Default duration is 1 hour
    const [googleCalendarId, setGoogleCalendarId] = useState('primary'); // Replace 'primary' with your calendar ID
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [additionalEmails, setAdditionalEmails] = useState([]);
    const [accesstoken, setAccesstoken] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [tooltipContent, setTooltipContent] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [isCardOpen, setIsCardOpen] = useState(false);
    const dispatch = useDispatch()
    const [eventsiddelete, seteventsiddelete] = useState('');
    const [eventmodify, seteventmodify] = useState('');
    const [modifiedDetails, setModifiedDetails] = useState({
      id: '',
    
    });
    const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

    const cardRef = useRef(null);
    useEffect(() => {
      if (user.payload.token == null && isAuthenticated === false) {
        router.push('/pages/login');
      }
      if (googleToken) {
        setAccesstoken(googleToken);

    
        fetchGoogleCalendarEvents();

          } else {
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


    }, [accesstoken,isLoggedIn,cardRef,isAuthenticated,googleToken]);
    const openSnackbar = (message) => {
      setSnackbarMessage(message);
      setSnackbarOpen(true);
    };
    
  
 
    const handleEmailSelection = (emails) => {
      setAdditionalEmails(emails);

    };


    // const handleAddEvent = async () => {

    //   if (title && startDate && selectedHours) {
    //     try {
    
    //       console.log("Debug: title", title, "startDate", startDate, "selectedHours", selectedHours, "accesstoken", accesstoken);
    //       const requestId = Date.now().toString(); 
    
    //       const newEvent = {
    //         summary: title,
    //         description: description,
    //         start: {
    //           dateTime: startDate.toISOString(),
    //           timeZone: 'UTC', 
    //         },
    //         end: {
    //           dateTime: new Date(startDate.getTime() + selectedHours * 60 * 60 * 1000).toISOString(),
    //           timeZone: 'UTC',
    //         },
    
    //         attendees: [
    //           ...(additionalEmails || []).map(email => ({ email })),
    //         ],
    
    //         reminders: {
    //           'useDefault': false,
    //           'overrides': [
    //             {'method': 'email', 'minutes': 24 * 60},
    //             {'method': 'popup', 'minutes': 10}
    //           ]
    //         },
    //         extendedProperties: {
    //           private: {
    //             customProperty1: 'HK',
    //             customProperty2: 'HK',
    //           },
    //         },
    //         conferenceData: {
    //           createRequest: {
    //             requestId: 'Mirak12134', 
    //             conferenceSolutionKey: {
    //               type: 'hangoutsMeet',
    //             },
    //           },
    //         },
    //       };
    
    //       const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events?conferenceDataVersion=1`, {
    //         method: 'POST',
    //         headers: {
    //           Authorization: `Bearer ${accesstoken}`,
    //           'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify(newEvent),
    //       });
    //       console.log(accesstoken);
    //       if (response.ok) {
    //         const eventData = await response.json();
    //         console.log('Event added to Google Calendar:', eventData);
    //         openSnackbar('Event added to Google Calendar');
    
    //         setCalendarEvents([...calendarEvents, newEvent]);
    //       } else {
    //         console.error('Error adding event to Google Calendar:', response.statusText);
    //         openSnackbar('Error adding event to Google Calendar');
    //       }
    //     } catch (error) {
    //       console.error('Error adding event to Google Calendar:', error);
    
    //       if (error.response && error.response.body) {
    //         console.error('Response Body:', error.response.body);
    //       }
    
    //       openSnackbar('An unexpected error occurred. Please try again.');
    //     }
    //   } else {
    //     console.error('Missing required data for event creation');
    //     openSnackbar('Missing required data for event creation');
    //   }
    // };

    
    // const fetchGoogleCalendarEvents = async () => {
    //   try {
    //     // Fetch the list of calendars that the user has access to
    //     const calendarsResponse = await fetch(`https://www.googleapis.com/calendar/v3/users/me/calendarList`, {
    //       method: 'GET',
    //       headers: {
    //         Authorization: `Bearer ${accesstoken}`,
    //         'Content-Type': 'application/json',
    //       },
    //     });
    //     if (calendarsResponse.ok) {
    //       const calendarsData = await calendarsResponse.json();
    //       const calendars = calendarsData.items || [];
    //       console.log(calendarsData);

    //       // Fetch events for each calendar
    //       const allEvents = await Promise.all(calendars.map(async (calendar) => {
    //         const calendarId = "primary";
    //         const eventsResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
    //           method: 'GET',
    //           headers: {
    //             Authorization: `Bearer ${accesstoken}`,
    //             'Content-Type': 'application/json',
    //           },
    //         });
    //         if (eventsResponse.ok) {
    //           const eventData = await eventsResponse.json();
    //           // Filter events that have the extended property 'HK'
    //           const filteredEvents = eventData.items.filter((event) => {
    //             const customProperty1 = event.extendedProperties?.private?.customProperty1;
    //             const customProperty2 = event.extendedProperties?.private?.customProperty2;
              
    //             return customProperty1 === 'HK' && customProperty2 === '1';
    //           });
    //           return filteredEvents || [];
    //         } else {
    //           console.error(`Error fetching events from ${calendar.summary}:`, eventsResponse.statusText);
    //           return [];
    //         }
    //       }));
    
    //       // Flatten the array of events
    //       const events = allEvents.flat();
    //       setCalendarEvents(events);
    //     } else {
    //       console.error('Error fetching calendar list:', calendarsResponse.statusText);
    //     }
    //   }  catch (error) {
    //     console.error('Error fetching events from Google Calendar:', error);
    //   }
    // };
    
    // const deleteGoogleCalendarEvent = async (eventsiddelete) => {
    //   try {
    //     const calendarId = 'primary';
    //     const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventsiddelete}`, {
    //       method: 'DELETE',
    //       headers: {
    //         Authorization: `Bearer ${accesstoken}`,
    //         'Content-Type': 'application/json',
    //       },
    //     });
    //     console.log('Event ID to delete:', eventsiddelete);

    //     if (response.ok) {
    //       openSnackbar('Event deleted successfully');
    //       setTooltipContent(null); 
    //       setTooltipOpen(false); 
    //       setCalendarEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventsiddelete));

    //     } else {
    //       console.error('Error deleting event from Google Calendar:', response.statusText);
    //       openSnackbar('Error deleting event');
    //     }
    //   } catch (error) {
    //     console.error('Error deleting event from Google Calendar:', response.statusText);
    //     openSnackbar('Error deleting event');
    //   }
    // };
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
        console.log(codeResponse);





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

   

  const headerToolbar = {
    left: 'today',
    center: 'prev,title,next',
    right: 'timeGridDay,timeGridWeek,dayGridMonth',
  };



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
  
  const formattedEvents = calendarEvents.map((event) => ({
    title: event.summary,
    start: event.start.dateTime,
    end: event.end.dateTime,
    description: event.description,
    attendees: event.attendees || [],
    conferenceData: {
      conferenceId: event.conferenceData?.conferenceId || null,
      conferenceSolution: event.conferenceData?.conferenceSolution || null,
      createRequest: event.conferenceData?.createRequest || null,
      entryPoints: event.conferenceData?.entryPoints || [],
    },
    created: event.created,
    creator: event.creator,
    hangoutLink: event.hangoutLink,
    htmlLink: event.htmlLink,
    iCalUID: event.iCalUID,
    id: event.id,
    organizer: event.organizer,
    reminders: event.reminders,
    sequence: event.sequence,
    status: event.status,
    updated: event.updated,
  }));
  
  
  const handleTooltipClick = () => {
    // Close the tooltip when it is clicked
    setTooltipContent(null);
 
    setTooltipOpen(false);

  };
  
  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ marginBottom: '4px' }}>{event.title}</div>
        {event.extendedProps && event.extendedProps.description && (
          <Tooltip title={event.extendedProps.description} arrow>
            <div>
              {formatDate(event.start, { hour: 'numeric', minute: '2-digit' })} -{' '}
              {formatDate(event.end, { hour: 'numeric', minute: '2-digit' })}
            </div>
          </Tooltip>
        )}
      </div>
    );
  };

  const handleEventClick = (clickInfo) => {
    const { event, jsEvent } = clickInfo;
    const { title, description, start, end, extendedProps,created,iCalUID } = event;
      const eventId = event.extendedProps.iCalUID.split('@')[0];

    seteventsiddelete(eventId);
    seteventmodify(eventId);
    const eventInfoContent = (
<Card>
  <CardContent>
    <Typography variant="h6" gutterBottom>
      {title || 'N/A'}
    </Typography>
    <Typography variant="body1" color="textSecondary">
      {formatDate(start, { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })} -{' '}
      {formatDate(end, { hour: 'numeric', minute: '2-digit' })}
    </Typography>
    {description && (
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
        <strong>Description:</strong> {description}
      </Typography>
    )}
    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
      <GroupIcon fontSize="small" /> Attendees:
      {event.extendedProps.attendees && event.extendedProps.attendees.length > 0 ? (
        event.extendedProps.attendees.map((attendee, index) => (
          <Chip key={index} label={attendee.email} style={{ marginRight: '5px', marginBottom: '5px' }} />
        ))
      ) : (
        'N/A'
      )}
    </Typography>
    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
  <AccessTimeIcon fontSize="small" /> Created: {event.extendedProps.created ?
    new Date(event.extendedProps.created).toLocaleString() : 'N/A'}
</Typography>

    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
    <LinkIcon fontSize="small" /> Hangout Link:     <Link href={event.extendedProps.hangoutLink || '#'}>
  <a target="_blank" rel="noopener noreferrer">
{event.extendedProps.hangoutLink || 'N/A'}
  </a>
</Link>    </Typography>
    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
      <PersonOutlineIcon fontSize="small" /> Organizer: {event.extendedProps.organizer?.email || 'N/A'}
    </Typography>
  </CardContent>
</Card>
    );

    setTooltipContent(eventInfoContent);

   

    setTooltipOpen(true);
    setTooltipPosition({ x: jsEvent.clientX, y: jsEvent.clientY });

  };


  const handleCloseModal = () => {
    setIsModalOpen(false);

    
  };
  const handleOpenModifyModal = () => {
 
  };

  const handleIconClick = (eventmodify) => {

    setTooltipContent(null);
 
    setTooltipOpen(false);
    setIsModifyModalOpen(true);
    setModifiedDetails({
     id:eventmodify,
    });
  };
  const handleCloseModalModify = () => {
    setIsModifyModalOpen(false);
    
  };
  
  return (
    <Card style={{ margin: '20px' }}>
      {isModifyModalOpen && (
  <ModifyEventModal
    isOpen={isModifyModalOpen}
    onClose={handleCloseModal}
    details={modifiedDetails}
    token={accesstoken}
  />
)}
            <Button
            variant="contained"
            color="primary"
            onClick={handleLogout }
            style={{ backgroundColor: '#4285F4', color: '#fff', margin: '20px' }}
          >
          Logout
          </Button>
<Snackbar
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
  open={snackbarOpen}
  autoHideDuration={6000}
  onClose={() => setSnackbarOpen(false)}
>
  <SnackbarContent
    message={snackbarMessage}
    style={{ 
    
  backgroundColor: snackbarMessage.includes('added') || snackbarMessage.includes('delete') ? 'green' : 'red'
}    }
  />
</Snackbar>
      <CardContent>
        <Container maxWidth="xl">
            <Grid item xs={12} md={12} >
           
              <Grid item xs={12} md={9}>
              <Card ref={cardRef} style={{ position: 'absolute', left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px`, zIndex: 9999 }}>

{/* <IconButton
style={{ position: 'absolute', top: '5px', right: '5px',marginRight:'40px' }}
color="inherit"
size="small"
  // onClick={() => deleteGoogleCalendarEvent(eventsiddelete)}


>
<DeleteIcon fontSize="small" style={{  }} />
</IconButton> */}

<IconButton
style={{ position: 'absolute', top: '5px', right: '5px' }}
color="inherit"
size="small"
onClick={handleTooltipClick}
>
<CloseIcon fontSize="small" />


</IconButton>
{/* <IconButton
style={{ position: 'absolute', top: '5px', right: '5px',marginRight:'70px' }}
color="inherit"
size="small"
onClick={() => handleIconClick(eventmodify)}

>
<AutoFixNormalIcon fontSize="small" />


</IconButton> */}

{tooltipContent}
</Card>
<ModifyEventModal isOpen={isModifyModalOpen} onClose={handleCloseModalModify}  details={modifiedDetails} token={accesstoken} />

              <div className='demo-app-main'>
              <FullCalendar
                  key={JSON.stringify(calendarEvents)}
                  plugins={[dayGridPlugin, timeGridPlugin]}
                  headerToolbar={headerToolbar}
                  initialView='dayGridMonth'
                  editable={true}
                  selectable={true}
                  selectMirror={true}
                  dayMaxEvents={true}

                  weekends={weekendsVisible}
                  initialEvents={formattedEvents}
                  eventContent={renderEventContent} 

                  eventClick={handleEventClick}
                  className='customFullCalendar'
                />
     
              </div>
              
            </Grid>

   
          </Grid>
        </Container>
      </CardContent>
    </Card>
  );
};

export default withAuth(DemoApp);
