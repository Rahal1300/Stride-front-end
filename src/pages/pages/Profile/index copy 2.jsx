import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Image from 'next/image';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CustomizedProgressBars from './loading';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import withAuth from '../../../features/reducers/withAuth';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { styled } from '@mui/system';

import Container from '@mui/material/Container';
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#6226EF',
  color: 'white',
  '&:hover': {
    backgroundColor: '#4d1bbf',
  },
  width: '100%',
  maxWidth: 300,
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(1),
}));

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
  const usertoken = useSelector(loginSuccess);
  const router = useRouter();
  const [profileInfo, setProfileInfo] = useState(null);
  const [editedProfileInfo, setEditedProfileInfo] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState(0); // 0 for All Info, 1 for Email

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileInfo(data);
        setEditedProfileInfo(data);

        if (data.image) {
          setImagePreviewUrl(data.image);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
      }
    };

    fetchProfileData();
  }, [usertoken]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfileInfo({ ...editedProfileInfo, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    setIsLoading(true);

    try {
      Object.keys(editedProfileInfo).forEach((key) => {
        if (key !== 'image') {
          formData.append(key, editedProfileInfo[key]);
        }
      });

      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil/updateInfo`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
        body: formData,
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update profile data');
      }

      const updatedData = await updateResponse.json();
      setProfileInfo(updatedData);
      setIsEditing(false);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error updating profile data:', error.message);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {isLoading ? (
        <CustomizedProgressBars />
      ) : (
        <>
          <Box sx={{ padding: 2 }}>
            <Tabs
              value={currentTab}
              onChange={(event, newValue) => setCurrentTab(newValue)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="Profile Tabs"
            >
              <Tab label="All Info" />
              <Tab label="Email" />
            </Tabs>
          </Box>

          {/* Panel for All Info */}
          {currentTab === 0 && (
            <Paper sx={{ padding: 2, marginTop: 2 }}>
              <Grid container spacing={2} sx={{ padding: 2, marginTop: 5 }}>
                <Grid item xs={12} sm={4} sx={{ padding: 2, marginTop: 5 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {imagePreviewUrl || profileInfo?.image ? (
                      <div style={{ borderRadius: '50%', overflow: 'hidden', marginBottom: '1rem' }}>
                        <Image
                          src={imagePreviewUrl ? imagePreviewUrl : `data:image/png;base64, ${profileInfo.image}`}
                          alt="User Image"
                          height={192}
                          width={192}
                        />
                      </div>
                    ) : (
                      <Image src={'/images/icons/Photo.png'} alt="Placeholder Image" height={192} width={192} />
                    )}
                    <label htmlFor="image-upload">
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        disabled={!isEditing}
                        onChange={handleImageChange}
                      />
                      <Typography component="span" sx={{ color: '#4379EE', mt: 1 }}>
                        Profile Picture
                      </Typography>
                    </label>
                    <Typography variant="body1" gutterBottom sx={{ marginRight: 'auto', marginTop: '1rem' }}>
                      BIO
                    </Typography>
                    <TextField
                      fullWidth
                      multiline
                      rows={8}
                      sx={{ width: '100%', marginRight: 'auto' }}
                      name="bio"
                      value={editedProfileInfo.bio || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4} sx={{ padding: 2, marginTop: 5 }}>
                  <Typography variant="body1" gutterBottom>
                    First Name
                  </Typography>
                  <TextField
                    fullWidth
                    sx={{ paddingBottom: 2 }}
                    name="first_name"
                    value={editedProfileInfo.first_name || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <Typography variant="body1" gutterBottom>
                    Last Name
                  </Typography>
                  <TextField
                    fullWidth
                    sx={{ paddingBottom: 2 }}
                    name="last_name"
                    value={editedProfileInfo.last_name || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <Typography variant="body1" gutterBottom>
                    Phone Number
                  </Typography>
                  <TextField
                    fullWidth
                    sx={{ paddingBottom: 2 }}
                    name="phone_number"
                    value={editedProfileInfo.phone_number || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    type="number"
                  />
                  <Typography variant="body1" gutterBottom>
                    Country
                  </Typography>
                  <TextField
                    fullWidth
                    sx={{ paddingBottom: 2 }}
                    name="country"
                    value={editedProfileInfo.country || ''}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  <Typography variant="body1" gutterBottom>
                    Company
                  </Typography>
                  <TextField
                    fullWidth
                    sx={{ paddingBottom: 2 }}
                    name="company"
                    value={editedProfileInfo.company || ''}
                    onChange={handleInputChange}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={4} sx={{ padding: 2, marginTop: 5 }}>
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      Link
                    </Typography>
                    <TextField
                      fullWidth
                      sx={{ paddingBottom: 2 }}
                      name="link"
                      value={editedProfileInfo.link || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <Typography variant="body1" gutterBottom>
                      City
                    </Typography>
                    <TextField
                      fullWidth
                      sx={{ paddingBottom: 2 }}
                      name="city"
                      value={editedProfileInfo.city || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                    <Typography variant="body1" gutterBottom>
                      Date joined
                    </Typography>
                    <TextField
                      fullWidth
                      sx={{ paddingBottom: 2 }}
                      name="join_Date"
                      value={editedProfileInfo.join_Date || ''}
                      onChange={handleInputChange}
                      disabled={true}
                    />
                    <Typography variant="body1" gutterBottom>
                      Years Of Experience
                    </Typography>
                    <TextField
                      fullWidth
                      sx={{ paddingBottom: 2 }}
                      name="yearsOfExperience"
                      value={editedProfileInfo.yearsOfExperience || ''}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      type="number"
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          )}

          {/* Panel for Email */}
          {currentTab === 1 && (
         <Container maxWidth="sm">
         <StyledPaper elevation={3}>
           <Typography variant="h4" align="center" gutterBottom>
             Create Account
           </Typography>
           <Typography variant="body1" align="center" paragraph>
             Enter the email of the person for whom you want to create an account. They will receive an email with login credentials.
           </Typography>
           <Grid container spacing={2} justifyContent="center">
             <Grid item xs={12}>
               <TextField
                 id="email"
                 label="Recipient's Email"
                 variant="outlined"
            
                 fullWidth
               />
             </Grid>
             <Grid item xs={12} md={6}>
               <StyledButton
                 variant="contained"
             // Disable button if email field is empty or only whitespace
               >
                 Send Email
               </StyledButton>
             </Grid>
           </Grid>
         </StyledPaper>
       </Container>
              )}

              {/* Save button, outside of tabs */}
              <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={!isEditing}
                  sx={{ bgcolor: '#6226EF', color: 'white', width: '10%' }}
                >
                  Save
                </Button>
              </Box>
            </>
          )}
     
      </ThemeProvider>
    );
  };
  
  export default withAuth(Index);