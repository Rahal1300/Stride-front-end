import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box ,Grid,Pagination  } from '@mui/material';

import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import CreateTeam from './ListTeam';
import { useRouter } from 'next/router'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { useTranslation } from 'react-i18next';
import CustomizedProgressBars from './loading';
import TeamCard from './TeamCard';

import withAuth from '../../../features/reducers/withAuth';
const Team = () => {
  const router = useRouter();
  const { t } = useTranslation();


  const usertoken = useSelector(loginSuccess);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const [loading, setLoading] = useState(false);
  const [teamData, setTeamData] = useState([]); // Initialize as an empty array
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 3;

  const base64Url = usertoken.payload.token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const decodedToken = JSON.parse(window.atob(base64));

  const isAdmin = decodedToken.role === 'Admin';
  const isTeamManager = decodedToken.cr === 'TeamManager';

  const shouldShowModifyIcon = isAdmin || isTeamManager;

  useEffect(() => {
   
    const fetchData = async () => {
      setLoading(true);  
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user-teams`, {
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });

        const data = await response.json();
        console.log("Teams",data);
        if (!response.ok) {
          console.error('Error fetching team data:', data);
          setLoading(false);
          return;
        }
        setTeamData(data);
        setLoading(false);
      } catch (error) {
        // Handle error
        console.error('Error fetching team data:', error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [ usertoken]);

  if (!isAuthenticated && usertoken.payload.token === null) {
    return null;
  }

  const SendAdduser = () => {
    router.push('/pages/CreateTeam');
  };

  const indexOfLastTeam = currentPage * teamsPerPage;
  const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
  const currentTeams = teamData.slice(indexOfFirstTeam, indexOfLastTeam);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  if (loading || !teamData) {
    return <CustomizedProgressBars />;
  }
  return (  
    <>  
      <Box sx={{ marginTop: 2 }}>
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
                }}
                onClick={SendAdduser}
              >
                Create a team
              </Button>   )}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginTop: 15 }}>
        <Grid container spacing={2}>
        <Grid container spacing={2}>
  {currentTeams.map(team => (
    <Grid item key={team.id} xs={12} sm={6} md={4}>
    {team && <TeamCard team={team} />} 
    </Grid>
  ))}
</Grid>

        </Grid>
         <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
         <Pagination count={Math.ceil(teamData.length / teamsPerPage)} page={currentPage} onChange={handlePageChange} />
        </Box> 
      </Box>
    </>  
  );
};

export default withAuth(Team);
