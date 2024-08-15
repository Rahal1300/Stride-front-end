import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, Button, Typography, Box, Grid } from '@mui/material';
import { useSelector,useDispatch } from 'react-redux';
import CustomizedProgressBars from './loading';
import { format } from 'date-fns';
import { useRouter } from 'next/router';
import withAuth from '../../../features/reducers/withAuth';
import { loginSuccessGoogle ,logoutGoogle,parseToken,loginSuccess  } from '../../../features/reducers/authReducer';
import Container from '@mui/material/Container';
import { useGoogleLogin } from '@react-oauth/google';
import TableSpanning from './meet';
const Meeting = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const usertoken = useSelector(loginSuccess);
  
  const [meetings, setSeetings] = useState([]); 
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    if (usertoken) {
      const base64Url = usertoken.payload.token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const decodedTokenData = JSON.parse(window.atob(base64));
      setDecodedToken(decodedTokenData);

    }
    const fetchData = async () => {
      setLoading(true);  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/visits`, {
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          console.error('Error fetching team data:', data);
          setLoading(false);
          return;
        }
        setSeetings(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [ usertoken]);
  const isAdmin = decodedToken && decodedToken.role === 'Admin';
  const isTeamManager = decodedToken && decodedToken.cr === 'TeamManager';
  
  const shouldShowModifyIcon = isAdmin || (isTeamManager);
  const CreateMeeting = () => {
    router.push('/pages/CreateMeeting') ;  };
    const userrole = useSelector(state => state.Role); 
    const  cr  = useSelector(state => state.Cr); 
    const Owner = userrole === 'Subscriber' && cr === 'Owner';
    const TeamManagerandOwner = userrole === 'Subscriber' &&  cr === 'TeamManager';
    const Manager= userrole === 'User' &&  cr === 'TeamManager';
    const hasMeetings = meetings.length > 0;

  return (
    <div>
       {loading ? (
        <div><CustomizedProgressBars /></div>
      ) : (
          <>
      <Box sx={{ marginTop: 2 }}>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
          <Grid item xs={12} sm={6}>
          <Typography variant="h3" component="h1">
          Meeting Details
        </Typography>
          </Grid>
          <Grid item xs={12} sm={6} container alignItems="center" spacing={2}>
            <Grid item xs={12} sm={6}>
              {/* <input
                type="text"
                placeholder="Search "
                style={{
                  width: '100%', // Adjusted width
                  height: '44px',
                  border: '1px solid #ccc',
                  borderRadius: '20px',
                  padding: '0 10px 0 40px',
                  backgroundImage: `url('/images/icons/search.png')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '10px center',
                  backgroundSize: '20px',
                }}
              /> */}
            </Grid>

            <Grid item xs={6} sm={4}>
              <Button
                type="submit"
                onClick={CreateMeeting}
                sx={{
                  color: 'white',
                  height: '44px',
                  textTransform: 'none',
                  background: '#6226EF',
                  '&:hover': {
                    background: '#6226EF',
                  },
                  width: '100%', // Make the button take up full width
                }}
                // onClick={SendAdduser}
              >
                + Add new Meeting
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {hasMeetings ? (
            <TableSpanning meetings={meetings} />
          ) : (
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              No meetings available.
            </Typography>
          )}
      </>
        )}
    </div>
  );
};


export default withAuth(Meeting);