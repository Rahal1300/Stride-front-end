import React, { useState, useEffect } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';

import { useRouter } from 'next/router';
import BellOutline from 'mdi-material-ui/BellOutline';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import useMediaQuery from '@mui/material/useMediaQuery'
import PerfectScrollbarComponent from 'react-perfect-scrollbar'

import { formatDistanceToNow } from 'date-fns';
import RefreshIcon from '@mui/icons-material/Refresh'; // Replace with your actual icon component
import { useTranslation } from 'react-i18next';
import withAuth from '../../../features/reducers/withAuth';
const ScrollWrapper = ({ children, hidden }) => {
  return hidden ? (
    <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
  ) : (
    <PerfectScrollbarComponent options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbarComponent>
  );
};
const Notification = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const usertoken = useSelector(loginSuccess);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const [acceptedInvitations, setAcceptedInvitations] = useState([]);

  const [notification, setNotification] = useState([]);
  const [notification2, setnotification2] = useState([]);
  const [notification3, setnotification3] = useState([]);
  const combinedNotifications = [...notification, ...notification2,...notification3];
  const { t } = useTranslation(); 

  const [refresh, setRefresh] = useState(false);
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg')); // Move here
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (usertoken.payload.token) { // Check if the token exists
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${usertoken.payload.token}`,
            },
          });
          const data = await response.json();
          setNotification(data);

        }

      } catch (error) {

        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };
    const fetchData2 = async () => {
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/meetings`, {
          method: 'GET',
  
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });
        const data = await response.json();
        setnotification2(data);

      } catch (error) {

        console.error('Error fetching notifications:', error);
      }
      setLoading(false);

    };
    const fetchData3 = async () => {
  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/projectsinvites`, {
          method: 'GET',
  
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });
        const data = await response.json();
        setnotification3(data);

      } catch (error) {

        console.error('Error fetching notifications:', error);
      }
      setLoading(false);

    };
    


    if (!usertoken.payload.token && !isAuthenticated) {
      router.push('/pages/login');
    } else {
      setLoading(true);
      fetchData();
      fetchData2();
      fetchData3();
    }
  }, [usertoken.payload.token, refresh, isAuthenticated, router]);
  const handleRefresh = () => {
    setLoading(true);
      setTimeout(() => {
      setRefresh(prevRefresh => !prevRefresh);
      setLoading(false);
        window.location.reload();
    }, 1000); 
  };
  
  const confirmInvitation = async (Id) => {

    try {
      const requestOptions = {
        method: 'GET',
         headers: {
         Authorization: `Bearer ${usertoken.payload.token}`,
         Credentials
        },
      };
   
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Invitations/Accept-invitation/${Id}`, requestOptions);
      const responseText = await response.text();

      if (response.ok) {
        setAcceptedInvitations((prevAcceptedInvitations) => [...prevAcceptedInvitations, Id]);
      } else {

        console.log(responseText || 'Unknown error ');
        console.log(`Email confirmation failed: ${responseText || 'Unknown error'}`);
      }
    } catch (error) {

   
      console.error('Error:', error);
    }
 
};

const confirmInvitationPROJECT = async (Id, type) => {
  try {
    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${usertoken.payload.token}`,
      },
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Accept-projectinvitation/${Id}`, requestOptions);
    const responseText = await response.json();

    if (response.ok) {
      setAcceptedInvitations((prevAcceptedInvitations) => [...prevAcceptedInvitations, Id]);
    } else {
      console.log(responseText || 'Unknown error');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
if (!isAuthenticated && usertoken.payload.token === null) {
    
  return null;
}
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

<ScrollWrapper hidden={hidden}>
  
<Card   sx={{ background:'#F8F8F8',overflowY: 'auto',maxHeight:'800px'}} >
  <CardContent>
    <Typography variant="h4" gutterBottom>
      <BellOutline /> {t('Notifications')}
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
  <Button onClick={handleRefresh} color="primary" startIcon={<RefreshIcon />}>
    
    {t('Refresh')}
  </Button>
</Box>

    {combinedNotifications.length > 0 ? (
  [...combinedNotifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((notif, index) => (
    <Box key={index} sx={{ display: 'flex', alignItems: 'center', padding: 1}}>
          <Card sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
              <Avatar
                alt={notif.senderName}
                src={`data:image/png;base64, ${notif.senderImageUrl}`}
                sx={{ width: 50, height: 50, marginRight: 2 }}
              />
              <Box sx={{ flex: '1 1', display: 'flex', flexDirection: 'column' }}>
              <Typography                 sx={{ color:'black' }} >
              <strong>{notif.senderName}</strong>      {t('has_invited_you')}

                </Typography>
                <Typography variant="body1">{notif.message}</Typography>
                <Typography variant="caption" color="textSecondary">
                {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </Typography>
                
              </Box>
              {notif.status && notif.status !== 'ACCEPTED' && (
        <div style={{marginRight:'50px'}}>
          <Button
            size='small'
            sx={{ bgcolor: '#6226EF', color: 'white',margin:2 }}            variant='contained'
            onClick={() => {
              if (notif.type === 'PROJECT') {
                confirmInvitationPROJECT(notif.id); // Call function for project notifications
              } else {
                confirmInvitation(notif.id); // Call function for other types of notifications
              }
            }}
            disabled={acceptedInvitations.includes(notif.id)}

          >
              {t('Accept')}
          </Button>

          <Button
            size='small'
            variant='contained'
            sx={{ bgcolor: '#6226EF', color: 'white' }}
            disabled={acceptedInvitations.includes(notif.id)}
          >
          {t('Decline')}
          </Button>
        </div>
      )}
              <Typography variant="caption" color="textSecondary">
                {new Date(notif.createdAt).toLocaleString()}
              </Typography>
    
            </Box>
          </Card>
        </Box>
            ))
          ) : (
            <Box sx={{ my: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2">{t('No notifications')}       </Typography>
          </Box>
          
          )}

        </CardContent>
        
      </Card>
      </ScrollWrapper>
    </div>
    
  );
};

export default withAuth(Notification);
