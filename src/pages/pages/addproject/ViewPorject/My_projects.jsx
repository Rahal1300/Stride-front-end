import React, { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import EyeOutlineIcon from 'mdi-material-ui/EyeOutline';
import DotsVerticalIcon from 'mdi-material-ui/DotsVertical';
import ProgressBar from 'react-bootstrap/ProgressBar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EmoticonSad from 'mdi-material-ui/EmoticonSad';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../../features/reducers/authReducer';
import Link from 'next/link';
import { useTheme } from '@mui/material/styles';
import Switch from '@mui/material/Switch';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';

const MyProjects = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState("Searching for Project");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [loadingProjects, setLoadingProjects] = useState(true);
  const usertoken = useSelector(loginSuccess);
  const theme = useTheme();
  const [switchChecked, setSwitchChecked] = useState(false); // State to store the checked value of the switch
  const [showModal, setShowModal] = useState(false);
  const [projectIdToDisable, setProjectIdToDisable] = useState(null);
  const fetchData = async () => {
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
      console.error('Error fetching user data:', error);
    }
  };

  const disableProject = async (projectId, isActive) => {
    setLoadingProjects(true);
    setMessage(`Updating project status...`);

    try {
      const status = isActive ? "Active" : "Desactiver";
      const formData = new URLSearchParams();
      formData.append('projectDisabled', status);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${projectId}/updateStatus`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      if (response.ok) {
        setMessage("Project status updated successfully.");
        setTimeout(() => {
          setLoadingProjects(false);
        }, 1000); // Set loadingProjects to false after 1 second
      }
      else {
        setMessage("Failed to update project status.");

      }

      // Handle response as needed
    } catch (error) {
      console.error('Cannot update project status:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);


  const handleToggleModal = (projectId) => {
    setShowModal(true);
    setProjectIdToDisable(projectId);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProjectIdToDisable(null);
  };
  const handleDisableProject = async () => {
    await disableProject(projectIdToDisable, switchChecked);
    handleCloseModal();
    fetchData()
  };


  return (
    <div>


      {loadingProjects && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress size={70} />
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
            {message}
          </Typography>
        </div>
      )}
      {!loadingProjects && projects.length > 0 && (
     
        <div>

          <Typography variant="h5" style={{ marginBottom: '10px', marginLeft: '30px' }}>
            {t('My_projects')}
          </Typography>
          <Typography variant="body2" style={{ marginBottom: '30px', marginLeft: '30px' }}>
            {t('Here_s_a_list_of_all_the_projects')}
          </Typography>
          <div className="d-flex flex-wrap justify-content-center">
          {currentProjects.map((project, index) => (
    (((project.status === "Active") || (project.userRoleInProject === "TeamManager"))) && (
      <Card key={index} style={{ marginRight: '20px', width: '30%' }}>
                <CardHeader
                  title={project.projectName}
                  subheader={project.description}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                />
          


                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>{/* Left side content */}</div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="form-check form-switch" style={{ marginRight: '8px', marginBottom: 0 }}>
                    {project.userRoleInProject === "TeamManager"  && (
                        <Switch
                        checked={project.status === "Active"}
                        onChange={(e) => {
                          handleToggleModal(project.id);
                          setSwitchChecked(e.target.checked);
                        }}
                        />
                        )}
                                            
                    </div>
                    <div style={{ backgroundColor: theme.palette.background.default, borderColor: '#F3E7FA', borderRadius: '23px' }}>
                      <IconButton style={{ marginRight: '8px' }}>
                        <Link
                          href={{
                            pathname: `/pages/projectdetail/`,
                            query: {
                              id: project.id,
                            },
                          }}
                        >
                          <EyeOutlineIcon />
                        </Link>
                      </IconButton>
                      <IconButton>
                        <DotsVerticalIcon />
                      </IconButton>
                    </div>
                  </div>
                </CardContent>
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Typography color="textSecondary"> {t('Start_Date')} </Typography>
                    <Typography variant="h6" color="textSecondary">
                      {project.startDate}
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="body2" color="textSecondary">
                      {t('Estimated_End_Date')}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                      {project.enddate}
                    </Typography>
                  </div>
                </CardContent>

                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Typography color="textSecondary"> {t('Scheduled_Meetings')} </Typography>
                    <Typography variant="h6" color="textSecondary">
                      5
                    </Typography>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="body2" color="textSecondary">
                      {t('Progress')} {project.progress} %
                    </Typography>
                    <div style={{ width: '100px' }}>
                      <ProgressBar now={project.progress} striped variant="danger" />
                    </div>
                  </div>
                </CardContent>

                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    {/* <AvatarGroup max={4}>
                      {project.avatars.map((avatar, avatarIndex) => (
                        <Avatar key={avatarIndex} src={avatar} alt={`Avatar ${avatarIndex + 1}`} />
                      ))}
                    </AvatarGroup> */}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Box sx={{ background: `#F3E7FA`, borderRadius: '23px', padding: '8px' }}>
                      <Typography
                        sx={{
                          background: `linear-gradient(45deg, #9155FD, #FF4F9A)`,
                          borderRadius: '23px',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {t('Last_meeting')} 56 {t('Days_Ago')}
                      </Typography>
                    </Box>
                  </div>
                </CardContent>

               


              </Card>
            )
))}
          </div>
        </div>
      )
      
      
      
      }
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button key={i} onClick={() => handlePageChange(i + 1)}>
            {i + 1}
          </Button>
        ))}
        <Modal
          open={showModal}
          onClose={handleCloseModal}
          aria-labelledby="confirm-disable-modal"
          aria-describedby="confirm-disable-project"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999, 
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="body1">Are you sure you want to enable/disable the project &quot;{projects.find(p => p.id === projectIdToDisable)?.projectName}&quot;?
              </Typography>
              <Typography>  This project is currently {projects.find(p => p.id === projectIdToDisable)?.status}.</Typography>
              <Button onClick={handleDisableProject}>Yes</Button>
              <Button onClick={handleCloseModal}>No</Button>
            </CardContent>
          </Card>
        </Modal>
      </div>
    </div>
  );
};

export default MyProjects;
