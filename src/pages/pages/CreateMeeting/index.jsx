import React, { useState, useEffect,forwardRef } from 'react'; // Import useEffect
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CustomizedProgressBars from './loading';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import 'react-datepicker/dist/react-datepicker.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DatePicker from 'react-datepicker'; // Import DatePicker component
import { useSelector, useDispatch } from 'react-redux'; // Import useDispatch
import { loginSuccessGoogle ,logoutGoogle,parseToken,loginSuccess  } from '../../../features/reducers/authReducer';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Container from '@mui/material/Container'; // Import Container
import { useGoogleLogin } from '@react-oauth/google';
import withAuth from '../../../features/reducers/withAuth';



const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />;
});
CustomInput.displayName = 'CustomInputmeeting';

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

const teams = [
  {
    name: 'Team 1',
    users: [
      { id: 1, name: 'John Doe', image: '/images/avatars/1.png', email: 'mouhebbenelwafi@gmail.com' },
      { id: 2, name: 'Jane Doe', image: '/images/avatars/2.png', email: 'team1_user2@gmail.com' }
    ]
  },
  {
    name: 'Team 2',
    users: [
      { id: 3, name: 'Alice Smith', image: '/images/avatars/3.png', email: 'team2_user1@gmail.com' },
      { id: 4, name: 'Bob Johnson', image: '/images/avatars/4.png', email: 'team2_user2@gmail.com' }
    ]
  },
  {
    name: 'Team 3',
    users: [
      { id: 5, name: 'Emily Davis', image: '/images/avatars/5.png', email: 'team3_user1@gmail.com' },
      { id: 6, name: 'Michael Wilson', image: '/images/avatars/6.png', email: 'team3_user2@gmail.com' }
    ]
  }
];
// Mock data for users
const users = [
  { id: 1, name: 'John Doe', image: '/images/avatars/1.png',email:'waaw1@gmail.com' },
  { id: 2, name: 'Jane Doe', image: '/images/avatars/2.png',email:'waaw2@gmail.com' },
  { id: 3, name: 'Alice Smith', image: '/images/avatars/3.png',email:'waaw3@gmail.com' },
];
const projects = [
  { id: 1, name: 'Project Elec' },
  { id: 2, name: 'Project Fluid' },
  { id: 3, name: 'Project Robotics' },
  { id: 4, name: 'Project AI' },
  { id: 5, name: 'Project IoT' },
  // Add more projects as needed
];

const Index = () => {
  const [meetingName, setMeetingName] = useState('');
  const [meetingNameError, setMeetingNameError] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [startDateError, setStartDateError] = useState('');
  const [duration, setDuration] = useState('1');
  const [members, setMembers] = useState([]);
  const [selectedProject , setSelectedProject] = useState('');
  const [SelectedProjectError, setSelectedProjectError] = useState('');

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [membersError, setMembersError] = useState('');
  const [mandatory, setMandatory] = useState('Yes');
  const usertoken = useSelector(loginSuccess);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [selectedTeamsError, setselectedTeamsError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedUsersError, setselectedUsersError] = useState('');

  const router = useRouter();
  const googleToken = useSelector((state) => state.googleToken);
  const dispatch = useDispatch(); // Define dispatch function
  const [accesstoken, setAccesstoken] = useState('');

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

 
setTimeout(() => {
  dispatch(logoutGoogle());
  setAccesstoken('');

},  3600 * 1000); 
    },
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events',

  });


  const handleCreateMeeting = async () => {
    let hasError = false;
    setLoading(true);

    if (!meetingName.trim()) {
              setLoading(false);

      setMeetingNameError('Please enter a meeting name.');
      hasError = true;
    } else {
      setMeetingNameError('');
    }

    if (!description.trim()) {        setLoading(false);

      setDescriptionError('Please enter a description for the meeting.');
      hasError = true;
    } else {
      setDescriptionError('');
    }

    // Validate start date
    if (!startDate) {        setLoading(false);

      setStartDateError('Please select a start date for the meeting.');
      hasError = true;
    } else {
      setStartDateError('');
    }
    if (selectedProject.length === 0) {       
       setLoading(false);

      setSelectedProjectError('Please select at least one Project.');
      hasError = true;
      
    } else {
      setSelectedProjectError('');
    }    if (selectedUsers.length === 0) {        setLoading(false);

      setselectedUsersError('Please select at least one member or team for the meeting.');
      hasError = true;
      
    } else {
      setselectedUsersError('');
    }
    if (selectedTeams.length === 0) {        setLoading(false);

      setselectedTeamsError('Please select at least  team for the meeting.');
      hasError = true;
    
    } else {
      setselectedTeamsError('');
    }
    if (hasError) {
      setLoading(false);

      return;
    }


    const selectedTeamsEmails = [
      // Extract user emails from selected teams
      ...(selectedTeams || []).reduce((emails, teamName) => {
        const team = teams.find(team => team.name === teamName);
        if (team && team.users) {
          return [...emails, ...team.users.map(user => user.email),userEmail];
        }
        return emails;
      }, [])
    ];
    const attendees = [
      // Map over selected users and create objects with the required structure
      ...selectedUsers.map((user) => user),
      // Map over selected teams and extract user emails
      ...selectedTeams.flatMap((teamName) => {
        const team = teams.find((team) => team.name === teamName);
        if (team && team.users) {
          return team.users.map((user) => user.email);
        }
        return [];
      }),
      // Add user's email
      userEmail, 
    ];
    
    const newEvent = {
      summary: meetingName,
      description: description,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(startDate.getTime() + Number(duration) * 60 * 60 * 1000).toISOString(),
        timeZone: 'UTC',
      },
      
      attendees: attendees.map(email => ({ email })), // Adjusted the structure of attendees

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
          customProperty2: selectedProject, // Assuming idproject is available in your scope
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
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendNotifications=true`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${googleToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newEvent),
        }
      );
  
      // Handle response as needed
      if (response.ok) {
        setSnackbarSeverity('success');
        setSnackbarMessage('Event created successfully!');
        setMeetingName('');
      setDescription('');
      setStartDate(null);
      setDuration('1');
      setSelectedProject('');
      setSelectedTeams([]);
      setSelectedUsers([]);
      } else {
        setLoading(false);

        setSnackbarSeverity('error');

        setSnackbarMessage(`Error creating Google Meet event: ${response.statusText}`);
      }
    } catch (error) {
      setLoading(false);

      setSnackbarSeverity('error');

      setSnackbarMessage(`Error creating Google Meet event: ${error.message}`);
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
    }
  };
  const isAuthenticated = useSelector((state) => state.isAuthenticated);

  useEffect(() => {
    if (usertoken.payload.token == null && isAuthenticated === false) {
      router.push('/pages/login');
    }
    if (googleToken) {
      setAccesstoken(googleToken);
        } 
  
 

      }, [isAuthenticated, usertoken]); // Include usertoken as a dependency
      const openSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };
  
  const goBack = () => {
    router.back();
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
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
    
    <ThemeProvider theme={theme}>
      
      <Typography variant="h3" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 700, fontSize: '32px', color: '#202224', marginBottom: '20px' }}>
        Meeting 
      </Typography>
      {loading && (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
      <CircularProgress color="primary" />
    </Box>
  )}
   <Button
            variant="contained"
            color="primary"
            onClick={handleLogout }
            style={{ backgroundColor: '#6226EF', color: '#fff', margin: '20px' }}
          >
          Logout
          </Button>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Card sx={{ padding: 10 }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right' }}>
          <Button variant="contained" color="primary" onClick={goBack} sx={{background:'#6226EF'}}>Back</Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
    
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ padding: '20px' }}>
                <Typography variant="body1" gutterBottom>Meeting Name</Typography>
                <TextField
                  fullWidth
                  value={meetingName}
                  onChange={(e) => setMeetingName(e.target.value)}
                  error={!!meetingNameError}
                  helperText={meetingNameError}
                  sx={{ backgroundColor: '#F5F6FA' ,borderColor:'#F5F6FA' }}
                />
                <Typography variant="body1" gutterBottom>Description</Typography>
                <TextField
                  fullWidth
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  error={!!descriptionError}
                  helperText={descriptionError}
                  sx={{ backgroundColor: '#F5F6FA' }}
                />
                <Typography variant="body1" gutterBottom>Team</Typography>
                <Select
  multiple
  value={selectedTeams}
  error={!!selectedTeamsError}
  helperText={selectedTeamsError}
  onChange={(e) => setSelectedTeams(e.target.value)}
  fullWidth
  sx={{ backgroundColor: '#F5F6FA' }}
>
  {teams.map((team) => (
    <MenuItem key={team.name} value={team.name}>
      {team.name}
    </MenuItem>
  ))}
</Select>

                <Typography variant="body1" gutterBottom>Users</Typography>
                <Select
                  multiple
                  
                      
                  error={!!selectedUsersError}
                  helperText={selectedUsersError}
                  value={selectedUsers}
                  onChange={(e) => setSelectedUsers(e.target.value)}
                  fullWidth
                  sx={{ backgroundColor: '#F5F6FA' }}
                >
                  {users.map((user) => (
    <MenuItem key={user.id} value={user.email}>
    {user.name}
                    </MenuItem>
                  ))}
                </Select>

              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ padding: '20px' }}>
                <Typography variant="body1" gutterBottom>Start Date</Typography>
                <DatePicker
  selected={startDate}
  onChange={(date) => setStartDate(date)}
  dateFormat="MM/dd/yyyy h:mm aa" // Date and time format
  showTimeSelect // Show time select dropdown
  timeFormat="HH:mm" // 24-hour format
  className={`form-control ${startDateError ? 'is-invalid' : ''}`}
  customInput={<CustomInput />}

/>

                {startDateError && <div className="invalid-feedback">{startDateError}</div>}
                <Typography variant="body1" gutterBottom>Duration</Typography>
                <Select
                  fullWidth
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  sx={{ backgroundColor: '#F5F6FA' }}
                >
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                  <MenuItem value="3">3</MenuItem>
                </Select>
                <Typography variant="body1" gutterBottom>Mandatory</Typography>
                <Select
                  fullWidth
                  value={mandatory}
                  onChange={(e) => setMandatory(e.target.value)}
                  sx={{ backgroundColor: '#F5F6FA' }}
                >
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>

                <Typography variant="body1" gutterBottom>Project</Typography>
                <Select
  error={!!SelectedProjectError}
  helperText={SelectedProjectError}
  value={selectedProject}
  onChange={(e) => setSelectedProject(e.target.value)}
  fullWidth
  sx={{ backgroundColor: '#F5F6FA' }}
>
  {projects.map((project) => (
    <MenuItem key={project.id} value={project.id}>
      {project.name}
    </MenuItem>
  ))}
</Select>


              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right',marginTop:'15px' }}>
        <Button variant="contained" color="primary"  sx={{background:'#6226EF'}} onClick={handleCreateMeeting}>Create Meeting</Button>
      </Box>
     </ThemeProvider>
  );
};

export default withAuth(Index);
