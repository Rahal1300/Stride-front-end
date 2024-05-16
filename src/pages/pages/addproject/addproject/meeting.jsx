import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import React, { useState,useEffect,useRef  } from 'react';
import { useSelector } from 'react-redux';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Circle from 'mdi-material-ui/Circle';
import EditableModal from './Modale'; // Import your modal component
import { loginSuccess } from '../../../../features/reducers/authReducer';
import { formatDate } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { Tooltip } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import LinkIcon from '@mui/icons-material/Link';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CircleIcon from '@mui/icons-material/Circle'; // Assuming you have a Circle icon component
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import Modify from './modify';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { loginSuccessGoogle,logoutGoogle } from '../../../../features/reducers/authReducer';
import { useGoogleLogin } from '@react-oauth/google';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
const getDotColor = (meetingType) => {

    switch (meetingType) {
      case 'Design Review':
        return '#8C11D4"';
      case 'Dinner':
        return '#FFB400';
        case 'Meditation':
            return'#FF4C51';
      default:
        return 'default'; // You can set a default color if needed
    }
  };

const Meeting = () => {
  const router = useRouter();
  const usertoken = useSelector(loginSuccess);
  const cardRef = useRef(null);
  const [tooltipContent, setTooltipContent] = useState(null);

  const [selectedPriority, setSelectedPriority] = useState('High');
  const [modalOpen, setModalOpen] = useState(false);
  const { id } = router.query;
  const [eventData, setEventData] = useState([]);
  const [eventData2, setEventData2] = useState([]);

  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [shouldRefetch, setShouldRefetch] = useState(false);
  const [accesstoken, setAccesstoken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [idproject, setidproject] = useState(id);
  const dispatch = useDispatch()
  const googleToken = useSelector((state) => state.googleToken);

  const { t } = useTranslation();
  const handleOpenModal = (priority) => {
    setSelectedPriority(priority);
    setModalOpen(true);
  };
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
  }

  );
  
  const FetchCalendar = async () => {
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/projects/${id}/visits`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });
      const data = await response.json();
      setEventData2(data);
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };
const findMatchingEvents = (googleEvents,backendEvents ) => {
  const matchingEvents = googleEvents.map((googleEvent) => {
    const matchingBackendEvent = backendEvents.find((backendEvent) => {
    
      return googleEvent.extendedProps.meetingLink === backendEvent.meetingLink;
    });

    return {
      idGoogle: googleEvent.id,
      idBackend: matchingBackendEvent ? matchingBackendEvent.id : null,
    };
  });

  return matchingEvents;
};
const deleteEventFromGoogleCalendar = async (googleEventId) => {
  try {
    const calendarId = 'primary';
    const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${googleEventId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });

    if (!response.ok) {
      console.error('Error deleting event from Google Calendar. Status:', response.status);
      throw new Error('Failed to delete event from Google Calendar');
    }
  } catch (error) {
    console.error('Error deleting event from Google Calendar:', error);
    throw error;
  }
};
  const Delete = async (eventId, googleEventId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/visits/delete/${eventId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const message = data.message; 
        if (googleEventId) {
          await deleteEventFromGoogleCalendar(googleEventId);
        }
        setShouldRefetch(true); 

      } else {
        console.error('Error deleting event. Status:', response.status);
  
        try {
          const errorData = await response.json();
          console.error('Error message:', errorData.message);
        } catch (jsonError) {
          console.error('Failed to parse error as JSON. Raw response:', await response.text());
        }
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };
  const fetchGoogleCalendarEvents = async () => {
 

    try {
      const calendarId = 'primary';
      const eventsResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${googleToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (eventsResponse.ok) {
        const eventData = await eventsResponse.json();

        const filteredEvents = eventData.items.filter((event) => {
          const customProperty1 = event.extendedProperties?.private?.customProperty1;
          const customProperty2 = event.extendedProperties?.private?.customProperty2;
  
          return customProperty1 === 'HK' && customProperty2 === idproject;
        });

        setEventData(filteredEvents);
      } else {
        console.error('Error fetching events from primary calendar:', eventsResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching events from Google Calendar:', error);
    }
  };
  
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleDelete = () => {
    if (selectedEvent && selectedEvent.id) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete this event?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-check-circle me-1"></i> Yes, I am!',
        cancelButtonText: '<i class="fas fa-times-circle me-1"></i> No, I\'m Not',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-danger me-3',
        },
        buttonsStyling: false,
        reverseButtons: true,
        focusConfirm: true,
      }).then((result) => {
        if (result.isConfirmed) {
          // Delete the event
          Delete(selectedEvent.idBackend, selectedEvent.id);

          Swal.fire({
            icon: 'success',
            title: 'Event Deleted!',
            showConfirmButton: false,
            timer: 1500,
          });
        }
      });
    }

    setTooltipContent(null);
    setTooltipOpen(false);
  };
 
  const headerToolbar = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
  };

  const handleTooltipClick = () => {
    setTooltipContent(null);
 
    setTooltipOpen(false);

  };
  const groupEventsByDay = () => {
    const groupedEvents = {};

    eventData.forEach((event) => {
      const dayKey = new Date(event.start.dateTime).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      if (!groupedEvents[dayKey]) {
        groupedEvents[dayKey] = {
          day: dayKey,
          events: [],
        };
      }

      groupedEvents[dayKey].events.push(event);
    });

    return Object.values(groupedEvents);
  };

  const groupedEvents = groupEventsByDay();
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const handleCloseModal2 = () => {
    setIsModifyModalOpen(false);

    
  };

  const [modifiedDetails, setModifiedDetails] = useState({
    id: '',
  
  });
  const handleIconClick = () => {

    setTooltipContent(null);
 
    setTooltipOpen(false);
    setIsModifyModalOpen(true);
  
  };

  const handleCloseModalModify = () => {
    setIsModifyModalOpen(false);
    
  };
  const handleEventAdded = () => {
  
    setShouldRefetch(true);
  };

  useEffect(() => {
      const { id } = router.query;
      setidproject(id);
  
    
    if (googleToken) {
      setAccesstoken(googleToken);}

      fetchGoogleCalendarEvents();
      FetchCalendar();
    if (shouldRefetch) {
      fetchGoogleCalendarEvents();
  
      setShouldRefetch(false);
    }
  }, [shouldRefetch,accesstoken,router.query.id]);


  const handleEventClick = (clickInfo) => {
    const { event, jsEvent } = clickInfo;
    const { title, description, start, end, extendedProps, created } = event;
    const matchingEvents = findMatchingEvents([event], eventData2);
    if (matchingEvents.length > 0) {
      const matchedEvent = matchingEvents[0];
      setSelectedEvent({
        id: event.id,
        idBackend: matchedEvent.idBackend, 
        title: event.summary,
        description: event.extendedProps.description,
        startDate: event.start,
        endDate: event.end,
        attendees: event.extendedProps.attendees.map(attendee => attendee.email), // Extracting only email addresses
        creator:event.extendedProps.creator.email,

      });

    } else {
      setSelectedEvent({
        id: event.id,
        idBackend: null, 
        title: event.summary,
        description: event.extendedProps.description,
        startDate: event.start,
        endDate: event.end,
        attendees: event.extendedProps.attendees.map(attendee => attendee.email.email), // Extracting only email addresses
        creator:event.extendedProps.creator.email,

      }); }

    if ( googleToken) {
      const tooltipContent = (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {title || 'N/A'}               

            </Typography>
            <Typography variant="body1" color="textSecondary">
              {formatDate(start, { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })} -{' '}
              {formatDate(end, { hour: 'numeric', minute: '2-digit' })}
            </Typography>
            {event.extendedProps.description && (
              <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                <strong>Description:</strong> {event.extendedProps.description}
              </Typography>
            )}
<Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
  <GroupIcon fontSize="small" /> Attendees:
  {event.extendedProps.attendees && event.extendedProps.attendees.length > 0 ? (
    event.extendedProps.attendees.map((attendee, index) => {
      return (
        <Chip
          key={index}
          label={`${attendee.email.email}`}
          style={{ marginRight: '5px', marginBottom: '5px' }}
        />
      );
    })
  ) : (
    'N/A'
  )}
</Typography>



  
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
              <LinkIcon fontSize="small" /> Hangout Link:{' '}
              <Link href={event.extendedProps.meetingLink || '#'}>
                <a target="_blank" rel="noopener noreferrer">
                  {event.extendedProps.meetingLink || 'N/A'}     {event.hangoutLink || 'N/A'}
                </a>
              </Link>{' '}
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
              <PersonOutlineIcon fontSize="small" /> Organizer: {event.extendedProps.creator.email ? event.extendedProps.creator.email : 'N/A'}
            </Typography>
          </CardContent>
        </Card>
      );
  
      setTooltipOpen(true);
      setTooltipContent(tooltipContent);
      setTooltipPosition({
        x: jsEvent.clientX + window.scrollX,
        y: jsEvent.clientY + window.scrollY,
      });
    } else {
   
      const tooltipContent = (
        <div style={{ margin: '20px', padding: '20px', textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={login}
            style={{ backgroundColor: '#4285F4', color: '#fff', marginTop: '20px' }}
          >
            Login with Google
          </Button>
        </div>
      );
  
      setTooltipOpen(true);
      setTooltipContent(tooltipContent);
      setTooltipPosition({
        x: jsEvent.clientX + window.scrollX,
        y: jsEvent.clientY + window.scrollY,
      });
    }
  };
  
  const handleLogout = async () => {

    dispatch(logoutGoogle());
    setIsLoggedIn(false) ;
  }
  return (
    
    <div style={{ marginTop: '50px' }}>
 {!googleToken ? (
        <Card style={{ margin: '20px', padding: '20px', textAlign: 'center' }}>
        
        <Button
          variant="contained"
          color="primary"
          onClick={login}
          style={{ backgroundColor: '#4285F4', color: '#fff', marginTop: '20px' }}
        >
          Login with Google
        </Button>
      </Card>
  ) : (
    <>
         <EditableModal
        open={modalOpen}
        handleClose={handleCloseModal}
        idproject={id}
        importance={selectedPriority}
        onEventAdded={handleEventAdded} 
      />


          

  <Modify
    isOpen={isModifyModalOpen}
    onClose={handleCloseModal2}
    eventData={selectedEvent}
    onEventAdded={handleEventAdded} 
    accesstoken={accesstoken}
    idproject={id}

  />

      <Grid container spacing={3}>
        {/* First Card */}
      
        {/* Second Card */}
        <Grid item xs={12} sm={12}>
          <Card >
            <CardContent>
              <Grid container spacing={2}>
                {/* First Grid: Button */}
                <Grid item xs={12} sm={6}>
                  <Typography variant='h6' sx={{ marginBottom: 2 }}>
                    {t('Manage_meetings_frequency')}
                  </Typography>
                  <Typography sx={{ marginBottom: '30px' }}>{t('Choose_recurrent_meetings')}</Typography>
                  <Button variant='contained'   onClick={() => handleOpenModal(selectedPriority)}>{t('Schedule_repetitive_meetings') }

                  </Button>
                </Grid>
                <Grid item xs={12} sm={4} display="flex" flexDirection="row" alignItems="center">
                  <RadioGroup row aria-labelledby="demo-row-radio-buttons-group-label" name="row-radio-buttons-group"
                    value={selectedPriority} // This value is used to get the selected priority
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    defaultValue="Regular"
                  >
                    <FormControlLabel value="High" control={<Radio />} label={t('High')} />
                    <FormControlLabel value="Regular" control={<Radio />} label={t('Regular')} />
                    <FormControlLabel value="Low" control={<Radio />} label={t('Low')} />
                  </RadioGroup>
                  <Grid item xs={12} sm={2}>
                    <img src="/images/meeting.png" alt="Meeting Image" />
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Typography variant='h4' style={{ marginTop: '40px' }}>
        {t('Meetings_Calendar')}
      </Typography>
      <Typography variant='body2'>{t('All_prescheduled_meetings_are_shown_in_the_calendar')}</Typography>
      <div className='demo-app-main'>
      <FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
  headerToolbar={headerToolbar}
  initialView='dayGridMonth'
  editable={true}
  selectable={true}
  selectMirror={true}
  dayMaxEvents={true}
  events={eventData.map((event) => ({
    title: event.summary,
    start: event.start.dateTime,
    description: event.description,
    end: event.end.dateTime,
    attendees: event.attendees ? event.attendees.map((attendee) => ({ email: attendee })) : [],
    creator: event.creator,
    meetingLink: event.hangoutLink,
    id: event.id,

  }))}
  eventClick={handleEventClick}
  timezone="UTC" // Set the correct timezone
  className='customFullCalendar'
/>
    
              </div>
      <Grid>
        <Typography variant='h4' style={{ marginTop: '40px' }}>
          {t('All_meetings')}
        </Typography>
        <Typography variant='body2'>{t('List_of_all_prescheduled_meetings')}</Typography>
      </Grid>
      <Card style={{ backgroundColor: 'rgba(255, 255, 255, 0)', boxShadow: 'none', border: 'none' }}>
        <CardContent>
        <TableContainer>
  <Table>
    <TableBody>
    {groupedEvents.map((group) => (
  <React.Fragment key={group.day}>
    <TableRow style={{ backgroundColor: '#F9F8F9' }}>
      <TableCell>
        <Typography style={{ fontWeight: 'bold' }}>
          {group.day}
        </Typography>
      </TableCell>
      <TableCell align="right">
        {/* The day name should be displayed for the entire row */}
        <Typography style={{ fontWeight: 'bold' }}>
          {`${new Date(group.events[0].start.dateTime).toLocaleDateString('en-US', {
            weekday: 'long',
          })}  `}
        </Typography>
      </TableCell>
    </TableRow>

    {group.events.map((event) => (
      <TableRow key={event.id}>
        <TableCell>
          <Typography>
            {`${new Date(event.start.dateTime).toLocaleString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })} - ${new Date(event.end.dateTime).toLocaleString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}`}
          </Typography>
        </TableCell>
        <TableCell>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CircleIcon
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: getDotColor(event.summary), // Use backgroundColor instead of color
                marginRight: '5px',
              }}
            />
            <Typography style={{ marginLeft: '0', marginRight: '0' }}>{event.summary}</Typography>
          </div>
        </TableCell>
      </TableRow>
    ))}
  </React.Fragment>
))}

    </TableBody>
  </Table>
</TableContainer>

        </CardContent>
      </Card>
     
      
 
      { googleToken ? (
  <Card ref={cardRef} style={{ position: 'absolute', left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px`, zIndex: 9999 }}>
    <IconButton
      style={{ position: 'absolute', top: '5px', right: '5px' }}
      color="inherit"
      size="small"
      onClick={handleTooltipClick}
    >
      <CloseIcon fontSize="small" />
    </IconButton>

    
    <IconButton
      style={{ position: 'absolute', top: '5px', right: '5px', marginRight: '60px' }}
      color="inherit"
      size="small"
      onClick={() => handleIconClick()}
    >
      <AutoFixNormalIcon fontSize="small" />
    </IconButton>
    
    <IconButton
      style={{ position: 'absolute', top: '5px', right: '5px', marginRight: '30px' }}
      color="inherit"
      size="small"
      onClick={() => handleDelete()}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>

    {tooltipContent && (
      <IconButton
        style={{ position: 'absolute', top: '5px', right: '5px' }}
        color="inherit"
        size="small"
        onClick={handleTooltipClick}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    )}

    {tooltipContent}
  </Card>
) : (
  <Card ref={cardRef} style={{ position: 'absolute', left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px`, zIndex: 9999 }}>
   

    {tooltipContent && (
      <IconButton
        style={{ position: 'absolute', top: '5px', right: '5px' }}
        color="inherit"
        size="small"
        onClick={handleTooltipClick}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    )}

    {tooltipContent}
  </Card>
)}

</>
)}

              
    </div>
  );
};

export default Meeting;