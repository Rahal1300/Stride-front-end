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
import Task from './Tabs/Task';
import Revision from './Tabs/Revision';
import RevisionTable from './Tabs/RevisionTable';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Team from './Tabs/Team';
import Meets from './Tabs/Meets';
import Files from './Tabs/Files';
import Tickets from './Tabs/Tickets';
import withAuth from '../../../features/reducers/withAuth';
import axios from 'axios';

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
      setProject(data);
      console.log(data);
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
  const handleNavigate = () => {
    router.push('/pages/projectList');
  };

  const handleOpen = () => {
    router.push(`/pages/Editproject?id=${id}`);
  };
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
     return data;
  
    } catch (error) {
      console.error('Error fetching profile data:', error.message);
    }
  };
  const cloneProjectToBimFlow = async (


  ) =>{

    const user = await fetchProfileData();
    console.log("project ",project);
   
    const data = {
      projectName:project.projectName,

      description:project.description,

      image:project.image,

      documents:project.documents,

      user,

      project_id:project.id,

      project_users:project.projectUsersAndRoles,

     

    }
    const response = await axios.post('https://adae-41-225-11-34.ngrok-free.app/api/v1/objects/stride',data)
  

    console.log(response.data);


  }
  // Decoding token logic
  const base64Url = usertoken?.payload?.token?.split('.')[1];
  let isAdmin = false;
  let isTeamManager = false;
  if (base64Url) {
    try {
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const decodedToken = JSON.parse(window.atob(base64));

      isAdmin = decodedToken.role === 'Admin';
      isTeamManager = decodedToken.cr === 'TeamManager';
    } catch (error) {
      console.error('Error decoding token:', error.message);
    }
  }
  const shouldShowModifyIcon = isAdmin || isTeamManager;
  const userrole = useSelector(state => state.Role);
  const cr = useSelector(state => state.Cr);
  const Owner = userrole === 'Subscriber' && cr === 'Owner';
  const TeamManagerandOwner = userrole === 'Subscriber' && cr === 'TeamManager';
  const Manager = userrole === 'User' && cr === 'TeamManager';
  return (
    <ThemeProvider theme={theme}>
      <div>
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
                Back to projects
              </Button>
              <Button
                variant="contained"
                onClick={handleOpen}
                disabled={userrole === 'User'}
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
                Edit project
              </Button>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h3" component="h1" sx={{ fontFamily: 'Arial ', fontWeight: 700, fontSize: '32px', color: '#202224', marginBottom: '20px' }}>
                  {project.projectName || "Project Name Not Available"}
                </Typography>
              </Grid>
              <Grid item xs={10}>
                <Grid container spacing={28} justifyContent="center">
                  <Grid item xs={12} md={6}>
                    <div style={{ borderRadius: '20px 20px 0 0 ', overflow: 'hidden' }}>
                      <Image
                        src={`data:image/png;base64,${project.image || ''}`}
                        width={50}
                        height={50}
                        layout="responsive"
                        alt="Project Image"
                      />
                      <LinearProgress variant="determinate" value={project.progress || 0} style={{ height: '10px', borderRadius: '0 0 20px 20px' }} />
                    </div>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h5" component="h1" sx={{ fontFamily: 'Arial ', fontWeight: 700, fontSize: '32px', color: '#202224', marginBottom: '10px' }}>
                      Project Details
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Arial ', color: '#202224' }}>
                      Project Description:
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: 'Arial ', color: '#202224', marginBottom: '30px' }}>
                      {project.description || "Description not available"}
                    </Typography>
                    <Grid container spacing={12} justifyContent="center">
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" component="h1" sx={{ fontFamily: 'Arial ', fontWeight: 200, fontSize: '14px', color: '#646464', display: 'inline', marginBottom: '8px' }}>
                          Owner: {project.owner || "Not available"}
                        </Typography>
                        <Typography variant="body2" component="h1" sx={{ fontFamily: 'Arial ', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
                          Start Date: {project.startDate || "Not available"}
                        </Typography>
                        <Typography variant="body2" component="h1" sx={{ fontFamily: 'Arial ', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
                          Estimated Time: {project.estimatedDuration || "Not available"}
                        </Typography>
                        <Typography variant="body2" component="h1" sx={{ fontFamily: 'Arial ', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
                          Discipline: {project.discipline || "Not available"}
                        </Typography>
                        <Typography variant="body2" component="h1" sx={{ fontFamily: 'Arial', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
                          {project.lod && project.loi ? `${project.lod}-${project.loi}` : "Details not available"}
                        </Typography>
                        <Typography variant="body2" component="h1" sx={{ fontFamily: 'Arial ', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
                          Country: {project.country || "Not available"}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body2" component="h1" sx={{ fontFamily: 'Arial ', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px' }}>
                          Company: {project.company || "Not available"}
                        </Typography>
                        <Typography variant="body2" component="h1" sx={{ fontFamily: 'Arial ', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
                          End Date: {project.endDate || "Not available"}
                        </Typography>
                        <Typography variant="body2" component="h1" sx={{ fontFamily: 'Arial ', fontWeight: 200, fontSize: '14px', color: '#646464', marginBottom: '8px', marginTop: '8px' }}>
                          Language: {project.lang || "Not available"}
                        </Typography>
                        <Typography variant="body2" component="h1" sx={{ fontFamily: 'Arial ', fontWeight: 200, fontSize: '14px', color: '#646464', display: 'inline', marginBottom: '8px', marginTop: '8px' }}>
                          Project Status: {project.status || "Not available"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Box sx={{ width: '100%', marginTop: '50px' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered sx={{ background: 'white' }}>
                  {/* <Tab label="Dashboard" sx={{ fontSize: '16px', fontWeight: '600', color: '#3A3541', fontFamily: 'Arial ' }} /> */}
                  <Tab label="Team" sx={{ fontSize: '16px', fontWeight: '600', color: '#3A3541', fontFamily: 'Arial ' }} />
                  {(Owner || Manager || TeamManagerandOwner) ? <Tab label="Files" sx={{ fontSize: '16px', fontWeight: '600', color: '#3A3541', fontFamily: 'Arial ' }} /> : null}
                  <Tab label="Meets" sx={{ fontSize: '16px', fontWeight: '600', color: '#3A3541', fontFamily: 'Arial ' }} />
                  <Tab label="Tickets" sx={{ fontSize: '16px', fontWeight: '600', color: '#3A3541', fontFamily: 'Arial ' }} />
                  <Tab label="Task" sx={{ fontSize: '16px', fontWeight: '600', color: '#3A3541', fontFamily: 'Arial ' }} />
                  <Tab label="Revision" sx={{ fontSize: '16px', fontWeight: '600', color: '#3A3541', fontFamily: 'Arial ' }} />
                </Tabs>
              </Box>
              {/* <CustomTabPanel value={value} index={0}>
              </CustomTabPanel> */}
              <CustomTabPanel value={value} index={0}>
                <Team Team={project.projectUsersAndRoles} />
              </CustomTabPanel>
              {Owner || Manager || TeamManagerandOwner ? (
                <CustomTabPanel value={value} index={1}>
                  <Files id={id} />
                </CustomTabPanel>
              ) : null}
              <CustomTabPanel value={value} index={Owner || Manager || TeamManagerandOwner ? 2 : 1}>
                <Meets id={id} />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={Owner || Manager || TeamManagerandOwner ? 3 : 2}>
                <Tickets />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={Owner || Manager || TeamManagerandOwner ? 4 : 3}>
                <Task
                  descipline={project.descipline}
                  progress={project.progress}
                  base={project.base}
                  floornb={project.floor}
                  Team={project.projectUsersAndRoles}
                  id={id}
                  documents={project.documents}
                  remain={project.remainProgress}
                  start={project.startDate}
                  end={project.enddate}
                  onUpdate={fetchData}
                />
              </CustomTabPanel>
              <CustomTabPanel value={value} index={Owner || Manager || TeamManagerandOwner ? 5 : 4}>
                <Revision
                  descipline={project.descipline}
                  progress={project.progress}
                  base={project.base}
                  floornb={project.floor}
                  Team={project.projectUsersAndRoles}
                  id={id}
                  documents={project.documents}
                  remain={project.remainProgress}
                  start={project.startDate}
                  end={project.enddate}
                  onUpdate={fetchData}
                />
              </CustomTabPanel>
              <Button onClick={cloneProjectToBimFlow}> send to BimFlow</Button>
            </Box>
          </>
        ) : null}
      </div>
    </ThemeProvider>
  );
};

export default withAuth(Index);