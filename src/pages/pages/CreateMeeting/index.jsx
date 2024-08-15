import React, { useState, forwardRef,useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Typography,
  Box,
  TextField,
  Button,
  Card,
  Grid,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Container,
  FormControl,
  InputLabel,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import 'react-datepicker/dist/react-datepicker.css';
import withAuth from '../../../features/reducers/withAuth';
import MuiAlert from '@mui/material/Alert';
import DatePicker from 'react-datepicker';
import Chip from '@mui/material/Chip';

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <TextField
    fullWidth
    value={value}
    onClick={onClick}
    inputRef={ref}
    autoComplete='off'
    variant="outlined"
    placeholder='Date'
  />
));
CustomInput.displayName = 'CustomInputMeeting';

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

const Create = () => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [Name, setProjectName] = useState('');
  const [topic, setTopic] = useState('');
  const [date, setDate] = useState(null);
  const [duration, setDuration] = useState('');
  const [isMandatory, setIsMandatory] = useState(false);
  const [description, setDescription] = useState('');
  const [meetingType, setMeetingType] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState('');
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState('');
  const usertoken = useSelector(loginSuccess);
  const router = useRouter();
  const [membersList, setMembersList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [selectedTask, setSelectedTask] = useState([]); // State for multiple selected tasks


  const dummyTaskOptions = [
    { projectId: 1, id: 1, name: 'Dummy data Task A' },
    { projectId: 1, id: 2, name: 'Dummy data Task B' },
    { projectId: 2, id: 3, name: 'Dummy data Task C' },
    { projectId: 2, id: 4, name: 'Dummy data Task D' },
    { projectId: 3, id: 5, name: 'Dummy data Task E' },
    { projectId: 4, id: 6, name: 'Dummy data Task F' },
    { projectId: 4, id: 7, name: 'Dummy data Task G' },
    { projectId: 5, id: 8, name: 'Dummy data Task H' },
    { projectId: 5, id: 9, name: 'Dummy data Task I' },
    { projectId: 6, id: 10, name: 'Dummy data Task J' },
    { projectId: 6, id: 11, name: 'Dummy data Task K' },
    { projectId: 7, id: 12, name: 'Dummy data Task L' },
    { projectId: 7, id: 13, name: 'Dummy data Task M' },
    { projectId: 7, id: 14, name: 'Dummy data Task N' },

    // Add more tasks as needed
  ];
  const goBack = () => {
    router.back();
  };

  const handleTaskChange = (event) => {
    setSelectedTask(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormSubmitted(true);
  
    if (!date) {
      return; 
    }
  
    const isMandatoryString = isMandatory ? 'Yes' : 'No';
    const userEmails = members.map(member => member.email);

    const formData = {
      name:Name,
      topic:topic,
      userEmails: userEmails, 
      startDate:date,
      duration:duration,
      mandatory: isMandatoryString, 
      description:description,
      label:selectedLabels,
      Idproject: projects ? projects.id : null,
      meeting_type:meetingType,
    };
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/create_meeting`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setSnackbarMessage(true);
        setSnackbarMessage('Meeting created successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        setLoading(false);
 
      setProjectName('');
      setTopic('');
      setMembers([]);
      setDate(null);
      setDuration('');
      setIsMandatory(false);
      setDescription('');
      setMeetingType('');
      } else {
        setLoading(false);
        setSnackbarMessage('An error occurred while creating the meeting. Please try again later.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        console.error('Server error:', response.statusText);
      }
    } catch (error) {
      console.error('Error occurred:', error.message);
    } 
  };
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/listusers`, {
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });
        if (!response.ok) {
          setSnackbarMessage('Something went wrong while fetching users!');
          setSnackbarOpen(true);
          return;
        }
        const data = await response.json();

        if (!data || data.length === 0) {
          setSnackbarMessage("Oops, you don't have any members yet. Please create members first.");
          setSnackbarOpen(true);
        } else {
          setMembersList(data);
        }
      } catch (error) {
        console.error('Error occurred while fetching users:', error.message);
        setSnackbarMessage('Error occurred while fetching users!');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/user-projects`, {
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });
        if (!response.ok) {
          setSnackbarMessage('Something went wrong while fetching projects!');
          setSnackbarOpen(true);
          return;
        }
        const data = await response.json();
        if (!data || data.length === 0) {
          setSnackbarMessage("Oops, you don't have any projects yet. Please create projects first.");
          setSnackbarOpen(true);
        } else {
          setProjectList(data);
        }
      } catch (error) {
        console.error('Error occurred while fetching projects:', error.message);
        setSnackbarMessage('Error occurred while fetching projects!');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
    fetchProjects();
  }, [usertoken]);
  const handleLabelChange = (event) => {
    setSelectedLabels(event.target.value);
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" sx={{ fontFamily: 'Arial', fontWeight: 700, fontSize: '32px', color: '#202224', marginBottom: '20px' }}>
          Create Meeting
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Card sx={{ padding: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Meeting Name"
                  variant="outlined"
                  fullWidth
                  value={Name}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Topic"
                  variant="outlined"
                  fullWidth
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                 // required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="members-label">Members</InputLabel>
          
                  <Select
  labelId="members-label"
  multiple
  value={members}
  onChange={(e) => setMembers(e.target.value)}
  renderValue={(selected) => selected.map(user => user.first_name).join(', ')}
  required
>
  {membersList.map((user) => (
    <MenuItem key={user.id} value={user}>
      {user.first_name}
    </MenuItem>
  ))}
</Select>

</FormControl>


              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="projects-label">Projects</InputLabel>
                                  <Select
                  labelId="projects-label"
                  value={projects.id}
                  onChange={(e) => setProjects(e.target.value)}
                  
                  renderValue={(selected) => (
                    <div>
                        <Chip key={projects.id} label={projects.projectName} />
                    </div>
                  )}
                >
                  {projectList.map((project) => (
                    <MenuItem key={project.id} value={project}>
                      {project.projectName} {project.id}
                    </MenuItem>
                  ))}
                </Select>

                </FormControl>
                <div style={{marginTop:15}}>

                <FormControl fullWidth variant="outlined">
        <InputLabel id="dummy-task-label">Select Dummy Task</InputLabel>
        <Select
                    labelId="dummy-task-label"
                    value={selectedTask}

                    onChange={handleTaskChange}
                    label="Select Dummy Task"
                    multiple  
                  >
                    {dummyTaskOptions
                      .filter(task => task.projectId === projects.id) // Filter tasks based on selected project
                      .map((task) => (
                        <MenuItem key={task.id} value={task.id}>
                          {task.name}
                        </MenuItem>
                      ))}
                  </Select>
      </FormControl></div>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="duration-label">Duration</InputLabel>
                  <Select
                    labelId="duration-label"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    //required
                  >
                    <MenuItem value="30">30 minutes</MenuItem>
                    <MenuItem value="60">1 hour</MenuItem>
                    <MenuItem value="90">1.5 hours</MenuItem>
                    <MenuItem value="120">2 hours</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
  
    <DatePicker
  
      selected={date}
      showYearDropdown
      showMonthDropdown
      showTimeSelect
      timeIntervals={15}
      required
      placeholderText="Select date and time"
      customInput={<CustomInput />}
      onChange={(date) => setDate(date)}
      error={formSubmitted && !date}
      helperText={formSubmitted && !date ? 'Please select a date and time' : ''}
    />
  </Grid>
  <Grid item xs={12} sm={6}>
    <FormControl fullWidth variant="outlined">
      <InputLabel id="label-select">Label</InputLabel>
      <Select
        labelId="label-select"
        value={selectedLabels}
        onChange={handleLabelChange}
        renderValue={(selected) => (
          <div>
            {selected}
          </div>
        )}
       // required
      >
        <MenuItem value="Urgent">Urgent</MenuItem>
        <MenuItem value="Important">Important</MenuItem>
        <MenuItem value="High Priority">High Priority</MenuItem>
        <MenuItem value="Low Priority">Low Priority</MenuItem>
      </Select>
    </FormControl>
  </Grid>
</Grid>

              
              <FormControlLabel
                  control={
                    <Checkbox
                      checked={isMandatory}
                      onChange={(e) => setIsMandatory(e.target.checked)}
                    />
                  }
                  label="Mandatory"
                />   
                 </Grid>



                 <Grid item xs={12}>


</Grid>
              <Grid item xs={12}>
                
                <TextField
                  label="Description"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Meeting Type                  </FormLabel>
                  <RadioGroup
                    row
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value)}
                  >
                    <FormControlLabel value="vr" control={<Radio />} label="VR" />
                    <FormControlLabel value="googleMeet" control={<Radio />} label="Google Meet" />
                    <FormControlLabel value="inPerson" control={<Radio />} label="In Person" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit" fullWidth>
                  Create Meeting
                </Button>
              </Grid>
            </Grid>
          </Card>
        </form>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 9999 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default withAuth(Create);

