import React, { useState,useEffect } from 'react';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DraggableDialog from './PaperComponent';
import { loginSuccess } from '../../../../features/reducers/authReducer'
import { useSelector } from 'react-redux';
import MyProjects from './My_projects';
import MyInvitation from './Projects_Invitations';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import EmoticonSad from 'mdi-material-ui/EmoticonSad';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress

const projectsData = [
  { id: 1, name: 'Project 1', description: 'Description for Project 1' },
  { id: 2, name: 'Project 2', description: 'Description for Project 2' },
  { id: 3, name: 'Project 3', description: 'Description for Project 3' },
  { id: 4, name: 'Project 4', description: 'Description for Project 4' },
  { id: 5, name: 'Project 5', description: 'Description for Project 5' },
];

const invitationsData = [
  { id: 1, projectName: 'External Project 1' },
  { id: 2, projectName: 'External Project 2' },
  { id: 3, projectName: 'External Project 3' },
  { id: 4, projectName: 'External Project 4' },
  { id: 5, projectName: 'External Project 5' },
];
const totalProjects = projectsData.length;
const totalInvitations = invitationsData.length;
const Projects = ({ onGoToInsertTab }) => {
  const [projects, setProjects] = useState([]); 
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const totalProjects = projects.length; 
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  const { t } = useTranslation();
  const router = useRouter(); // Add this line to use the useRouter hook
  const [userData, setUserData] = useState(null);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const [activeTab, setActiveTab] = useState("Projects");
  const [isToggled, setIsToggled] = useState(false);
  const [now, setNow] = useState(60);
    
    const handleTabSelect = (selectedTab) => {
      setActiveTab(selectedTab);
    };
    const defaultTabStyles = {
      border: 0,
      color: ' black', 
      marginBottom: '-1px',
      cursor: 'pointer',
    };
    const activeTabStyles = {
      ...defaultTabStyles,
      borderBottom: '2px solid',
      color: '#8C11D4', 
    };
    const  usertoken  = useSelector(loginSuccess);  

    useEffect(() => {
      const checkAuthentication = async () => {
        if (!isAuthenticated) {
          router.push('/');
          return;
        }
        const fetchDataProject = async () => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/all`, {
              headers: {
                Authorization: `Bearer ${usertoken.payload.token}`,
              },
            });
            const data = await response.json();

            setProjects(data);
            setLoadingProjects(false);

          } catch (error) {
            setLoadingProjects(false);

            console.error('Error fetching user data:', error);
          }
        };
        const fetchData = async () => {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil`, {
              headers: {
                Authorization: `Bearer ${usertoken.payload.token}`,
              },
            });
            const data = await response.json();
            setUserData(data);

          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };

        fetchData();
        fetchDataProject();
      };
    
      checkAuthentication();
    }, []);

    return (
      <div className="content-wrapper">
        {/* Loading Indicator */}
        {loadingProjects && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <CircularProgress />
          </div>
        )}

        {!loadingProjects && (
   <div className="d-flex justify-content-around mt-5 mb-5">
        {/* LINE 1 Card 1 */}
        <Card sx={{ width: '30%', height: '250px' }}>
  <CardContent>
    <CardHeader 
      title={
        <Typography variant="subtitle1" >
          {userData && userData.role === 'Admin' 
            ? `${t('Total')} ${totalProjects} ${t('projects')}`
            : `${t('Total')} 0 ${t('projects')}`
          }
        </Typography>
     
      }
    />
        <Typography variant='h5'>
          {t('My_projects')}
        </Typography>
    <Grid container spacing={0.6} alignItems="center">
      <Grid item xs={12}>
    
        <Typography variant='body2'>
          {t('Here_s_a_list_of_all_the_projects_that_I_own_within_my_plan_and_my_team')}
        </Typography>
        
        {userData && userData.role === 'User' && (
                 <Typography variant='body1'  sx={{ marginTop :5 }}>
                 {t('No projects available Yet.')}        </Typography>

        )}

        {userData && userData.role === 'Admin' && (
          <a href="#" style={{ textDecoration: 'none', color: '#93DD5C' }}>
            {t('View_Project')}
          </a>
        )}
      </Grid>
    </Grid>
  </CardContent>
</Card>
<Card sx={{ width: '30%', height: '250px' }}>
  <CardContent>
    <CardHeader 
      title={
        <Typography variant="subtitle1">
          {t(`Total`)} {userData && userData.role === 'User' ? totalProjects : '0'} {t(`Projects_Invitations`)}
        </Typography>
      }
    />
    <Grid container spacing={0.6} alignItems="center">
      <Grid item xs={12}>
        <Typography variant='h5' style={{ marginBottom: '10px' }}>
          {t(`External_Projects`)}
        </Typography>
        {userData && userData.role === 'Admin' && (
                 <Typography variant='body1'  sx={{ marginTop :5 }}>
                 {t('No projects available Yet.')}        </Typography>

        )}
                {userData && userData.role === 'User' && (

        <a href="/view-project" style={{ textDecoration: 'none', color: '#93DD5C' }}>
          {t(`View_Projects_invitations`)}
        </a>
     )}
      </Grid>
    </Grid>
  </CardContent>
</Card>
        <Card sx={{ width: '30%', height: '250px' }}>
                        <CardHeader
                        sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        action={
                          <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            if (userData && userData.role === 'User') {
                              handleOpenDialog();
                            } else {
                              onGoToInsertTab();
                            }
                          }}
                        >
                          {t(`Add_New_Project`)}
                        </Button>
                            
                        }
                        />    
                
                      {isDialogOpen && <DraggableDialog onClose={handleCloseDialog} />}
                
                               <div className="d-flex flex-row">
                                <div className="px-"></div>
                                <div className="px-4"></div>
                                <div className="px-5"> {t(`Add_new_project_if_it_doesn_t_exist`)}
                                </div>
                                </div>
                
                        <CardContent>
                        <Grid container spacing={1} >
                            <div style={{marginTop:'-80px'}} >
                            <img src="/images/pages/pose-m-1.png"width='37px' height='76px' alt="Project Image"  />


                            </div>
                        </Grid>
                        </CardContent>
                    </Card>
                  
      </div>
      )
    }

        {userData && userData.role === 'Admin'  && (
  <div>
    <MyProjects />
  </div>
 )
}{userData && userData.role === 'User' && (
  <div>
    <MyInvitation />
  </div>
 )
}


    </div>
  );
};

export default Projects;
