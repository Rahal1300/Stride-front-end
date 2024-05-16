import React, { useState,useEffect } from 'react';


import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import AvatarGroup from '@mui/material/AvatarGroup'
import Check from 'mdi-material-ui/Check'
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import Card1 from './card1';
import { loginSuccess } from '../../../features/reducers/authReducer'
import { useSelector } from 'react-redux';
import EditableModal from'./Modale';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';

const Detail = (project ) => {
 
  const handleDetailPageRefresh = async () => {
    // Refetch the project details or perform any actions needed to update the detail page
    await fetchData();
  };
  const { t } = useTranslation();
  const [projects, setProjects] = React.useState([]);
  const router = useRouter();

  const [checked, setChecked] = React.useState(true);
  const  usertoken  = useSelector(loginSuccess); 
  const idproject = router.query.id || '';
    const { id } = router.query;
    const [loading2, setLoading2] = useState(false);


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

    const { message1, message2 } = calculateNumberOfGuests();

  useEffect(() => {
  if(project){
    
  setProjects(project.project); // Use the project prop directly
    // fetchData();
    // setLoading2(false);

  }
    }, [router.query.id,project]);
    

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  return (
    <>
    {loading2 && (
     <div
       style={{
         position: 'fixed',
         top: 0,
         left: 0,
         width: '100%',
         height: '100%',
         background: 'rgba(255, 255, 255, 0.8)',
         display: 'flex',
         flexDirection: 'column', // Updated to column layout
         alignItems: 'center',
         justifyContent: 'center',
         zIndex: 9999,
       }}
     >
     <CircularProgress size={70} />
     <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
    </Typography>
 </div>
   )}
    <Card >

    <div className="content-wrapper">
    <CardMedia sx={{ height: '12.625rem' }} image={`data:image/png;base64,${projects.image}`} />
      <Avatar
        alt='Robert Meyer'
        src='/images/avatars/1.png'
        sx={{
        width: 75,
    height: 75,
    left: '1.313rem',
    top: '12.28125rem', 

    position: 'absolute',
          border: theme => `0.25rem solid ${theme.palette.common.white}`
        }}
      />
      <CardContent>
        <Box
                sx={{
                    mt: 5.75,
                    mb: 8.75,
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
                >
                <Box sx={{ mr: 2, mb: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='h6'>{projects.projectName}  </Typography>
                    <Typography variant='caption'>{projects.country} </Typography>
                </Box>
                <Button variant='contained'>Media</Button>
                </Box>
                <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='subtitle2' sx={{ whiteSpace: 'nowrap', color: 'text.primary' }}>
                {projects.projectUsersAndRoles?.length || 0} Collaborators
                                </Typography>
                <AvatarGroup max={4}>
                    <Avatar src='/images/avatars/8.png' alt='Alice Cobb' />
                    <Avatar src='/images/avatars/7.png' alt='Jeffery Warner' />
                    <Avatar src='/images/avatars/3.png' alt='Howard Lloyd' />
                    <Avatar src='/images/avatars/2.png' alt='Bettie Dunn' />
                    <Avatar src='/images/avatars/4.png' alt='Olivia Sparks' />
                    <Avatar src='/images/avatars/5.png' alt='Jimmy Hanson' />
                    <Avatar src='/images/avatars/6.png' alt='Hallie Richards' />
                </AvatarGroup>
                </Box>
                <Box sx={{ padding:'20px' }}>

                <div style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar
                  variant='rounded'
                  sx={{ width: 48, height: 48, color: 'primary.main', backgroundColor: '#fee8e7' }}
                >
                  <Check sx={{ fontSize: '1.75rem' }} />
                </Avatar>
              <div style={{  marginRight: '10px',marginLeft:'20px' }}>
           
                <div>
                  <Typography  variant='h6' sx={{  marginTop: '5px' }}>14320</Typography>
                  <Typography variant='subtitle2'>Task Done</Typography>
                </div>
              </div>

              {/* Second Avatar and Typography */}
              <Avatar
                  variant='rounded'
                  sx={{ width: 48, height: 48, color: 'primary.main', backgroundColor: '#fee8e7' }}
                >
                  <Check sx={{ fontSize: '1.75rem' }} />
                </Avatar>
              <div style={{  marginLeft:'20px' ,marginLeft:'20px' }}>
               
              <div>
                  <Typography  variant='h6' sx={{  marginTop: '5px' }}>{projects.progress}%</Typography>
                  <Typography variant='subtitle2'>Progress</Typography>
                </div>
             
              </div>
            </div> </Box>
      </CardContent>
     
      <CardContent  sx={{margin:'10px'}}>
    
 
        <Typography variant="h6" gutterBottom>
        Details        </Typography>

        <TextField
                    fullWidth
                
                    value={projects.description || ''}                   
                     multiline
                    rows={2} sx={{margin:'10px'}}
                  />
      <Typography variant="body2" color="text.secondary">
  Status: {projects.status === 'Active' ? 'Active' : projects.status === 'Inactive' ? 'Inactive' : 'Pending'}
  <Switch
    checked={projects.status === 'Active'}
    onChange={handleChange}
    inputProps={{ 'aria-label': 'controlled' }}
  />
</Typography>
        <Typography variant="subtitle2" color= 'text.primary' >
          Project manager: {' '}
          <Typography variant="subtitle2" color="text.secondary" component="span"  sx={{margin:'10px'}}>
          {projects.projectmanager}
          </Typography>
        </Typography>

        <Typography variant="subtitle2" color= 'text.primary' >
          Start:
          {' '}
          <Typography variant="subtitle2" color="text.secondary" component="span" sx={{margin:'10px'}}>
          {projects.startDate}
          </Typography>
            End: 
            {' '}
          <Typography variant="subtitle2" color="text.secondary" component="span" sx={{margin:'10px'}}>
          {projects.enddate}
          </Typography>
          
        </Typography>

        <Typography variant="subtitle2" color="text.primary">
          Estimated Duration: 
          {' '}
          <Typography variant="subtitle2" color="text.secondary" component="span" sx={{margin:'10px'}}>
          {projects.estimatedDuration}
</Typography>
        </Typography>
      <Typography variant="subtitle2" color="text.primary">
        Extend To :
          {' '}
          <Typography variant="subtitle2" color="text.secondary" component="span" sx={{margin:'10px'}}>
          {`${new Date(projects.extendto).getFullYear()}-${String(new Date(projects.extendto).getMonth() + 1).padStart(2, '0')}-${String(new Date(projects.extendto).getDate()).padStart(2, '0')}`}
</Typography>
</Typography>
        <Typography variant="subtitle2" color="text.primary">
                    {projects.loi}

          {' '}
        
        <Typography variant="subtitle2" color="text.secondary" component="span"  sx={{margin:'10px'}}>
         {projects.lod}
          </Typography>
        </Typography>

        <Typography variant="subtitle2" color="text.primary">
          Meeting frequency:  {projects.meetingfreq}
          <Typography variant="subtitle2" color="text.secondary" component="span"  sx={{margin:'10px'}}>
          High          </Typography>
        </Typography>

        <Typography variant="subtitle2" color="text.primary">
          Department: 
          <Typography variant="subtitle2" color="text.secondary" component="span"  sx={{margin:'10px'}}>
          {projects.departement}       </Typography>
        </Typography>
        <Typography variant="subtitle2" color="text.primary">
          Language: 
          <Typography variant="subtitle2" color="text.secondary" component="span"  sx={{margin:'10px'}}>
          {projects.lang}  </Typography>
        </Typography>
        <Typography variant="subtitle2" color="text.primary">
        progress: 
          <Typography variant="subtitle2" color="text.secondary" component="span"  sx={{margin:'10px'}}>
          {projects.progress}  </Typography>
        </Typography>
        <Typography variant="body2" color="text.primary">
          Country: 
          <Typography variant="subtitle2" color="text.secondary" component="span"  sx={{margin:'10px'}}>
          {projects.country}  </Typography>
        </Typography>
        {projects && (
  <>
    {projects.userRoleInProject == "TeamManager" ? (
      <>
        <Button variant="contained" onClick={handleModalOpen} sx={{ mt: '15px', mr: 15 }}>
          Edit
        </Button>
        <Button type='reset' variant='outlined' color='error' sx={{ mt: '15px' }}>
          Suspend
        </Button>
      </>
    ) : projects.userRoleInProject === 'TeamLeader' ? (
      <Button variant="outlined" onClick={handleModalOpen} sx={{ mt: '15px' }}>
        Edit 
      </Button>
    ) : null}
  </>
)}
    <EditableModal open={modalOpen} handleClose={handleModalClose}  idproject={idproject}  role={projects.userRoleInProject}    ProjectNameFromDetail={projects.projectName}    
/>      
      </CardContent>
      </div>
    </Card>
    </>
);
};

export default Detail;
