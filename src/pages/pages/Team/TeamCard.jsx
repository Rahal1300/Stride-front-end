import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Chip, Avatar, AvatarGroup, Menu, MenuItem } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';

const TeamCard = ({ team }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState(null);
  const usertoken = useSelector(loginSuccess);

  useEffect(() => {
    if (usertoken) {
      const base64Url = usertoken.payload.token.split('.')[1];
      const base64 = base64Url.replace('-', '+').replace('_', '/');
      const decodedToken = JSON.parse(window.atob(base64));
      setDecodedToken(decodedToken);
    }
  }, [usertoken]);
  const isAdmin = decodedToken && decodedToken.role === 'Admin';
  const isTeamManager = decodedToken && decodedToken.cr === 'TeamManager';
  const isCurrentUserTeamManager = team?.teamusers.some(user => user.role_in_team === 'TeamManager' && user.email === decodedToken.email);
  const shouldShowModifyIcon = isAdmin || (isTeamManager && isCurrentUserTeamManager);

  if (!team || !team.teamusers) {
    return <div>No Team or Team Users</div>;
  }

  const membersToShow = team.teamusers.slice(0, 3);
  const customTheme = createTheme({
    components: {
      MuiAvatar: {
        styleOverrides: {
          root: {
            border: '2px solid #6226EF', 
          },
          colorDefault: {
            color: '#6226EF',
            backgroundColor: '#E2EAF8',
          },
          rounded: {
            borderRadius: 5,
          }
        }
      }
    }
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleView = () => {
    router.push(`/pages/TeamView?id=${team.id}`);
  };

  return (
    <div >
      <ThemeProvider theme={customTheme}>
        <Card sx={{ display: 'flex', justifyContent: 'center', minHeight: 200, border: 'none', boxShadow: 'none', marginLeft: 2, position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
            <Image
              src="/images/icons/modify.png"
              width={20}
              height={20}
              alt="Filter Icon"
              onClick={handleClick}
              style={{ cursor: 'pointer' }}
            />
          </Box>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {team.teamName}
            </Typography>
            <Typography variant="body1">
              Team Manager: {team.teamManager}
            </Typography>
            <Typography variant="body1" sx={{ marginTop: 2, marginBottom: 1 }}>
              Assigned Projects: {team.numberofprojects}
            </Typography>
            <Typography variant="body1">
              <Chip
                label={team.enabled ? 'Active' : 'Suspended'}
                sx={{
                  borderRadius: '2px',
                  width: '93px',
                  Height: '27px',
                  backgroundColor: team.enabled ? 'rgba(0, 182, 155, 0.2)' : 'rgba(255, 167, 86, 0.3)',
                  color: team.enabled ? '#00B69B' : '#FFA756', marginTop: 2, marginBottom: 1
                }}
              />
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
              <AvatarGroup max={4}>
                {membersToShow.map(member => (
                  <Avatar
                    key={member.id}
                    alt={member.first_name}
                    src={member.image || '/default-avatar.jpg'} // Provide a default avatar image URL
                  />
                ))}
              </AvatarGroup>
            </Box>
          </CardContent>
          <Menu
            id="team-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleView}>View List</MenuItem>
            {shouldShowModifyIcon && (
              <MenuItem onClick={handleClose}>Delete</MenuItem>
            )}
          </Menu>
        </Card>
      </ThemeProvider>
    </div>
  );
};

export default TeamCard;
