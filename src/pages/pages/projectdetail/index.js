import React from 'react';

import Grid from '@mui/material/Grid';
import Card1 from './card1';
import Detail from './detail';
import Card2 from './card2';
import Typography from '@mui/material/Typography';
import Meeting from './meeting';
import ProjectTimeline from './projectTimeline';
import DashboardTable from './table';
import UploadDoc from './Document';
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import CircularProgress from '@mui/material/CircularProgress';
import BlankLayout from 'src/@core/layouts/BlankLayout'

import { loginSuccess } from '../../../features/reducers/authReducer'
import { useSelector } from 'react-redux';
import  { useEffect,useState } from 'react';
import { useRouter } from 'next/router'
const Index = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { id } = router.query;
  const [projects, setProjects] = React.useState({});
  const  usertoken  = useSelector(loginSuccess); 
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id}`, {
        method: 'GET',

        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });
      const data = await response.json();

      setProjects(data);

      setLoading(false);
console.log("rject",data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
    useEffect(() => {
      if (usertoken.payload.token == null && isAuthenticated === false) {
        router.push('/pages/login');
      }
      fetchData();

    }, [isAuthenticated,router.query.id,id]);
    if (!isAuthenticated && usertoken.payload.token === null) {
    
      return null;
    }
  return (
    <>
     {loading && (
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
    <div>
      <div style={{ padding: '50px' }}>
        <Typography variant="h4" color="primary" className="text-center" style={{ marginBottom: '-100px' }}>
           {projects.projectName}
        </Typography>
        <img src="/ourimg/bg-FAQ.png" alt="Background Image" className="img-fluid" width={'100%'} style={{ height: "150px" }} />
      </div>
      <Grid container spacing={10}>
  <Grid item xs={12} md={5}>
    <Detail project={projects} />
    <DashboardTable project={projects} />
      <UploadDoc project={projects} />
  </Grid>
  <Grid item xs={12} md={7}>
    <Grid container spacing={10}>
      <Grid item xs={12} md={6}>
        <Card1 project={projects} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Card2 project={projects} />
      </Grid>
      <Meeting project={projects} />
      </Grid>
      <Grid item xs={12} md={12}>
      <ProjectTimeline id={id} />
    </Grid>
  </Grid>
</Grid>
    </div>
    </>
  );
};
export default Index;
