import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CustomizedProgressBars from './loading';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import 'react-datepicker/dist/react-datepicker.css';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Snackbar from '@mui/material/Snackbar';
import WarningIcon from '@mui/icons-material/Warning';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import withAuth from '../../../features/reducers/withAuth';
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

const Index = () => {
  const router = useRouter();
  const { id } = router.query; // Accessing project ID from query
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State variable to hold selected image
  const usertoken = useSelector(loginSuccess);
  const [startDate, setStartDate] = useState(null);
  const [teamName, setTeamName] = useState('');
  const [membersList, setMembersList] = useState([]); // Define membersList state variable
  const [managersList, setManagersList] = useState([]); // Define membersList state variable

  const [selectedMembersmanager, setSelectedMembersManager] = useState(''); // State variable to hold selected users


  
  const [selectedMembers, setSelectedMembers] = useState([]); // State variable to hold selected users
  const [teamCapacity, setTeamCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [teamManager, setTeamManager ] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/listuserswithoutteam`, {
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });
        if (!response.ok) {
          setSnackbarMessage('Something went wrong !!');
          setSnackbarOpen(true);
        }
        const data = await response.json();
        if (!data || data.length === 0) {
          setSnackbarMessage("Oops, you don't have any members yet. Please create members first.");
          setSnackbarOpen(true);
        }
        if (response.ok) {
          setMembersList(data);
       setLoading(false);
        }

      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    const fetchDataTeamMemebers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/TeamManagersFromCompany`, {
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });
        if (!response.ok) {
          setSnackbarMessage('Something went wrong !!');
          setSnackbarOpen(true);
        }
        const data = await response.json();
        console.log(data);
        if (!data || data.length === 0) {
          setSnackbarMessage("Oops, you don't have any  Team Manager yet");
          setSnackbarOpen(true);
        }
        if (response.ok) {
          setManagersList(data);
       setLoading(false);
        }

      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchDataTeamMemebers();
    fetchData();
  }, [usertoken]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  const goBack = () => {
    router.back();
  };

  const handleCreateTeam = async () => {
    if (!teamName || !selectedMembers.length || !teamCapacity || !description) {
      setSnackbarMessage('Please fill Those  fields :Team Name ,Members ,Capacity,Description');
      setSnackbarOpen(true);
      return;
    }
  
    const teamManagerValue = isUserRoleTeamManager ? teamManager : null;
    // const formData = new FormData();

    const payload = {
      teamName: teamName,
      userIds: selectedMembers,
      teamManagerId: selectedMembersmanager,
      Capacity: teamCapacity,
      teamdescription:description,
      teamdiscipline:discipline,
    };
    // formData.append('project', new Blob([JSON.stringify(payload)], { type: 'application/json' }));
console.log(payload);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/createTeam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        // Handle server errors
     
        setSnackbarMessage('Something went wrong !!');
        setSnackbarOpen(true);
      }
      if (response.ok) {
        // Handle server errors
        setSnackbarMessage(`Team ${teamName} Has been Created`);
        setSnackbarOpen(true);
      }

    } catch (error) {
      // Handle any errors
      console.error('Error creating team:', error.message);
      setSnackbarMessage('Failed to create team. Please try again.');
      setSnackbarOpen(true);
    }
  };
  

  
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
 
  const base64Url =  usertoken.payload.token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const decodedToken = JSON.parse(window.atob(base64));

  const Role=decodedToken.role;

  const cr=decodedToken.cr;
  
  const isUserRoleTeamManager = Role === 'User' &&  cr === 'TeamManager';



  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <CustomizedProgressBars />
      ) :   (
        <>
          {membersList.length === 0 ? ( // Check if membersList is empty
           <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
           <Typography variant="h5" gutterBottom>
             You need to create members first.
           </Typography>
           <WarningIcon color="error" sx={{ fontSize: 48 }} />
         </Box>
          ) : (
            <>
      <Typography variant="h3" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 700, fontSize: '32px', color: '#202224', marginBottom: '20px' }}>
        Team 
      </Typography>

      <Card sx={{ padding: 10 }}>
        <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right' }}>
          <Button variant="contained" color="primary" onClick={goBack} sx={{ background: '#6226EF' }}>Back</Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ marginRight: '20px' }}>
            <Image
              src={'/images/icons/Photo.png'}
              alt="Selected Image"
              height={192}
              width={192}
            />
            <Typography variant="body1" sx={{ color: '#4379EE', fontWeight: 500, marginRight: '20px', marginBottom: '60px', marginLeft: '50px' }}>
              Team Picture
              <label htmlFor="image-upload">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
            </Typography>
            <Typography variant="body1" gutterBottom>Team description</Typography>
            <TextField fullWidth multiline rows={5} sx={{ backgroundColor: '#F5F6FA', border: 'none', width: '223px' }} value={description} onChange={(e) => setDescription(e.target.value)} />
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Box sx={{ padding: '20px' }}>


              <Typography variant="body1" gutterBottom sx>Team Name</Typography>
                <TextField fullWidth sx={{ backgroundColor: '#F5F6FA', borderColor: '#F5F6FA',marginBottom:2 }} value={teamName} onChange={(e) => setTeamName(e.target.value)} />
              {!isUserRoleTeamManager && (
  <>
    <Typography variant="body1" gutterBottom >Team Manager</Typography>
    <Select fullWidth  value={selectedMembersmanager} onChange={(e) => setSelectedMembersManager(e.target.value)}>
                  {managersList.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.first_name}
                    </MenuItem>
                  ))}
                </Select>
   
  </>
)}

              
                <Typography variant="body1" gutterBottom>Members</Typography>
                <Select fullWidth multiple value={selectedMembers} onChange={(e) => setSelectedMembers(e.target.value)}>
                  {membersList.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.first_name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ padding: '20px' }}>
                <Typography variant="body1" gutterBottom>Decipline</Typography>
                <TextField fullWidth sx={{ backgroundColor: '#F5F6FA',marginBottom:2 }} value={discipline} onChange={(e) => setDiscipline(e.target.value)} />
  
                <Typography variant="body1" gutterBottom>Team Capacity</Typography>
                <TextField fullWidth type="number" value={teamCapacity} onChange={(e) => setTeamCapacity(e.target.value)} sx={{ backgroundColor: '#F5F6FA',marginBottom:2 }} />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Card>
      <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '15px' }}>
        <Button variant="contained" color="primary" onClick={handleCreateTeam} sx={{ background: '#6226EF',marginBottom:2 }}>Create Team</Button>
      </Box>

      </>
        )}
      <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          />
        </>
      )}
    </ThemeProvider>
  );
};

export default withAuth(Index);
