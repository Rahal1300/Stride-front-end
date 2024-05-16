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
import AvatarGroup from '@mui/material/AvatarGroup';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useRouter } from 'next/router';
import PaginationControls from './PaginationControls';

const ProjectTimeline = (id) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const usertoken = useSelector(loginSuccess);
  const [invitationData, setInvitationData] = useState(null);
  const idproject = id.id;
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const currentItems = invitationData && invitationData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
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
  }, [usertoken.payload.token,idproject]);

  return (
    <div>
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
      <Card sx={{ marginTop: '20px', width: '915px' }}>
        <CardContent>
          <Typography>Project Activity Timeline</Typography>
          <Timeline
            sx={{
              [`& .${timelineItemClasses.root}:before`]: {
                flex: 0,
              },
            }}
          >
 
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="error" />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6">12 Invoices have been paid</Typography>
                <Typography variant='body2' style={{ padding: "5" }}> Invoices have been paid to the company
                </Typography>
                <Typography variant='subtitle2' style={{ padding: "5px" }}> <img src="/images/ourimg/PDF.png" /> Attachments: Invoices.pdf
                </Typography>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
              <TimelineSeparator>
                <TimelineDot color="primary" />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant='h6' style={{ marginTop: "-5px" }}>Meeting with john</Typography>
                <Typography variant='subtitle2' style={{ padding: "5px" }}> Project meeting with john @10:15am
                </Typography>
                <Typography variant='subtitle2' style={{ padding: "5px" }}>
                  <Box sx={{ display: 'flex' }} style={{ marginLeft: "5px" }}>
                    <Avatar src='/images/avatars/8.png' alt='Alice Cobb' />
                    <Typography variant="body2" style={{ padding: "5px" }}>John Doe (Client) </Typography>
                  </Box>
                  <Typography variant="body1" style={{ marginLeft: "45px" }} > Project meeting with John @10:15am</Typography>
                </Typography>
              </TimelineContent>
            </TimelineItem>
            <TimelineItem>
      <TimelineSeparator>
      <TimelineDot color={ 'info'} />
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="h6">Create a new react project for client</Typography>
        {currentItems && currentItems.map((item, index) => (
          <React.Fragment key={index}>
         <TimelineContent sx={{ display: 'flex', alignItems: 'center' }}>
    <Avatar src={`data:image/png;base64, ${item.userImage}`} alt='Alice Cobb' />
    <Typography variant="body2" style={{ marginLeft: '10px' }}>{item.message}</Typography>
  </TimelineContent>

          </React.Fragment>
          
        ))}
        
     <PaginationControls
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          endIndex={endIndex}
          totalItems={invitationData?.length}
        />  
      </TimelineContent>
    </TimelineItem>
                    
            <TimelineItem>
            
              <TimelineSeparator>
                <TimelineDot color="info" />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6" >12 Create invoices for client</Typography>
                <Typography variant="body2"> Weekly review of freshly prepared design for our new app.
                </Typography>
              </TimelineContent>
              
            </TimelineItem>
          </Timeline>
          <Button >
              View All
            </Button>

        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTimeline;
