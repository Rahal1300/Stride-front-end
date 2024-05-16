import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';

const Meeting = ({ project }) => {

  const router = useRouter();
  const usertoken = useSelector(loginSuccess);
  const idproject = router.query.id || '';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (project && project) {
      setProjects(project);
    }
  }, []); // Use idproject instead of router.query.id

  const handleRequestMeeting = () => {
    router.push({
      pathname: '/pages/addproject/addproject/meeting',
      query: {
        id: project.id,
      },
    });
 
  };

  return (
    <Card sx={{marginLeft:'40px',marginTop:'40px',width: '100%'}}>
      { projects  && (
        <>
          {projects.userRoleInProject === "Admin" || projects.userRoleInProject === 'TeamManager' || projects.userRoleInProject === 'TeamLeader' ? (
            <Card style={{ display: 'flex', height: '100%', width: '100%', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Typography variant='h6' style={{ padding: '5px' }}>Join a meeting</Typography>
                <Typography style={{ paddingBottom: '15px' }}>Request or schedule a meeting</Typography>
                <Button variant='contained' onClick={handleRequestMeeting}>Create Meeting</Button>
              </CardContent>
              <img src="/images/meeting.png" style={{ width: '150px', height: '150px' }} alt="Meeting Image" />
            </Card>
          ) : (
            <Card style={{ display: 'flex', height: '100%', width: '100%', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
              <CardContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                <Typography variant='h6' style={{ padding: '5px' }}>Start a new meeting</Typography>
                <Typography style={{ paddingBottom: '15px' }}>Request or schedule a meeting</Typography>
                <Button variant='contained' onClick={handleRequestMeeting}>Request a meeting</Button>
              </CardContent>
              <img src="/images/meeting.png" style={{ width: '150px', height: '150px' }} alt="Meeting Image" />
            </Card>
          )}
        </>
      )}
    </Card>
  );
};

export default Meeting;