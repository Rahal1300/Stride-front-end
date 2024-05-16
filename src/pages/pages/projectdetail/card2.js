import React from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { useState,useEffect  } from 'react'

import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer'
const Card2 = ({ project }) => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState({});
  const router = useRouter();
  const { id } = router.query;
  const idproject = id || '';
  const usertoken = useSelector(loginSuccess);

  useEffect(() => {
    if (project) {
      setProjects(project);
    }
  }, [project]);

  const calculateNumberOfGuests = () => {
    if (!projects.projectUsersAndRoles) {
      return { message1: 'No project users found.', message2: 'No project users found.' };
    }

    const guestRoles = ["ExternalTeamLeader", 'ExternalCollaborator', 'Collaborator','Guest'];
    const guests = projects.projectUsersAndRoles.filter((user) => guestRoles.includes(user.projectRole));

    const numberOfCollaborators = projects.projectUsersAndRoles.length - guests.length;

    const message1 = `You have ${guests.length} Guests and ${numberOfCollaborators} Collaborators.`;
    const message2 = `There are ${guests.length + numberOfCollaborators} members here.`;

    return { message1, message2 };
  };

  // Calculate guests message
  const { message1, message2 } = calculateNumberOfGuests();
  
  return (
    <>
      {projects && (
        projects.userRoleInProject === 'Collaborator' ? (
          <>              
      <Card sx={{height:'150px'}}>
        <CardContent>
          <Grid container spacing={2}>
            {/* Avatars and Image on the left */}
            <Grid item xs={8}>
                    <Box>
          <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
          {projects.projectUsersAndRoles?.length || 0} Collaborators
          </Typography>
          <AvatarGroup max={4}>
   
            {projects.projectUsersAndRoles && projects.projectUsersAndRoles.map((user, index) => (
  <Avatar
    key={index} 
    alt={user.first_name} 
    src={`data:image/png;base64,${user.image}`}
  />
))}

          </AvatarGroup>
          <Typography   sx={{ backgroundColor: '#f1f1f2', borderRadius: '20px', display: 'inline-block', marginTop: '8px', fontSize: '12px',color:"#8a8d93" }}>
          {message2}
          </Typography>
        </Box>
            </Grid>
            <Grid item xs={4}>
              <img src='/images/pages/pose3.png' height={100} alt="Project Image" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>



          </>
        ) : (
          <Card sx={{height:'170px'}}>
          <CardContent>
          <Grid container spacing={2}>
            {/* Avatars and Image on the left */}
            <Grid item xs={8}>
                    <Box>
          <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
          {projects.projectUsersAndRoles?.length || 0} Collaborators
          </Typography>
          <AvatarGroup max={4}>
          {projects.projectUsersAndRoles && projects.projectUsersAndRoles.map((user, index) => (
  <Avatar
    key={index} // Use a unique key for each Avatar element
    alt={user.first_name} // Assuming there's a 'first_name' property in your user object
    src={`data:image/png;base64,${user.image}`}
  />
))}


            {/* Add more avatars as needed */}
          </AvatarGroup>
          {/* Count of Team Members and Guests with background color */}
          <Typography   sx={{ backgroundColor: '#f1f1f2', borderRadius: '20px', display: 'inline-block', marginTop: '8px', fontSize: '12px',color:"#8a8d93" }}>
          {message2}
          </Typography>
        </Box>
            </Grid>
            {/* Image on the right */}
            <Grid item xs={4}>
              <img src='/images/pages/pose3.png' height={100} alt="Project Image" />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    )
    )}
  </>
);
};
export default Card2;
