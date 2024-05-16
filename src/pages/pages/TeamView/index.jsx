import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box ,Grid,Pagination  } from '@mui/material';
import { useRouter } from 'next/router';
import TeamComponent from './Table';
import withAuth from '../../../features/reducers/withAuth';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
const TeamView = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const usertoken = useSelector(loginSuccess);
  const base64Url = usertoken.payload.token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const decodedToken = JSON.parse(window.atob(base64));

  const isAdmin = decodedToken.role === 'Admin';
 console.log("isAdmin",isAdmin);
  const isTeamManager = decodedToken.cr === 'TeamManager';
  console.log("isTeamManager",isTeamManager);

  const shouldShowModifyIcon = isAdmin || isTeamManager;
  console.log("shouldShowModifyIcon",shouldShowModifyIcon);

  const SendAdduser = () => {
    router.push('/pages/CreateTeam') ;  };

    const { id } = router.query;

    useEffect(() => {
      const fetchTeams = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/teams/${id}/users`, {
            headers: {
              Authorization: `Bearer ${usertoken.payload.token}`,
            },
          });
      
          const data = await response.json();
          setTeams(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching teams:', error);
          setLoading(false);
        }
      };
      
  
      fetchTeams();
    }, [id]);

  return (
    <div>
        <Box sx={{ marginTop: 2, marginBottom:5}}>
  <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
    <Grid item xs={12} sm={6}>
      <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
      Teams
      </Typography>
    </Grid>
    <Grid item xs={12} sm={6} container alignItems="center" spacing={2}>
      <Grid item xs={12} sm={6}>
        <input
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
        />
      </Grid>

      <Grid item xs={6} sm={4}>
      {shouldShowModifyIcon && (
      
        <Button
          type="submit"
          sx={{
            color: 'white',
            height: '44px',
            textTransform: 'none',
            background: '#6226EF',
            '&:hover': {
              background: '#6226EF',
            },
            width: '100%', // Make the button take up full width
          }}          onClick={SendAdduser}

        >
Create a team        </Button>  )} 
      </Grid>
    </Grid>
  </Grid>
</Box>


{teams &&  <TeamComponent team={teams} Teamid={id}/>}

    </div>
  );
};

export default withAuth(TeamView);
