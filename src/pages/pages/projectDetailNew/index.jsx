import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import { useRouter } from 'next/router';
import CustomizedProgressBars from './loading';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import LinearProgress from '@mui/material/LinearProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Task from'./Tabs/Task';

import Team from'./Tabs/Team';
import Meets from'./Tabs/Meets';
import Files from'./Tabs/Files';
import Tickets from'./Tabs/Tickets';
import withAuth from '../../../features/reducers/withAuth';
const CustomTabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: 3 }}>
        <Typography>{children}</Typography>
      </Box>
    )}
  </div>
);

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const usertoken = useSelector(loginSuccess);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch project data');
      }
      const data = await response.json();
      console.log(data);
      setProject(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);


  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleNavigate  = () => {
    router.push('/pages/projectList');
  };
  const handleOpen = () => {
    router.push(`/pages/Editproject?id=${id}`);
  };
  
  return (
    < div style={{}}>
{error ? (
  <Typography variant="body1" color="error">
    {error}
  </Typography>
) : loading ? (
  <CustomizedProgressBars />
) : project ? (
  <>
        
        <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right' }}>
        <Button
        variant="contained"
        onClick={handleNavigate}
        sx={{
          backgroundColor: '#EBF0FA',
          color: '#6226EF',
          borderRadius: '20px',
          textTransform: 'none',
          marginRight: '10px',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#E2EAF8',
          },
        }}
      >
Back to projects      </Button>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          backgroundColor: '#6226EF',
          color: 'white',
          borderRadius: '20px',
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: '#4D1CCB',
          },
        }}
      >
Edit project      </Button>



        </Box>
        <Grid container spacing={2} >
          <Grid item xs={12}>
            <Typography variant="h3" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 700, fontSize: '32px', color: '#202224', marginBottom: '20px' }}>
              {project.projectName}
            </Typography>
          </Grid>
          <Grid item xs={10} > {/* Add margin bottom to create space */}
            <Grid container spacing={28} justifyContent="center">
              <Grid item xs={12} md={6}>
                <div style={{ borderRadius: '20px 20px 0 0 ', overflow: 'hidden' }}>
                  <Image
                    src={`data:image/png;base64,${project.image}`}
                    width={50}
                    height={50}
                    layout="responsive"
                  />
                <LinearProgress variant="determinate" value={project.progress}  style={{height:'10px',borderRadius: '0 0 20px 20px'}} />


                </div>
              </Grid>
              <Grid item xs={12} md={6}>
              <Typography variant="h5" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 700, fontSize: '32px', color: '#202224', marginBottom: '10px' }}>
        Project Details  
    </Typography>
    <Typography variant="body2"  sx={{ fontFamily: 'Nunito Sans', color: '#202224' }}>
    Project Description :  
    </Typography>
    <Typography variant="body2"  sx={{ fontFamily: 'Nunito Sans', color: '#202224', marginBottom: '30px' }}>
     {project.description}
    </Typography>
              <Grid container spacing={12} justifyContent="center" >
          
              <Grid item xs={12} md={6} >

 
              <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464',display: 'inline', marginBottom: '8px' }}>
        Owner: {project.owner}
    </Typography>
    <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
        Start Date: {project.startDate}

    </Typography>
    <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
    Estimated Time: {project.estimatedDuration}

    </Typography>
    <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
    Decipline: {project.descipline}
    </Typography>
    <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
   {project.lod}-{project.loi}
    </Typography>
    <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
    Country: {project.country}
    </Typography>

    <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
    Assigned Team:???
    </Typography>
    <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
    Project Manager: ???
    </Typography>
    </Grid>
    <Grid item xs={12} md={6}>
    <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px'}}>
    Company: {project.company} 
    </Typography>
    <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
    End Date:{project.enddate} 
    </Typography>
    <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
    Language: {project.lang} 
    </Typography>
   
    <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464',display: 'inline', marginBottom: '8px', marginTop: '8px' }}>
    Project Status: {project.status}
    </Typography>
 
    <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464' , marginBottom: '8px', marginTop: '8px'}}>
    Meets: ???
    </Typography>
    <Typography variant="body2" component="h1" sx={{ fontFamily: 'Nunito Sans', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
    Tickets issued: ???
    </Typography>
  
    </Grid>  
      </Grid>
    </Grid>

            </Grid>
          </Grid>
        </Grid>
  
<Box sx={{ width: '100%',marginTop:'50px' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered sx={{background:'white'}}  >
          <Tab label="Team" sx={{fontSize:'16px',fontWeight:'500', color :'#3A3541',fontFamily: 'Nunito Sans'}}/>
          <Tab label="Files"   sx={{fontSize:'16px',fontWeight:'500', color :'#3A3541',fontFamily: 'Nunito Sans'}}/>
          <Tab label="Meets"   sx={{fontSize:'16px',fontWeight:'500', color :'#3A3541',fontFamily: 'Nunito Sans'}}/>
          <Tab label="Tickets"  sx={{fontSize:'16px',fontWeight:'500', color :'#3A3541',fontFamily: 'Nunito Sans'}}/>
          <Tab label="Task"  sx={{fontSize:'16px',fontWeight:'500', color :'#3A3541',fontFamily: 'Nunito Sans'}}/>

        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Team  />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Files id={id}/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
      <Meets/> 
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <Tickets/>
      </CustomTabPanel>   
      <CustomTabPanel value={value} index={4}>
        <Task />
      </CustomTabPanel>
    </Box></>
      ) : null}
    </div>
  );
};

export default withAuth(Index);
