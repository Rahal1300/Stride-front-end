import React, { useState, useEffect } from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useRouter } from 'next/router';

const ProjectTimeline = (id) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const usertoken = useSelector(loginSuccess);
  const [invitationData, setInvitationData] = useState(null);
  const idproject = id.id;

  useEffect(() => {
    const fetchData2 = async () => {
      setLoading(true);

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${idproject}/timeline`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });
        const data = await response.json();
        setInvitationData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setLoading(false);
      }
    };

    fetchData2();
  }, [usertoken.payload.token, idproject,id]);

  return (
    <Card sx={{ marginTop: '20px', width: '100%' }}>
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
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress size={70} />
        </div>
      )}
      <CardContent>
        <Timeline
          sx={{
            [`& .${timelineItemClasses.root}:before`]: {
              flex: 0,
            },
          }}
        >
        
       
          <TimelineItem>
            <TimelineSeparator>
              <TimelineDot color={'info'} />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>Project Activity </Typography>
              {invitationData && invitationData.toReversed().map((item, index) => (
                <React.Fragment key={index}>
                  <TimelineContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={`data:image/png;base64, ${item.userImage}`} alt='Alice Cobb' />
                    <Typography variant="body2" style={{ marginLeft: '10px' }}>{item.message}</Typography>
                    
                  </TimelineContent>
                </React.Fragment>
              ))}
            </TimelineContent>
          </TimelineItem>
    
        </Timeline>
        {/* <Button >
          View All
        </Button> */}
      </CardContent>
    </Card>
  );
};

export default ProjectTimeline;
