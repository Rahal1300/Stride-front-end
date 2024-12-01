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
  const [teamData, setTeamData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const teamsPerPage = 3;

  const userrole = useSelector(state => state.Role); 
  const  cr  = useSelector(state => state.Cr); 
  const Owner = userrole === 'Subscriber' && cr === 'Owner';
  const TeamManagerandOwner = userrole === 'Subscriber' &&  cr === 'TeamManager';
  const Manager= userrole === 'User' &&  cr === 'TeamManager';

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
        if (!response.ok) {
          console.error('Error fetching team data:', data);
          setLoading(false);
          return;
        }
        setTeamData(data);
        console.log(data)
        setLoading(false);
      } catch (error) {
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
           Teams  List :
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
                }}
                onClick={SendAdduser}
              >
                Create a team  
              </Button>    ) : null}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ marginTop: 15 }}>
  {currentTeams.length > 0 ? (
    <>
      <Grid container spacing={2}>
        {currentTeams.map((team) => (
          <Grid item key={team.id} xs={12} sm={6} md={4}>
            {team && <TeamCard team={team} />}
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
        <Pagination count={Math.ceil(teamData.length / teamsPerPage)} page={currentPage} onChange={handlePageChange} />
      </Box>
    </>
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ maxWidth: 400, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
          No teams found
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Create your first team to get started.
        </Typography>
      </Box>
    </Box>
  )}
</Box>

    </>  
  );
};

export default withAuth(Team);
