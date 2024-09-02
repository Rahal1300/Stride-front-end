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
  const isTeamManager = decodedToken.cr === 'TeamManager';
  const shouldShowModifyIcon = isAdmin || isTeamManager;

  const [refreshData, setRefreshData] = useState(false);
  const SendAdduser = () => {
    router.push('/pages/CreateTeam') ;  };

    const { id,teamName } = router.query;

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
          console.log(data);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching teams:', error);
          setLoading(false);
        }
      };
      
  
      fetchTeams();
    }, [id,refreshData]);

    const handleRefreshData = () => {
    setRefreshData(prev => !prev);
    };


    const userrole = useSelector(state => state.Role); 
    const  cr  = useSelector(state => state.Cr); 
    const Owner = userrole === 'Subscriber' && cr === 'Owner';
    const TeamManagerandOwner = userrole === 'Subscriber' &&  cr === 'TeamManager';
    const Manager= userrole === 'Subscriber' &&  cr === 'Owner';
  return (
    <div>
        <Box sx={{ marginTop: 2, marginBottom:5}}>
  <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
    <Grid item xs={12} sm={6}>
      <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
      Team {teamName}
      </Typography>
    </Grid>
    <Grid item xs={12} sm={6} container alignItems="center" spacing={2}>
      <Grid item xs={12} sm={6}>
        <input
          type="text"
          placeholder="Search "
          style={{
            width: '100%', 
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
       {Owner || Manager || TeamManagerandOwner ? (
      
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
            width: '100%', 
          }}          onClick={SendAdduser}

        >
Create a team      </Button>  ):(null)} 
      </Grid>
    </Grid>
  </Grid>
</Box>


{teams &&  <TeamComponent team={teams} Teamid={id}refreshData={refreshData} onRefreshData={handleRefreshData}/>}

    </div>
  );
};

export default withAuth(TeamView);
