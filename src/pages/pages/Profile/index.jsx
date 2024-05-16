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
const dummyData = {
    name: 'John Doe',
    phoneNumber: '1234567890',
    country: 'USA',
    company: 'ABC Inc.',
    position: 'Software Engineer',
    email: 'john.doe@example.com',
    link: 'https://example.com',
    city: 'New York',
    dateJoined: '2022-01-01',
    yearsOfExperience: '5',
    profilePicture: '/images/icons/Photo.png',
    bio:'Lorem ipsum dolor sit amet, consectetur adipiscing elit.posuere  Mauris vitae justo at enim aliquet tempus non eget augue.',
  };
const Index = () => {
  const router = useRouter();
  const [DummyData, setDummyData] = useState(dummyData);
  const [profileInfo, setProfileInfo] = useState(dummyData);
  const [editedProfileInfo, setEditedProfileInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check if any field has been changed from the dummy data
    const updatedProfileInfo = { ...dummyData };
    Object.keys(editedProfileInfo).forEach((key) => {
      if (editedProfileInfo[key] !== dummyData[key]) {
        updatedProfileInfo[key] = editedProfileInfo[key];
      }
    });

    // Update profile information
    setProfileInfo(updatedProfileInfo);
  }, [editedProfileInfo]);
  const handleEditProfile = () => {
    setIsEditing(true);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProfileInfo({ ...editedProfileInfo, [name]: value });
  };

  const goBack = () => {
    router.back();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      setEditedProfileInfo({ ...editedProfileInfo, profilePicture: reader.result });
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  
  

  
  const handleSubmit = () => {
   
       const updatedProfileInfo = { ...dummyData };
        Object.keys(profileInfo).forEach((key) => {

          if (profileInfo[key] !== dummyData[key]) {
            updatedProfileInfo[key] = profileInfo[key];

          }
        });
    
        // Update profile information
        setProfileInfo(updatedProfileInfo);
        console.log(profileInfo); 
        setIsEditing(false);

      };
 
  
  
  

  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: 2 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={8}>
            <Typography variant="h3" component="div" sx={{ fontWeight: 700,fontSize:32 }}>
              Profile
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              onClick={handleEditProfile}
              disabled={isEditing}              sx={{ width: '50%', bgcolor: '#6226EF', color: 'white' }}
            >
              Edit Profile
            </Button>
          </Grid>
        </Grid>

        <Card sx={{ padding: 2 ,marginTop:5}}>
          <Grid container spacing={2} sx={{ padding: 2 ,marginTop:5}}>
            <Grid item xs={12} sm={4} sx={{ padding: 2 ,marginTop:5}}>
              {/* Profile picture */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Image   
  src={editedProfileInfo.profilePicture || DummyData.profilePicture} // Update this line
  alt="Selected Image" 
  height={192} 
  width={192} 
/>

<label htmlFor="image-upload">
  <input
    id="image-upload"
    type="file"
    accept="image/*"
    onChange={handleImageChange} // Uncomment this line
    style={{ display: 'none' }}  disabled={!isEditing}
  />
  <Typography component="span" sx={{ color: '#4379EE', mt: 1 }}>
    Profile Picture
  </Typography>
</label>
                <Typography variant="body1" gutterBottom  sx={{ marginRight:'auto' }}>
                  BIO
                </Typography>
                <TextField fullWidth multiline rows={8}  sx={{width:223,marginRight:'auto'}}  
                  placeholder={DummyData.bio}
                  name="bio"
                  value={editedProfileInfo.bio || profileInfo.bio}
                  onChange={handleInputChange}            disabled={!isEditing}

    
                  />
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}  sx={{ padding: 2 ,marginTop:5}}>
              {/* Inputs */}
              <Typography variant="body1" gutterBottom >
              Name and Last Name
                </Typography>
              <TextField fullWidth   sx={{ paddingBottom: 2 }}
              placeholder={DummyData.name}
              name="name" // Adding name attribute to identify input
              value={editedProfileInfo.name || profileInfo.name}
              onChange={handleInputChange}            disabled={!isEditing}


              />
              <Typography variant="body1" gutterBottom>
              Phone Number
                </Typography>
              <TextField fullWidth  sx={{ paddingBottom: 2 }}
              placeholder={DummyData.phoneNumber}
              name="phoneNumber"
              value={editedProfileInfo.phoneNumber || profileInfo.phoneNumber}
              onChange={handleInputChange}            disabled={!isEditing}

              />
              <Typography variant="body1" gutterBottom>
              Country                </Typography>
              <TextField fullWidth  sx={{ paddingBottom: 2 }}                 name="country"
   placeholder={DummyData.country}
   value={editedProfileInfo.country || profileInfo.country}
   onChange={handleInputChange}            disabled={!isEditing}

             />
              <Typography variant="body1" gutterBottom>
              Company
                </Typography>
              <TextField fullWidth  sx={{ paddingBottom: 2 }}   placeholder={DummyData.company}
                           name="company"
                           value={editedProfileInfo.company || profileInfo.company}
                           onChange={handleInputChange}            disabled={!isEditing}

              />
              <Typography variant="body1" gutterBottom>
              Position
                </Typography>
              <TextField fullWidth  sx={{ paddingBottom: 2 }}  placeholder={DummyData.position}         value={editedProfileInfo.position || profileInfo.position}
                           onChange={handleInputChange}            disabled={!isEditing}

                 name="position"/>
            </Grid>
            <Grid item xs={12} sm={4} sx={{ padding: 2 ,marginTop:5}}>
              <Box >
       
              <Typography variant="body1" gutterBottom>
              Email
                </Typography>
                <TextField fullWidth   sx={{ paddingBottom: 2 }}   placeholder={DummyData.email}
               name="email"
               value={editedProfileInfo.email || profileInfo.email}                            onChange={handleInputChange}
               disabled={!isEditing}

              />
                <Typography variant="body1" gutterBottom>
                Link
                </Typography>
              <TextField fullWidth   sx={{ paddingBottom: 2 }}   placeholder={DummyData.link}
               name="link"
               value={editedProfileInfo.link || profileInfo.link}                            onChange={handleInputChange}
               disabled={!isEditing}


              />
              <Typography variant="body1" gutterBottom>
              City
                </Typography>
              <TextField fullWidth  sx={{ paddingBottom: 2 }}    placeholder={DummyData.city}
              name="city"
              value={editedProfileInfo.city || profileInfo.city}                           onChange={handleInputChange}
              disabled={!isEditing}


              />
              <Typography variant="body1" gutterBottom>
              Date joined
                </Typography>
              <TextField fullWidth   sx={{ paddingBottom: 2 }}   placeholder={DummyData.dateJoined}
            name="dateJoined"
            value={editedProfileInfo.dateJoined || profileInfo.dateJoined}                           onChange={handleInputChange}
            disabled={!isEditing}


              />
              <Typography variant="body1" gutterBottom>
              Years Of Experience
                </Typography>
              <TextField fullWidth sx={{ paddingBottom: 2 }}   placeholder={DummyData.yearsOfExperience}
            name="yearsOfExperience"
            value={editedProfileInfo.yearsOfExperience || profileInfo.yearsOfExperience}                           onChange={handleInputChange}
            disabled={!isEditing}


               />
              </Box>
            </Grid>
          </Grid>

      
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'right', mt: 2  }}>
            <Button variant="contained" onClick={handleSubmit} disabled={!isEditing} sx={{ bgcolor: '#6226EF', color: 'white',width:'10%' }}>
              Edit
            </Button>
          </Box>
      </Box>
    </ThemeProvider>
  );
};

export default withAuth(Index);
