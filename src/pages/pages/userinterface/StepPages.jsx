import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Checkbox from '@mui/material/Checkbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Alert from 'react-bootstrap/Alert';
import Stack from '@mui/material/Stack';
import Backdrop from '@mui/material/Backdrop';
import { loginSuccess,SetRole,Cr } from '../../../features/reducers/authReducer'
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const Step1Page = () => (
  <Box sx={{ textAlign: 'center', p: 3 }}>
    <Typography variant="h5" gutterBottom>
      Step 1: Getting Started
    </Typography>
    <Typography variant="body1" gutterBottom>
      Welcome to the first step of your journey. Here’s what you’ll need to do:
    </Typography>
    <Divider sx={{ my: 2 }} />
    <List>
      <ListItem>
        <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
        <ListItemText primary="Create your profile: Add a professional photo, your contact details, and a brief bio highlighting your experience and expertise." />
      </ListItem>
      <ListItem>
        <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
        <ListItemText primary="Invite employees: Send invitations to your team members via email and ensure they complete their profiles." />
      </ListItem>
      <ListItem>
        <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
        <ListItemText primary="Set roles: Define roles and responsibilities for each team member to ensure everyone knows their tasks and duties." />
      </ListItem>
      <ListItem>
        <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
        <ListItemText primary="Create teams: Organize your team based on projects or departments for better management and collaboration." />
      </ListItem>
      <ListItem>
        <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
        <ListItemText primary="Start your journey: Once everything is set up, dive into your projects and begin collaborating and managing your tasks." />
      </ListItem>
    </List>
  </Box>
);

const Step2Page = () => (
  <Box sx={{ textAlign: 'center', p: 3 }}>
    <Typography variant="h5" gutterBottom>
      Step 2: Introduction to the Dashboard
    </Typography>
    <Typography variant="body1" gutterBottom>
      Get acquainted with the main features of your dashboard:
    </Typography>
    <Divider sx={{ my: 2 }} />
    <List>
      <ListItem>
        <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
        <ListItemText primary="Overview: Get a quick snapshot of your projects, tasks, and team activities." />
      </ListItem>
      <ListItem>
        <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
        <ListItemText primary="Navigation: Easily access different sections such as Projects, Teams, and Reports from the sidebar." />
      </ListItem>
      <ListItem>
        <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
        <ListItemText primary="Notifications: Stay updated with real-time alerts and notifications about important activities." />
      </ListItem>
      <ListItem>
        <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
        <ListItemText primary="Customization: Adjust your dashboard layout and preferences to suit your workflow." />
      </ListItem>
    </List>
  </Box>
);

const Step3Page = () => (
  <Box sx={{ textAlign: 'center', p: 3 }}>
    <Typography variant="h5" gutterBottom>
      Step 3: Exploring Features
    </Typography>
    <Typography variant="body1" gutterBottom>
      Learn about the advanced features that can boost your productivity:
    </Typography>
    <Divider sx={{ my: 2 }} />
    <List>
      <ListItem>
        <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
        <ListItemText primary="Project Management: Use advanced tools to create, assign, and track project tasks." />
      </ListItem>
      <ListItem>
        <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
        <ListItemText primary="Team Collaboration: Leverage chat and document sharing features to enhance team communication." />
      </ListItem>
      <ListItem>
        <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
        <ListItemText primary="Reporting: Generate detailed reports to gain insights into project progress and team performance." />
      </ListItem>
      <ListItem>
        <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
        <ListItemText primary="Integrations: Connect with other tools and platforms to streamline your workflow." />
      </ListItem>
    </List>
  </Box>
);


const Step4Page = ({ handleNext }) => {
  const [teamManagerEmail, setTeamManagerEmail] = useState('');
  const [leadManagerEmail, setLeadManagerEmail] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [confirmRole, setConfirmRole] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [invitationSent, setInvitationSent] = useState(false);
  const user = useSelector(loginSuccess);
  const dispatch = useDispatch(); 

  const handleSendInvite = () => {
    if (!teamManagerEmail && !leadManagerEmail) {
      setSnackbarMessage('Please enter email addresses for at least one role.');
      setSnackbarOpen(true);
    } else if (!teamManagerEmail) {
      setConfirmRole('Lead Manager');
      
      setOpenDialog(true);

    } else if (!leadManagerEmail) {
      setConfirmRole('Team Manager');
      setOpenDialog(true);
    } else {
      setConfirmRole('Team Manager and Lead Manager');
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmRoles = async () => {
    try {
      // Prepare the data to send to the API
      const requestData = {
        email1: teamManagerEmail,
        email2: leadManagerEmail,
      };
  
      // Fetch options with Authorization header
      const requestOptions = {
        method: 'POST', // Adjust the method as per your API requirements
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.payload.token}`,
        },
        body: JSON.stringify(requestData),
      };
  
console.log(requestData) ;
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Invitations/update-companyroles`, requestOptions);
  
      if (response.ok) {
        setOpenDialog(false);
        setSnackbarMessage('Invitations sent!!');
        setSnackbarOpen(true);
        setInvitationSent(true);
        if (!teamManagerEmail) {
          console.log('Redirect or action for when Team Manager Email is empty');
         dispatch(SetRole("Subscriber"));
         dispatch(Cr("TeamManager"));
       
        } else if (!leadManagerEmail) {
          console.log('Redirect or action for when Lead Manager Email is empty');
          dispatch(SetRole("Subscriber"));
           dispatch(Cr("LeadsManager"));
       
        } else {
          console.log('Both emails are not empty, proceed with next step');
          dispatch(SetRole("Subscriber"));
          dispatch(Cr("Viewer"));
       
          
        }
        handleNext();
      } else {
        console.error('Failed to send roles invitation:', response.statusText);
        setSnackbarMessage('Failed to send roles invitation');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error sending roles invitation:', error.message);
      // Optionally set a snackbar message for failure
      setSnackbarMessage('Error sending roles invitation');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom>
        Step 4: Assigning Roles
      </Typography>
      <Typography variant="body1" gutterBottom>
        Please enter the email addresses for team members you wish to assign as the Team Manager and Lead Manager roles.
      </Typography>
      <Divider sx={{ my: 3 }} />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Team Manager's Email"
            variant="outlined"
            fullWidth
            value={teamManagerEmail}
            onChange={(e) => setTeamManagerEmail(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Lead Manager's Email"
            variant="outlined"
            fullWidth
            value={leadManagerEmail}
            onChange={(e) => setLeadManagerEmail(e.target.value)}
          />
        </Grid>
        
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSendInvite}
            sx={{ mt: 2 }}
          >
            Send Invitation
          </Button>
        </Grid>

        <Grid item xs={12} sx={{ textAlign: 'right' }}>

        <Tooltip title="Please send the invitation before proceeding"> <InfoOutlinedIcon /> </Tooltip>
        </Grid>

      </Grid>

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Roles</DialogTitle>
        <DialogContent>
  <Typography variant="body1" sx={{marginBottom:5}}>
    Are you sure you want to assign the role of {confirmRole}?
  </Typography>
  {!teamManagerEmail && leadManagerEmail && (<>
    <Box
      sx={{
        backgroundColor: '#e3f2fd',
        color: '#0d47a1',
        fontSize: '0.8rem',
        padding: '0.5rem',
        width: 'fit-content',
        maxWidth: '100%',
      }}
    >   
    By confirming, you will be assigned as the Team Manager.
</Box>

    
    </>
  )}
  {teamManagerEmail && !leadManagerEmail && (
    <Box
    sx={{
      backgroundColor: '#e3f2fd',
      color: '#0d47a1',
      fontSize: '0.8rem',
      padding: '0.5rem',
      width: 'fit-content',
      maxWidth: '100%',
    }}
  >   By confirming, you will be assigned as the Lead Manager.
</Box>

  )}

</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRoles} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        style={{ marginBottom: '-25px' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Step4Page;
const Step5Page = () => (
  <Container maxWidth="md" sx={{ textAlign: 'center', p: 3 }}>
  <Typography variant="h5" gutterBottom>
    Congratulations! Setup Complete.
  </Typography>
  <Typography variant="body1" gutterBottom>
    You re all set to manage your team and projects effectively.
  </Typography>
  <Divider sx={{ my: 3 }} />
  <Typography variant="body1" gutterBottom>
  Thank you for choosing our platform. If you need any assistance or have questions,
        our support team is here to help. Please don t hesitate to reach out.
  </Typography>

</Container>
);

export { Step1Page, Step2Page, Step3Page , Step4Page ,Step5Page};
