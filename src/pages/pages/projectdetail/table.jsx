import { useState,forwardRef,useEffect  } from 'react'
import EyeOutline from 'mdi-material-ui/EyeOutline';
import DotsVertical from 'mdi-material-ui/DotsVertical'
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import LeadPencil from 'mdi-material-ui/DotsVertical'
import Grid from '@mui/material/Grid';
 
import CloseIcon from '@mui/icons-material/Close';
// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import Avatar from '@mui/material/Avatar';
import TablePagination from '@mui/material/TablePagination'
import { useTranslation } from 'react-i18next';
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper'
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer'
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import SockJS from 'sockjs-client';
import CircularProgress from '@mui/material/CircularProgress';
import SnackbarContent from '@mui/material/SnackbarContent';

import UpdateRoleDropdown from './component/UpdateRoleDropdown'; // Replace with the correct path
import Menu from '@mui/material/Menu';

import IconButton from '@mui/material/IconButton';
IconButton
const statusObj = {
  Pending: { color: 'info' },
  Suspended: { color: 'error' },

  Active: { color: 'success' }
}
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DashboardTable = ({ project }) => {
  const [projects, setProjects] = useState({});

  const [page, setPage] = useState(0)
  const [teams, setTeam] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(5)
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }
  const [open, setOpen] = useState(false);


  
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  const { t } = useTranslation();
  const router = useRouter(); // Move the hook inside the component
  const handleChangeRecipientEmail = (event) => {
    setRecipientEmail(event.target.value);

  };
  const handleChangeRecipientRole = (event) => {
    setRecipientRole(event.target.value);
  };


  // Ensure id is defined before using it
  const { id } = router.query;
  const idproject = id || '';
  const usertoken = useSelector(loginSuccess);
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);  // Close the Snackbar
  };
  const handleClick = () => {
    setOpen(true);   // Open the Snackbar
  };
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientRole, setRecipientRole] = useState('');

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const handleSendInvitation = async (idproject) => {
    setLoading(true);
    try {
      const inviteRequestData = {
        recipientEmail: recipientEmail, // Use the value from the state
        roleinproject: recipientRole, // Use the value from the state

      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Invitations/send/${idproject}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
        body: JSON.stringify(inviteRequestData),
      });

      if (response.ok) {

        setRecipientEmail('');
        setRecipientRole('');
        handleClick();

        setSnackbarOpen(true);
              setLoading(false); // Set loading to false in case of error

       
      } else {
        setLoading(false); // Set loading to false in case of error
        setErrorSnackbarOpen(true);

        console.error('Failed to send invitation');
      }
    } catch (error) {
      setLoading(false); // Set loading to false in case of error
      setErrorSnackbarOpen(true);

      console.error('Error sending invitation', error);
    }
  
  
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSuccessMessage(null);
  };
  const handleErrorSnackbarClose = () => {
    setErrorSnackbarOpen(false);
    setPaymentError(null);
  };
  const [roleMappings, setRoleMappings] = useState({
    'Team Leader': 'TeamLeader',
    'Guest': 'Guest',
    'Collaborator': 'Collaborator',
    'Team Manager': 'TeamManager',
  });
  

  // const fetchData = async () => {
  //   setLoading(true);

  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${idproject}`, {
  //       method: 'GET',

  //       headers: {
  //         Authorization: `Bearer ${usertoken.payload.token}`,
  //       },
  //     });
  //     const data = await response.json();
     
  //     // Set the fetched projects to the state
  //     setProjects(data);
  //     setLoading(false);

  //   } catch (error) {
  //     setLoading(false);

  //     console.error('Error fetching user data:', error);
  //   }
  // };
  const [allUserEmails, setAllUserEmails] = useState([]);

  const fetchTeam = async () => {

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/with-users-and-roles`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTeam(data);
      
        
      } else {
        console.log("Response not okay.");
      }
       
      }catch (error) {

      console.error('Error fetching user data:', error);
    }
  };
  
  

  const [emailDropdownOpen, setEmailDropdownOpen] = useState(false);

  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teamEmails, setTeamEmails] = useState([]);

  const updateAllUserEmails = (teamId) => {
    const selectedTeam = teams.find((team) => team.id === teamId);

    if (selectedTeam) {
      const userEmails = selectedTeam?.teamusers.map((user) => user.email);
      setAllUserEmails(userEmails);
      const teamRoles = selectedTeam?.teamusers.map((user) => user.role_in_team);
      setRecipientRole(teamRoles ? teamRoles[0] : '');

    } else {
      console.log("Team Users does not exist.");
    }


  };
  useEffect(() => {
    fetchTeam();

    if (project ) {
      setProjects(project);
    }
   
    if (projects && projects.userRoleInProject === 'TeamLeader') {
      // If the user's role in the project is Team Leader, exclude Team Manager
      const updatedRoleMappings = { ...roleMappings };
      delete updatedRoleMappings['Team Manager'];
      delete updatedRoleMappings['Team Leader'];
      setRoleMappings(updatedRoleMappings);
    } else if (projects && projects.userRoleInProject === 'TeamManager') {
      // If the user's role in the project is Team Manager, exclude Team Leader
      const updatedRoleMappings = { ...roleMappings };
      delete updatedRoleMappings['Team Manager'];
      setRoleMappings(updatedRoleMappings);
    }


  }, [router.query.id,project,projects]);
  const roleDisplayNames = Object.keys(roleMappings);
  const [teamSelected, setTeamSelected] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChangeTeam = (event) => {
    const selectedTeamId = event.target.value;
    setSelectedTeamId(selectedTeamId);
    setShowDropdown(true);
    // setEmailDropdownOpen(false);
    updateAllUserEmails(selectedTeamId);

  };
  const [isUpdateRoleDropdownOpen, setUpdateRoleDropdownOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [rowWithChangedIcon, setRowWithChangedIcon] = useState(null);


  const handleLeadPencilClick = (clickedRowId) => {
    setUpdateRoleDropdownOpen((prevOpen) => !prevOpen);
    setSelectedRow(clickedRowId);

  };
  const handleRoleUpdate = async (newRole, userId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${idproject}/update-role`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          role: newRole,
        }),
      });
      if (response.ok) {
        setProjects(prevProjects => ({
          ...prevProjects,
          projectUsersAndRoles: prevProjects.projectUsersAndRoles.map(user =>
            user.id === userId ? { ...user, projectRole: newRole } : user
          ),
        }));
        setUpdateRoleDropdownOpen(false);
      } else {
        console.log("Failed to update role.");
      }
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };
  
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleMenuOpen = (event, userId) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUserId(userId);

  };
  
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedUserId(null);
  };
  
  
  return (
    <>
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
      <CircularProgress size={70} />
      <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
      Sending Invitation...
     </Typography>
  </div>
    )}
      {projects && (
   
        projects.userRoleInProject === 'Collaborator' || projects.userRoleInProject === 'Guest'  ? ( <>              
    
    <Card sx={{marginTop:'20px'}} >

              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                  <Table  aria-label='table in dashboard'>
                    <TableHead>
                      <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>{t('Email')}</TableCell>
                    <TableCell>{t('Role')}</TableCell>
                    {/* <TableCell>{t('Status')}</TableCell> */}
                    {/* <TableCell>{t('Edit')}</TableCell> */}

              </TableRow>
            </TableHead>
            <TableBody>
  {projects.projectUsersAndRoles && projects.projectUsersAndRoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
    <TableRow hover key={row.id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
      <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
       
          <Avatar alt={row.first_name} src={`data:image/png;base64,${row.image}`} />
          <Box sx={{ ml: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.first_name}</Typography>
            <Typography variant='caption'>{/* Check the correct property for designation */}</Typography>
          </Box>
        </Box>
      </TableCell>
      <TableCell>{row.email}</TableCell>

                <TableCell>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {row.projectRole === 'Admin' && <img src={`/images/avatars/${row.projectRole}.png`} style={{ marginRight: '8px' }} />}
        {row.projectRole === 'Collaborator' && <img src={`/images/avatars/${row.projectRole}.png`} style={{ marginRight: '8px' }} />}
        {row.projectRole === 'TeamLeader' && <img src={`/images/avatars/${row.projectRole}.png`} style={{ marginRight: '8px' }} />}
        {row.projectRole === 'TeamManager' && <img src={`/images/avatars/${row.projectRole}.png`} style={{ marginRight: '8px' }} />}
        {row.projectRole === 'Guest' && <img src={`/images/avatars/${row.projectRole}.png`} style={{ marginRight: '8px' }} />}

        <Box sx={{ ml: 2 }}>



          <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.projectRole}</Typography>
        </Box>
      </Box>
    </TableCell>
  
  
    </TableRow>
  ))}
</TableBody>

          </Table>
        </TableContainer>
        <TablePagination
  rowsPerPageOptions={[5]}
  component='div'
  count={projects.projectUsersAndRoles?.length || 0}
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
        </Paper>
      </Card>

          </> ) : (  
    <Card sx={{marginTop:'20px'}} >
  


  <Paper sx={{ width: '100%', overflow: 'hidden' ,  border: 'none', boxShadow: '0px 0px 0px 0px rgba(0,0,0,0)'}}>
                <TableContainer>
                  <Table aria-label='table in dashboard'>
                    <TableHead>
                      <TableRow>
                    <TableCell>Name</TableCell>
                    {/* <TableCell>{t('Email')}</TableCell> */}
                    <TableCell>{t('Role')}</TableCell>
                    {/* <TableCell>{t('Status')}</TableCell> */}
                    {/* <TableCell>{t('Edit')}</TableCell> */}
                    <TableCell>{t('Edit')}</TableCell>


              </TableRow>
            </TableHead>
            <TableBody>
            {projects.projectUsersAndRoles && projects.projectUsersAndRoles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((userrow) => (
              
    <TableRow hover key={userrow.id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
      <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
       
          <Avatar alt={userrow.first_name} src={`data:image/png;base64,${userrow.image}`} />
          <Box sx={{ ml: 2 }}>
            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{userrow.first_name}</Typography>
            <Typography variant='caption'></Typography>
          </Box>
        </Box>
      </TableCell>
      
      <TableCell>
                {isUpdateRoleDropdownOpen && selectedRow === userrow.id ? (
                  <UpdateRoleDropdown currentRole={userrow.projectRole} onUpdate={handleRoleUpdate} userId={userrow.id}  />
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {userrow.projectRole && (
                      <>
                        {[ 'Guest', 'Collaborator','TeamManager','TeamLeader'].includes(
                          userrow.projectRole
                        ) && <img src={`/images/avatars/${userrow.projectRole}.png`} style={{ marginRight: '8px' }} />}
                        <Box sx={{ ml: 2 }}>
                          <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{userrow.projectRole}</Typography>
                        </Box>
                      </>
                    )}
                  </Box>
                )}
      </TableCell>
    
 

      <TableCell>
      <Box sx={{ display: 'flex', border: 'none', boxShadow: '0px 0px 0px 0px rgba(0,0,0,0)' }}>
      {projects && (projects.userRoleInProject === 'Admin' || projects.userRoleInProject === 'TeamManager') && (
  <>
    {userrow.projectRole !== 'TeamManager' && (  // Check if the user's role is not Team Manager
      <>
        <Button onClick={() => handleLeadPencilClick(userrow.id)}>
          <AutoFixNormalIcon />
        </Button>
        <IconButton onClick={(event) => handleMenuOpen(event, userrow.email)}>
          <DotsVertical />
        </IconButton>
      </>
    )}
  </>
)}




        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleMenuClose}
        >
         <MenuItem>{selectedUserId}</MenuItem>


          <MenuItem >Disable</MenuItem>
        </Menu>
      </Box>
    </TableCell>
    
            </TableRow>
  ))}
</TableBody>

          </Table>
        </TableContainer>
        <TablePagination
  rowsPerPageOptions={[5]}
  component='div'
  count={projects.projectUsersAndRoles?.length || 0}
  rowsPerPage={rowsPerPage}
  page={page}
  onPageChange={handleChangePage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>

        </Paper>

  <Box p={2}>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          {showDropdown ? (
            <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={12}>
              <TextField
                select
                label="Team"
                variant="outlined"
                size="small"
                value={selectedTeamId}
                onChange={handleChangeTeam}
                fullWidth
                sx={{ marginBottom: 4,marginTop:5 }}
              >
                {teams &&
                  teams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.teamName}
                    </MenuItem>
                  ))}
              </TextField>
              <TextField
                select
                label="Email"
                variant="outlined"
                size="small"
                value={recipientEmail}
                onChange={handleChangeRecipientEmail}
                fullWidth
                sx={{ marginBottom: 4 }}
                disabled={!selectedTeamId}
              >
                {allUserEmails.map((email) => (
                  <MenuItem key={email} value={email}>
                    {email}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Role"
                variant="outlined"
                size="small"
                value={recipientRole}
                onChange={handleChangeRecipientRole}
                fullWidth
                sx={{ marginBottom: 4 }}

                disabled={!selectedTeamId} 
              >
                {roleDisplayNames.map((roleDisplayName) => (
                  <MenuItem key={roleDisplayName} value={roleMappings[roleDisplayName]}>
                    {roleDisplayName}
                  </MenuItem>
                ))}
              </TextField>
              <Box display="flex" alignItems="center"  sx={{ marginBottom: 2 }}>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {showDropdown ? "Expand Team" : "Invite Team Members"}
            </Button>
            <Button
  variant="contained"
  size="small"
  color="primary"
  onClick={() => handleSendInvitation(idproject)}
  sx={{ marginLeft: 2 }}
  disabled={ projects.userRoleInProject === 'TeamLeader' && recipientRole === 'TeamManager'}
>
  Send Invitation
</Button>

        </Box>
            </Grid>  
          
          
          
          
            </Grid>
          ) : (
            <>
             <Grid container spacing={3}>
             <Grid item xs={12} md={6} lg={12}>
              <TextField
                label="Email"
                variant="outlined"
                size="small"
                value={recipientEmail}
                onChange={handleChangeRecipientEmail}
                sx={{ marginBottom: 4 ,marginTop:5 }}

                fullWidth
              />           
              <TextField
                select
                label="Role"
                variant="outlined"
                size="small"
                value={recipientRole}
                onChange={handleChangeRecipientRole}
                sx={{ marginBottom: 4 }}

                fullWidth
              >
                {roleDisplayNames.map((roleDisplayName) => (
                  <MenuItem key={roleDisplayName} value={roleMappings[roleDisplayName]}>
                    {roleDisplayName}
                  </MenuItem>
                ))}
              </TextField>
              <Box display="flex" alignItems="center" sx={{ marginBottom: 2 }}
>
            <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => setShowDropdown(!showDropdown)}
            >
                {showDropdown ? "Expand Team" : "Invite Team Members"}
            </Button>
            <Button
  variant="contained"
  size="small"
  color="primary"
  onClick={() => handleSendInvitation(idproject)}
  sx={{ marginLeft: 2 }}
  disabled={ projects.userRoleInProject === 'TeamLeader' && recipientRole === 'TeamManager'}
>
  Send Invitation
</Button>

        </Box>
              </Grid>
           
            </Grid>
            </>
          )}
        </Grid>

     
      </Grid>

      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        Invitation sent successfully! Your team member will receive an email shortly.
        </Alert>
      </Snackbar>
      <Snackbar open={errorSnackbarOpen} autoHideDuration={2000} onClose={handleErrorSnackbarClose}>
  <Alert onClose={handleErrorSnackbarClose} severity="error" sx={{ width: '100%' }}>
  Oops! Something went wrong while sending the invitation. Please try again later.
  </Alert>
</Snackbar>

    </Box>

            

      </Card>
      )
      )}
    </>
  );
};

  
  export default DashboardTable;
