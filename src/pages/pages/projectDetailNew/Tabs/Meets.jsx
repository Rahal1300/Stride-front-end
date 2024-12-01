import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { format, addMinutes } from 'date-fns';
import { loginSuccess } from '../../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import { EmojiEvents } from '@mui/icons-material'; 
import Image from 'next/image'; 
import { styled } from '@mui/material/styles'

const Meets = ({ id }) => {
  const userToken = useSelector(loginSuccess);
  const [loading, setLoading] = useState(false);
  const [meetings, setMeetings] = useState([]);

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users/projects/${id}/visits`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken.payload.token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch project data');
      }
      const fetchedData = await response.json();
      setMeetings(fetchedData);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const getLabelColor = (label) => {
    switch (label) {
      case 'Urgent':
        return '#F44336'; 
      case 'Important':
        return '#2196F3'; 
      case 'High Priority':
        return '#4CAF50'; 
      case 'Low Priority':
        return '#FFC107'; 
      default:
        return '#9E9E9E'; 
    }
  };
  const Img = styled('img')(({ theme }) => ({
    marginBottom: theme.spacing(10),
    [theme.breakpoints.down('lg')]: {
      height: 450,
      marginTop: theme.spacing(10)
    },
    [theme.breakpoints.down('md')]: {
      height: 400
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: theme.spacing(13)
    }
  }))
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Box sx={{ width: '100%' }}>
          {meetings.length === 0 ? (
            
<Box>
            <Box  >
  <Typography variant="h5" color="text.secondary" sx={{ marginLeft: '30%',marginTop: '50px'  }}>
    No meetings scheduled
  </Typography>

  </Box>
  <Box sx={{ display: 'flex', justifyContent: 'center'}}>

<Img height='487' alt='error-illustration' src='/images/pages/500.png'  />
</Box>


  
</Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              {meetings.map((meeting, index) => (
                <Box key={index} sx={{ marginTop: 8 }}>
                  <Grid container>
                    <Grid container sx={{ backgroundColor: '#F9F8F9', marginBottom: 2 }}>
                      <Grid item xs={6}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600, marginRight: '10px', margin: '0px 8px 8px 0', fontSize: '14px' }}>
                          {format(new Date(meeting.startDate), 'MMMM dd, yyyy')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600, marginRight: '10px', margin: '0px 8px 8px 0', fontSize: '14px' }}>
                          {format(new Date(meeting.startDate), 'EEEE')}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid item xs={4}>
                      <Typography variant="body1" color="text.secondary">
                        {`${format(new Date(meeting.startDate), 'h:mm a')} - ${format(addMinutes(new Date(meeting.startDate), meeting.duration), 'h:mm a')}`}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Box
                        sx={{
                          display: 'inline-block',
                          borderRadius: '50%',
                          width: '10px',
                          height: '10px',
                          marginTop: '5px',
                          marginRight: '5px',
                          backgroundColor: getLabelColor(meeting.label),
                        }}
                      ></Box> {meeting.label}
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body1" color="text.secondary">
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Meets;
