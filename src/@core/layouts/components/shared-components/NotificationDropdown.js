// ** React Imports
import { useState, Fragment,useEffect } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import MuiMenu from '@mui/material/Menu'
import MuiAvatar from '@mui/material/Avatar'
import MuiMenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress';

import NotificationsIcon from '@mui/icons-material/Notifications';
import PerfectScrollbarComponent from 'react-perfect-scrollbar'
import { useSelector } from 'react-redux';
import Alert from 'react-bootstrap/Alert';
import { loginSuccess } from '../../../../features/reducers/authReducer'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useRouter } from 'next/router'

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import Badge from '@mui/material/Badge';

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
});const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 480,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  '& .MuiMenu-list': {
    padding: 0
  }
}))

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`
}))

const styles = {
  maxHeight: 349,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0
  }
}

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles
})

const Avatar = styled(MuiAvatar)({
  width: '2.375rem',
  height: '2.375rem',
  fontSize: '1.125rem'
})

const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75)
}))

const MenuItemSubtitle = styled(Typography)({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis'
})

const NotificationDropdown = () => {
  const router = useRouter()


  const [lastUnreadCount, setLastUnreadCount] = useState(0);

  const [anchorEl, setAnchorEl] = useState(null)

  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget);
    setLastUnreadCount(unreadCount);
    setUnreadCount(0);
    fetchData();

    fetchData2();

  }

  const handleDropdownClose = () => {
    setAnchorEl(null)
  }

  const ScrollWrapper = ({ children }) => {
    if (hidden) {
      return <Box sx={{ ...styles, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>
    } else {
      return (
        <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>
      )
    }
  }


  const socketMessages = useSelector((state) => state.socketMessages); // Assuming your socket messages are stored in a field called socketMessages
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const user = useSelector(loginSuccess);
  const [loading, setLoading] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [notification, setnotification] = useState([]); // Change this line
  const [notification2, setnotification2] = useState([]); // Change this line
  const [countdown, setCountdown] = useState(5);
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);
  

  const [x, setX] = useState(null); // Use state to manage x

  const fetchData = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications`, {
        method: 'GET',

        headers: {
          Authorization: `Bearer ${user.payload.token}`,
        },
      });
      const data = await response.json();
      // Set the fetched projects to the state
      setnotification(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error('Error fetching notifications:', error);
    }
  };
  const fetchData2 = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notifications/meetings`, {
        method: 'GET',

        headers: {
          Authorization: `Bearer ${user.payload.token}`,
        },
      });
      const data = await response.json();
     setnotification2(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.error('Error fetching notifications:', error);
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


  useEffect(() => {

    if (user.payload.token) {
      const base64Url = user.payload.token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const decodedX = JSON.parse(window.atob(base64));
  
      setX(decodedX); // Set x using useState
      // Connect to the WebSocket server with authentication token
      const socket = new SockJS(`${process.env.NEXT_PUBLIC_BASE_URL}/ws`);
      const stompClient = Stomp.over(socket);
      stompClient.debug = null; // or stompClient.debug = () => {};

      stompClient.connect({
        Authorization: `Bearer ${user.payload.token}`,
      }, (frame) => {
  
        stompClient.subscribe(`/topic/send-invitation/${decodedX.userId}`, (message) => {
          // Handle received messages
          if (stompClient.connected) {
  
              setShowAlert(true);
              setAlertMessage(`  ${message.body}`);
              setUnreadCount((prevCount) => prevCount + 1);

            
          } else {
              setShowAlert(true);
              setAlertMessage('something went wrong');
  
            // Not connected to the specified destination
          }
        });
      }, (error) => {
        console.error('Error connecting to WebSocket:', error);
      });
    
      // return () => {
      //   // Disconnect from the WebSocket when the component unmounts
      //   stompClient.disconnect();
      // };


      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
      }
      if (socket && socket.readyState === SockJS.OPEN) {
        socket.close();
      }
    }
      
  }, [user.payload.token]);
  const confirmInvitation = async (Id) => {

      try {
        const requestOptions = {
          method: 'GET',
           headers: {
           Authorization: `Bearer ${user.payload.token}`,
          },
        };
     
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Invitations/Accept-invitation/${Id}`, requestOptions);
        const responseText = await response.text();

        if (response.ok) {
          // Handle success
          setAcceptedInvitations((prevAcceptedInvitations) => [...prevAcceptedInvitations, Id]);
          setShowRedirectMessage(true);
          const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => {
              if (prevCountdown === 1) {
                clearInterval(countdownInterval);
                router.push("/pages/login");
              }
              return prevCountdown - 1;
            });
          }, 1000);
        } else {

          console.log(`Email confirmation failed: ${responseText || 'Unknown error'}`);
        }
      } catch (error) {

        // Handle network errors or unexpected exceptions
     
        console.error('Error:', error);
      }
   
  };
  const [acceptedInvitations, setAcceptedInvitations] = useState([]);
  const combinedNotifications = [...notification, ...notification2];

  return (
    <ThemeProvider theme={theme}>

    <div>
   
    <Fragment>
 
          {showAlert && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '9999' }}>
          <Alert variant="info" onClose={() => setShowAlert(false)} dismissible style={{ width: '300px' }}>
            <p>{alertMessage}</p>
          </Alert>
        </div>
      )}  
      {showRedirectMessage && (
        <div style={{ position: 'fixed', top: '80px', right: '20px', zIndex: '9999' }}>
          <Alert 
            variant="success" 
            style={{ 
              width: '350px', 
              background: 'linear-gradient(135deg, #b3e5fc, #81d4fa)', // Gradient background
              borderColor: '#90caf9',                                    // Blue border
              color: '#0d47a1',                                          // Dark blue text
              borderRadius: '10px',                                      // Smooth rounded corners
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',              // Subtle shadow for depth
              padding: '20px',                                           // Comfortable padding
              fontFamily: 'Arial',                          // Modern font
              textAlign: 'center'        // Centered text
            }}
          >
            <p style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>Invitation Accepted!</p>
            <p style={{ margin: 0, fontSize: '14px' }}>You will be redirected to the login page in {countdown} seconds.</p>
          </Alert>
        </div>
      )}
      
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <NotificationsIcon   style={{color:'#3D42DF'}}/>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
            <Chip
              size='small'
              label={`${lastUnreadCount} New`} 
              color='primary'
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>
        <ScrollWrapper>
        {loading ? (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
    <CircularProgress size={24} />
    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
      Loading
    </Typography>
  </div>
) : combinedNotifications.length > 0 ? (
  combinedNotifications
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 5)
  .map((notif, index) => (
    <MenuItem onClick={handleDropdownClose} key={index}>
  <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    <Avatar alt={notif.senderName} src={`data:image/png;base64, ${notif.senderImageUrl}`} />
                    <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                      <MenuItemTitle sx={{ fontSize: 9 }}>
                        {notif.message && notif.message.split('by')[0]}
                        <br />
                        {new Date(notif.createdAt).toLocaleString()}
                      </MenuItemTitle>
                      <MenuItemSubtitle variant='body2'>
                        <ul>
                          {socketMessages && socketMessages.map((message, index) => (
                            <li key={index}>{message}</li>
                          ))}
                        </ul>
                      </MenuItemSubtitle>
                    </Box>   
                    {notif.status && notif.status !== 'ACCEPTED' && (
        <>
          <Button
            size='small'
            sx={{ margin: 2 }}
            variant='contained'
            onClick={() => {
              if (notif.type === 'PROJECT') {
                confirmInvitationPROJECT(notif.id); // Call function for project notifications
              } else {
                confirmInvitation(notif.id); // Call function for other types of notifications
              }
            }}
            disabled={acceptedInvitations.includes(notif.id)}
          >
            Accept
          </Button>
          <p>{notif.type}</p>

          <Button
            size='small'
            variant='contained'
            disabled={acceptedInvitations.includes(notif.id)}
          >
            Decline
          </Button>
        </>
      )}
        </Box>
      </MenuItem>
    ))
) : (
    <MenuItem onClick={handleDropdownClose}>
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2">No notifications</Typography>
      </Box>
    </MenuItem>
  )}
</ScrollWrapper>

        <MenuItem
          disableRipple
          sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}
        >
          <Button fullWidth variant='contained' onClick={handleDropdownClose}>
            Read All Notifications
          </Button>
        </MenuItem>
      </Menu>
      <Badge badgeContent={unreadCount} color="primary">
    </Badge>
    </Fragment>
    </div>
    </ThemeProvider>

  )
}

export default NotificationDropdown
