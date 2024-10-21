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
import withAuth from '../../../features/reducers/withAuth';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import CustomizedProgressBars from './loading';
import SubscriptionDetails from './SubscriptionDetails';

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
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
      }
    };

    fetchProfileData();
    if (profileInfo?.image) {
      setImagePreviewUrl(profileInfo.image);
    }
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
      let hasChanges = false;
  
      Object.keys(editedProfileInfo).forEach((key) => {
        if (key !== 'image' && editedProfileInfo[key] !== profileInfo[key]) {
          formData.append(key, editedProfileInfo[key]);
          hasChanges = true;
        }
      });
  
      if (selectedImage) {
        formData.append('image', selectedImage);
        hasChanges = true;
      }
  
      if (!hasChanges) {
        setIsLoading(false);
        alert('No changes detected. Profile not updated.');
        return;
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
      alert('Profile updated successfully!');
  
    } catch (error) {
      setIsLoading(false);
      console.error('Error updating profile data:', error.message);
      alert(`Error updating profile: ${error.message}`);
    }
  };

  // Function to handle null and "null" values
  const handleValue = (value) => {
    return value === null || value === "null" ? "Not available" : value;
  };

  return (
    <ThemeProvider theme={theme}>
      {isLoading ? <CustomizedProgressBars /> : (
        <>
          <Box sx={{ padding: 1, mt: -2 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} sm={8}>
                <Typography variant="h3" component="div" sx={{ fontWeight: 700, fontFamily: 'Arial', fontSize: '32px', '&::first-letter': { color: 'secondary.main' } }}>
                  Profile
                </Typography>
              </Grid>
              <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleEditProfile}
                  disabled={isEditing}
                  sx={{ width: '50%', bgcolor: '#6226EF', color: 'white' }}
                >
                  Customize Profile
                </Button>
              </Grid>
            </Grid>
            <SubscriptionDetails />

            <Card sx={{ padding: 2, marginTop: 2 }}>
              <Grid container spacing={2} sx={{ padding: 2, marginTop: 2 }}>
                <Grid item xs={12} sm={4} sx={{ padding: 2, marginTop: 2 }}>
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
                      value={editedProfileInfo.bio || 'Not available'}
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
                    value={handleValue(editedProfileInfo.first_name)}
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
                    value={handleValue(editedProfileInfo.last_name)}
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
                    value={handleValue(editedProfileInfo.phone_number)}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    type='number'
                  />
                  <Typography variant="body1" gutterBottom>
                    Country
                  </Typography>
                  <TextField
                    fullWidth
                    sx={{ paddingBottom: 2 }}
                    name="country"
                    value={handleValue(editedProfileInfo.country)}
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
                    value={handleValue(editedProfileInfo.company)}
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
                      value={handleValue(editedProfileInfo.link)}
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
                      value={handleValue(editedProfileInfo.city)}
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
                      value={handleValue(editedProfileInfo.join_Date)}
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
                      value={handleValue(editedProfileInfo.yearsOfExperience)}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      type='number'
                    />
                  </Box>
                </Grid>
              </Grid>
            </Card>
     
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
          </Box>
        </>
      )}
    </ThemeProvider>
  );
};

export default withAuth(Index);