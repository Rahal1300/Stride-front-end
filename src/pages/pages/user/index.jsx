import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box ,Grid,Pagination  } from '@mui/material';
import Image from 'next/image';
import { MarginRounded } from '@mui/icons-material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';

import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import CustomizedProgressBars from './loading';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import TableUser from './table';
import Snackbar from '@mui/material/Snackbar';
import ImportExcelButton from './ImportExcelButton ';
import withAuth from '../../../features/reducers/withAuth';
import TeamCard from '../Team/TeamCard';
const applyFilters = (data, filters) => {
  let filteredData = [...data];

  if (filters && filters.status) {
    filteredData = filteredData.filter(row => row.companyStatus === filters.status);
  }
  return filteredData;
};

const Index = () => {
    const router = useRouter();
    const [dateAnchorEl, setDateAnchorEl] = useState(null);
    const [typeAnchorEl, setTypeAnchorEl] = useState(null);
    const [statusAnchorEl, setStatusAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [Company, setCompany] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const usertoken = useSelector(loginSuccess);
    const [templateUrl, setTemplateUrl] = useState('/assets/templateUsers.xlsx');
    const [filters, setFilters] = useState({ status: '' });
    const [teamData, setTeamData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const teamsPerPage = 3;

    const [decodedToken, setDecodedToken] = useState(null);
    const userrole = useSelector(state => state.Role);
  const  cr  = useSelector(state => state.Cr);
  const Owner = userrole === 'Subscriber' && cr === 'Owner';
  const TeamManagerandOwner = userrole === 'Subscriber' &&  cr === 'TeamManager';
  const Manager= userrole === 'User' &&  cr === 'TeamManager';








    useEffect(() => {
      if (usertoken) {
        const base64Url = usertoken.payload.token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        const decodedToken = JSON.parse(window.atob(base64));
        setDecodedToken(decodedToken);
      }
      const fetchDataa = async () => {
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
      const fetchData = async () => {
        setLoading(true);
        try {
          // const response = await fetch('${process.env.NEXT_PUBLIC_BASE_URL}/listuserswithoutteam', {
            // const response = await fetch('${process.env.NEXT_PUBLIC_BASE_URL}/listusers', {

          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/listusers`, {
            headers: {
              Authorization: `Bearer ${usertoken.payload.token}`,
            },
          });
          const data = await response.json();
          if (!response.ok) {
            setSnackbarMessage('Something went wrong !!');
            setSnackbarOpen(true);
               }
          if (!data || data.length === 0) {
            setSnackbarMessage("Oops, you don't have any members yet");
            setSnackbarOpen(true);          }
          if (response.ok) {
            setCompany(data);
            setLoading(false);
                }

        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };


      fetchData();
      fetchDataa();

    }, [usertoken]);
    const indexOfLastTeam = currentPage * teamsPerPage;
    const indexOfFirstTeam = indexOfLastTeam - teamsPerPage;
    const currentTeams = teamData.slice(indexOfFirstTeam, indexOfLastTeam);



    const handleDateOpen = (event) => {
      setDateAnchorEl(event.currentTarget);
    };
    const handlePageChange = (event, value) => {
      setCurrentPage(value);
    };

    const handleDateClose = () => {
      setDateAnchorEl(null);
    };

    const handleTypeOpen = (event) => {
      setTypeAnchorEl(event.currentTarget);
    };

    const handleTypeClose = () => {
      setTypeAnchorEl(null);
    };

    const handleStatusOpen = (event) => {
      setStatusAnchorEl(event.currentTarget);
    };

    const handleStatusClose = () => {
      setStatusAnchorEl(null);
    };

    const SendAdduser = () => {
      router.push('/pages/CreateTeam') ;  };

      const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
      };
      const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = templateUrl;
        link.download = 'templateUsers.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      const handleStatusSelect = (status) => {
        setFilters((prevFilters) => ({ ...prevFilters, status }));
        handleStatusClose();
      };
      const filteredCompany = applyFilters(Company, filters);
      const isAdmin = decodedToken && decodedToken.role === 'Admin';
      const isTeamManager = decodedToken && decodedToken.cr === 'TeamManager';
      // const isCurrentUserTeamManager = team?.teamusers.some(user => user.role_in_team === 'TeamManager' && decodedToken && usertoken.email === decodedToken.email);

      // const shouldShowModifyIcon = isAdmin || (isTeamManager && isCurrentUserTeamManager);
      const shouldShowModifyIcon = isAdmin || (isTeamManager);

    return (
      <div>
                {loading ? (<CustomizedProgressBars/>):(
                  <>
<Box sx={{ marginTop: 2 }}>
  <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
    <Grid item xs={12} sm={6} style={{marginLeft:37}}>
      <Typography variant="h3" component="div" sx={{ fontWeight: 700 }} >
      Users
      </Typography>
    </Grid>

                        <>
    <Grid item xs={12} container alignItems="center" spacing={2}>
  <Grid item xs={6} sm={6}>
    {/* <input
      type="text"
      placeholder="Search"
      style={{
        width: '50%',
        height: '44px',
        border: '1px solid #ccc',
        borderRadius: '20px',
        padding: '0 10px 0 40px',
        backgroundImage: `url('/images/icons/search.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '10px ',
        backgroundSize: '20px',
      }}
    /> */}
  </Grid>
  <Grid item xs={6} sm={2}>
<ImportExcelButton/>
  </Grid>
  <Grid item xs={6} sm={2}>
    <Button
      type="submit"
      onClick={handleDownloadTemplate}

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
    >
      + Download Template
    </Button>
  </Grid>
  <Grid item xs={6} sm={2}>
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
      + Add new user
    </Button>
  </Grid>
</Grid>
</>
  </Grid>
</Box>





<TableContainer style={{ borderRadius: 10, border: '0.6px solid #D5D5D5', width: '94.2%', marginTop: 100, marginLeft: 42 }}>
  <Table size="small" aria-label="filter options" style={{ borderCollapse: 'collapse', backgroundColor: '#FFFFFF', width: '100%', borderRadius: 10, border: '0.6px solid #D5D5D5' }}>
    <TableBody>
      <TableRow>
        <TableCell style={{ width: '5%' }}>
          <Image src="/images/icons/filter.png" width={20} height={20} alt="Filter Icon" />
        </TableCell>
        <TableCell style={{ width: '19%', borderRight: '1px solid #CCCCCC', borderLeft: '1px solid #CCCCCC' }}>
          <Button
            onClick={handleDateOpen}
            style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
          >
            Filter By
          </Button>
          <Menu anchorEl={dateAnchorEl} open={Boolean(dateAnchorEl)} onClose={handleDateClose}>
            <MenuItem onClick={handleDateClose}>Option 1</MenuItem>
            <MenuItem onClick={handleDateClose}>Option 2</MenuItem>
            <MenuItem onClick={handleDateClose}>Option 3</MenuItem>
          </Menu>
        </TableCell>
        <TableCell style={{ width: '19%', borderRight: '1px solid #CCCCCC', borderLeft: '1px solid #CCCCCC' }}>
          <Button
            onClick={handleDateOpen}
            style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
          >
            Date
          </Button>
          <Image src="/images/icons/path.png" width={12} height={7} alt="Filter Icon" />

          <Menu anchorEl={dateAnchorEl} open={Boolean(dateAnchorEl)} onClose={handleDateClose}>
            <MenuItem onClick={handleDateClose}>Option 1</MenuItem>
            <MenuItem onClick={handleDateClose}>Option 2</MenuItem>
            <MenuItem onClick={handleDateClose}>Option 3</MenuItem>
          </Menu>

          <Button
            onClick={handleTypeOpen}
            style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
          >
            Order Type
          </Button>
          <Image src="/images/icons/path.png" width={12} height={7} alt="Filter Icon" />

          <Menu anchorEl={typeAnchorEl} open={Boolean(typeAnchorEl)} onClose={handleTypeClose}>
            <MenuItem onClick={handleTypeClose}>Option 1</MenuItem>
            <MenuItem onClick={handleTypeClose}>Option 2</MenuItem>
            <MenuItem onClick={handleTypeClose}>Option 3</MenuItem>
          </Menu>
        </TableCell>
        <TableCell style={{ width: '19%' }}>
          <Button
            onClick={handleStatusOpen}
            style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
          >
            Status
          </Button>
          <Image src="/images/icons/path.png" width={12} height={7} alt="Filter Icon" />

          <Menu anchorEl={statusAnchorEl} open={Boolean(statusAnchorEl)} onClose={handleStatusClose}>
            <MenuItem onClick={() => handleStatusSelect('ACTIVE')}>Active</MenuItem>
            <MenuItem onClick={() => handleStatusSelect('Suspended')}>Suspended</MenuItem>
            <MenuItem onClick={() => handleStatusSelect('Out')}>Out</MenuItem>
          </Menu>
        </TableCell>
        <TableCell style={{ width: '19%' }}>
          <Button
            style={{ backgroundColor: '#FFFFFF', color: '#EA0234', textTransform: 'none' }}
          >
            <Image src="/images/icons/replay.png" width={18} height={18} alt="Reset Icon" />
            Reset Filter
          </Button>
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</TableContainer>

        <Box sx={{margin :10}}>
        <TableUser Company={filteredCompany} />
        <Box sx={{ marginTop: 2 }}>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2} sx={{marginTop:8}}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h3" component="div" sx={{ fontWeight: 700,marginBottom:3.5 ,marginLeft:1}}>
           Teams
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
            <Grid item xs={6} sm={6}>
            {Owner || Manager || TeamManagerandOwner ? (

              <Button
                type="submit"
                sx={{
                  marginLeft:0.3,
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



        </Box>   <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
        /></>  ) }
      </div>




    );
  };

  export default withAuth(Index);
