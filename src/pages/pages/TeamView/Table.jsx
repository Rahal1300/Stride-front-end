import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Chip from '@mui/material/Chip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Image from 'next/image';
import Button from '@mui/material/Button';

import Select from '@mui/material/Select';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const TeamComponent = ({ team, Teamid, refreshData, onRefreshData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedImageMember, setSelectedImageMember] = useState(null);
  const usertoken = useSelector(loginSuccess);
  const [loading, setLoading] = useState(false);
  const [selectedMemberRemove, setSelectedMemberRemove] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    if (usertoken) {
      const base64Url = usertoken.payload.token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const decodedTokenData = JSON.parse(window.atob(base64));
      setDecodedToken(decodedTokenData);

    }
  }, [usertoken]);
  const handleClick = (event, member) => {
    setSelectedMember(null); 

    setAnchorEl(event.currentTarget);
    setSelectedImageMember(member); 
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedMember(null);
  };

  const handleRemoveClick = (member) => {
    setSelectedMemberRemove(member);
    setConfirmationDialogOpen(true);
    setAnchorEl(null);
  };

  const handleConfirmRemove = () => {
    handleRemove(selectedMemberRemove.userId);
    setConfirmationDialogOpen(false);
  };

  const handleCancelRemove = () => {
    setSelectedMemberRemove(null);
    setConfirmationDialogOpen(false);
  };

  const handleEditRoleClick = (member) => {
    setSelectedMember(member);
    setAnchorEl(null);
  };

  const handleRoleChange = async (event, newRole, userId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/assignRoleToTeamMember?teamId=${Teamid}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${usertoken.payload.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          role: newRole,
        }),
      });
      // const data = await response.json();
      setLoading(false);
      setSelectedMember(null); 
      handleSnackbarOpen('Role updated successfully', 'success');
      onRefreshData();
    } catch (error) {
      console.error('Error updating role:', error);
      setLoading(false);
      handleSnackbarOpen('Failed to update role', 'error');
    }
  };

  const handleRemove = async (userId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${Teamid}/users/${userId}`, {
        method: 'delete',
        headers: {
          'Authorization': `Bearer ${usertoken.payload.token}`,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        setLoading(false);
        setSelectedMember(null); 
        handleSnackbarOpen('User removed from team successfully', 'success');
      } else {
      
        setLoading(false);
        handleSnackbarOpen('Failed to remove user from team', 'error');
      }
    } catch (error) {
      console.error('Error removing user:', error);
      setLoading(false);
      handleSnackbarOpen('Failed to remove user from team', 'error');
    }
  };
  

  const createEditRoleHandler = (member) => {
    return () => {
      handleEditRoleClick(member);
    };
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };



  

const isAdmin = decodedToken && decodedToken.role === 'Admin';
const isTeamManager = decodedToken && decodedToken.cr === 'TeamManager';

const isCurrentUserTeamManager = team && team.teamusers && team.teamusers.some(user => user.role_in_team === 'TeamManager' && user.email === (decodedToken && decodedToken.email));

const shouldShowModifyIcon = isAdmin || isTeamManager ;


const userrole = useSelector(state => state.Role); 
const  cr  = useSelector(state => state.Cr); 
const Owner = userrole === 'Subscriber' && cr === 'Owner';
const TeamManagerandOwner = userrole === 'Subscriber' &&  cr === 'TeamManager';
const Manager= userrole === 'Subscriber' &&  cr === 'Owner';
  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              {Owner || Manager || TeamManagerandOwner   ?( <TableCell>Edit</TableCell>):(null)}
            </TableRow>
          </TableHead>
          <TableBody>
            {team?.map((member, index) => (
              <TableRow key={index}>
                <TableCell>{member.firstName}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>
                  {selectedMember === member ? (
                    <Select
                      value={member.role}
                      onChange={(event) => handleRoleChange(event, event.target.value, member.userId)}
                      style={{ fontSize: '14px', padding: '8px', width: '150px', height: '50px' }}
                      variant="outlined"
                      fullWidth
                      select
                      MenuProps={{ PaperProps: { style: { height: '100px' } } }}
                    >
                      <MenuItem value={'Guest'}>Guest</MenuItem>
                      <MenuItem value={'TeamLeader'}>Team Leader</MenuItem>
                      <MenuItem value={'Collaborator'}>Collaborator</MenuItem>
                      {/* <MenuItem value={'TeamManager'}>Team Manager</MenuItem> */}
                    </Select>
                  ) : (
                    <div>
                      {member.role === 'TeamLeader' ? 'Team Leader' : member.role === 'TeamManager' ? 'Team Manager' : member.role}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Chip
                    size='small'
                    label={member.status}
                    style={{
                      backgroundColor: member.status === 'ACTIVE' ? 'rgba(0, 182, 155, 0.2)' : member.status === 'Inactive' ? 'rgba(239, 56, 38, 0.2)' : '',
                      color: member.status === 'ACTIVE' ? '#00B69B' : member.status === 'Inactive' ? '#EF3826' : '',
                      height: 27,
                      width: 93,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      borderRadius: '4px',
                      marginRight: '10px'
                    }}
                  />

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={createEditRoleHandler(selectedImageMember)}>Edit Role</MenuItem>
                    <Divider sx={{ borderWidth: '1px', borderColor: '#979797' }} />
                    <MenuItem onClick={handleClose} disabled>Change status</MenuItem>
                    <Divider sx={{ borderWidth: '1px', borderColor: '#979797' }} />
                    <MenuItem onClick={handleClose} disabled>Suspend</MenuItem>
                  </Menu>
                </TableCell>
                {Owner || Manager || TeamManagerandOwner   ? (
                  <TableCell>
                    <DeleteIcon onClick={() => handleRemoveClick(member)} sx={{ marginRight: 8 }} />
                    <Image
                      src={'/images/icons/modify.png'}
                      alt="Selected Image"
                      width={15}
                      height={15}
                      onClick={(event) => handleClick(event, member)}
                    />
                  </TableCell>
                ):(null)}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <Dialog
        open={confirmationDialogOpen}
        onClose={handleCancelRemove}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this user from the team?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelRemove} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRemove} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TeamComponent;
