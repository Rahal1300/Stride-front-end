import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

const Card1 = ({ project }) => {

  const { t } = useTranslation(); // Hook to access translations
  const year = 2021;
  const router = useRouter();
  const usertoken = useSelector(loginSuccess);
  const idproject = router.query.id || '';
  const { id } = router.query;
  const [projects, setProjects] = useState({});
  const settings = {
    mode: 'dark',
  };



  useEffect(() => {
    if (project ) {
      setProjects(project);
    }
  }, [project]);
  return (
    <>
      {projects && (
   
        projects.userRoleInProject === 'Collaborator' ? ( <>              
            <div>

        <Card >
        <CardContent >
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Box >
                <Typography  variant='h5'>{t('Meetings')}</Typography>
                <Typography style={{ padding: '10px' }} variant='h5'>1</Typography>
                <Typography 
                  variant='body1'      color="primary.main"
                  
                  style={{
                    backgroundColor: '#f2ebff', 
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500'                 }}
                >
                    Next Meeting will be at 15/20/2223 
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
    </div>

          </> ) : (  
    <div>
      <Card >
        <CardContent >
          <Grid container spacing={2}>
            <Grid item xs={8}>
              <Box >
                <Typography  variant='h5'>{t('Meetings')}</Typography>
                <Typography style={{ padding: '10px' }} variant='h5'>18</Typography>
                <Typography 
                  variant='body1'      color="primary.main"
                  
                  style={{
                    backgroundColor: '#f2ebff', 
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '500'                 }}
                >
                  Last meeting took place 3 days ago
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
    </div>
    )
      )}
    </>
  );
};

export default Card1;
