import React, { useState,useEffect } from 'react';
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
import { loginSuccess } from '../../../../features/reducers/authReducer'
import Link from 'next/link'
import CircularProgress from '@mui/material/CircularProgress'; 

const MyProjects = () => {
  const [now, setNow] = useState(60);
  const { t } = useTranslation();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;
  const [loadingProjects, setLoadingProjects] = useState(true);
  const usertoken = useSelector(loginSuccess);

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
      setLoadingProjects(false); 
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const indexOfLastProject = currentPage * itemsPerPage;
  const indexOfFirstProject = indexOfLastProject - itemsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      {loadingProjects && (
        <div >
        </div>
      )}

      {!loadingProjects && projects.length > 0 && (
        <div>
          <Typography variant="h5" style={{ marginBottom: '10px', marginLeft: '30px' }}>
          {t("Projects_Invitations")}

  </Typography>
  <Typography variant="body2" style={{ marginBottom: '30px', marginLeft: '30px' }}>
            {t("Here_s_a_list_of_all_the_projects")}

  </Typography>
  <div className="d-flex flex-wrap justify-content-center">
        {currentProjects.map((project, index) => (
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
              <div>
                {/* Left side content */}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Right side content */}
                <div className="form-check form-switch" style={{ marginRight: '8px', marginBottom: 0 }}>
                  <input
                    className="form-check-input "
                    type="checkbox"
                    role="switch"
                    id={`flexSwitchCheckChecked${index}`}
                    style={{ backgroundColor: '#8C11D4', borderColor: '#8C11D4' }}
                  />
                </div>
                <div style={{ backgroundColor: '#F3E7FA', borderColor: '#F3E7FA', borderRadius: '23px' }}>
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
                <Typography color="textSecondary">  {t("Start_Date")} </Typography>
                <Typography variant="h6" color="textSecondary">
                  {project.startDate}
                </Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="body2" color="textSecondary">
                   {t("Estimated_End_Date")}
                  
                </Typography>
                <Typography variant="h6" color="textSecondary">
                  {project.enddate}
                </Typography>
              </div>
            </CardContent>

            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Typography color="textSecondary">  {t("Scheduled_Meetings")}
</Typography>
                <Typography variant="h6" color="textSecondary">
                5</Typography>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="body2" color="textSecondary">
               {t("Progress")} {project.pogress} %
                </Typography>
                <div style={{ width: '100px' }}>
                  <ProgressBar now={project.pogress} striped variant="danger" />
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
                    {t("Last_meeting")} 56  {t("Days_Ago")} 
                  </Typography>
                </Box>
              </div>
            </CardContent>
            
       
            
            </Card>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button key={i} onClick={() => handlePageChange(i + 1)}>
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProjects;