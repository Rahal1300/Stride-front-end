import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles'
import Check from 'mdi-material-ui/Check'

const Profile = () => {
  const imgSrc = ('/images/avatars/1.png')
  const ImgStyled = styled('img')(({ theme }) => ({
    width: 120,
    height: 120,
    marginRight: theme.spacing(6.25),
    borderRadius: theme.shape.borderRadius
  }))
  const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
   marginTop:'10%',
  });
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from the server when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil`, {
         headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, []);

  if (!userData) {
    // You might want to render a loading state or handle the absence of data
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Card>
      <Container>
        <ImgStyled src={imgSrc} alt='Profile Pic' />
        <Typography variant='h6' sx={{marginTop:'10px',marginRight:'40px'}} >
            {userData.first_name}
        </Typography>
        <Chip
      label="Subscriber"
      sx={{
        backgroundColor: '#ff4c51',
        color: '#fee8e7',
        marginTop:'10px',
        marginRight:'40px'
      }}
    >
      Subscriber
    </Chip>
   
      </Container>
      <CardContent sx={{ padding: theme => `${theme.spacing(20, 10, 0, 5)} !important` }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* First Avatar and Typography */}
              <Avatar
                  variant='rounded'
                  sx={{ width: 48, height: 48, color: 'primary.main', backgroundColor: '#fee8e7' }}
                >
                  <Check sx={{ fontSize: '1.75rem' }} />
                </Avatar>
              <div style={{ display: 'flex', flexDirection: 'column', marginRight: '40px',marginLeft:'20px' }}>
           
                <div>
                  <Typography sx={{ fontSize: '24px', marginTop: '5px' }}>10</Typography>
                  <Typography>Task Done</Typography>
                </div>
              </div>

              {/* Second Avatar and Typography */}
              <Avatar
                  variant='rounded'
                  sx={{ width: 48, height: 48, color: 'primary.main', backgroundColor: '#fee8e7' }}
                >
                  <Check sx={{ fontSize: '1.75rem' }} />
                </Avatar>
              <div style={{ display: 'flex', flexDirection: 'column', marginLeft:'20px'}}>
               
                <div>
                  <Typography sx={{ fontSize: '24px', marginTop: '5px' }}>90</Typography>
                  <Typography>Project Done</Typography>
                </div>
              </div>
            </div>
          </CardContent>

        {/* Render profile components using userData */}
        <CardContent sx={{ padding: theme => `${theme.spacing(15, 10, 10, 5)} !important` }}>
          <h3>Details</h3>
          <Typography>Username: {userData.first_name}</Typography>
          <Typography>Email: {userData.email}</Typography>
          <Typography>Status: {userData.status}</Typography> {/* Assuming this is the user's status */}
          <Typography>Role: {userData.role}</Typography>
       
          {/* Edit and Suspend Buttons */}
          <Button variant="contained" style={{ marginLeft: '25px', marginTop: '25px' }}>
            Edit
          </Button>
          <Button
            variant="contained"
            style={{
              backgroundColor: 'white',
              color: 'red',
              border: '1px solid rgba(255, 76, 81, 0.50)',
              marginLeft: '25px',
              marginTop: '25px',
            }}
          >
            Suspend
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
