import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';

const CreateTeam = ({ onEmailSelect }) => {
  const usertoken = useSelector(loginSuccess);
  const [listOfTeam, setlistOfTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedTeamEmails, setSelectedTeamEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [message, setMessage] = useState('');

  const handleAdditionalEmailChange = (index, event) => {
    const updatedEmails = [...additionalEmails];
    updatedEmails[index] = event.target.value;
    setAdditionalEmails(updatedEmails);
    onEmailSelect([selectedEmail, ...updatedEmails]);
  };

  const handleEmailChange = (event) => {
    setSelectedEmail(event.target.value);
    onEmailSelect([event.target.value, ...additionalEmails]);
  };

  const handleRemoveLastEmail = () => {
    if (additionalEmails.length > 0) {
      const updatedEmails = [...additionalEmails];
      updatedEmails.pop(); 
      setAdditionalEmails(updatedEmails);
      onEmailSelect([selectedEmail, ...updatedEmails]);
    }
  };

  const handleAddEmail = () => {
    if (additionalEmails.length < selectedTeamEmails.length - 1) {
      setAdditionalEmails([...additionalEmails, '']);
      onEmailSelect([selectedEmail, ...additionalEmails]);
      setMessage('');
    } else {
      setMessage('You cannot exceed the team member count');
    }
  };
  
  const fetchTeam = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/with-users-and-roles`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });
      const data = await response.json();
      setlistOfTeam(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching team data:', error);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleDropdownChange = (event) => {
    const selectedTeamName = event.target.value;
    setSelectedTeam(selectedTeamName);
  
    setAdditionalEmails([]);
    onEmailSelect([]);
  
    const selectedTeamData = listOfTeam.find((team) => team.teamName === selectedTeamName);
    setSelectedTeamEmails(selectedTeamData?.teamusers.map((user) => user.email) || []);
    setSelectedEmail('');
  };
  

  return (
    <div style={{ marginTop: '50px' }} >
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
            Searching for Teams
          </Typography>
        </div>
      )}

<FormControl fullWidth >
        <InputLabel id="team-dropdown-label">Select Team</InputLabel>
        <Select
          labelId="team-dropdown-label"
          id="team-dropdown"
          value={selectedTeam}
          onChange={handleDropdownChange}
          disabled={loading}
          style={{ zIndex: 10000, position: 'relative' }}  // Add position: 'relative'


        >
         {listOfTeam &&
  listOfTeam.map((team, index) => (
    <MenuItem key={`${team.id}-${index}`} value={team.teamName}          
    >
      {team.teamName}
    </MenuItem>
  ))}

        </Select>
      </FormControl>

      {selectedTeam && (
        <div style={{ marginTop: '20px' }}>
          <FormControl fullWidth>
            <InputLabel id="email-dropdown-label">Select Email</InputLabel>
            <Select
              labelId="email-dropdown-label"
              id="email-dropdown"
              value={selectedEmail}
              onChange={handleEmailChange}
              disabled={loading}
            >
              {selectedTeamEmails.map((email, index) => (
                <MenuItem key={index} value={email}>
                  {email}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {additionalEmails.map((email, index) => (
            <div key={index} style={{ marginTop: '10px' }}>
              <FormControl fullWidth>
                <InputLabel id={`additional-email-dropdown-label-${index}`}>Additional Email</InputLabel>
                <Select
                  labelId={`additional-email-dropdown-label-${index}`}
                  id={`additional-email-dropdown-${index}`}
                  value={email}
                  onChange={(event) => handleAdditionalEmailChange(index, event)}
                  disabled={loading}
                >
                  {selectedTeamEmails.map((teamEmail, teamIndex) => (
                    <MenuItem key={teamIndex} value={teamEmail}>
                      {teamEmail}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Typography variant="body2" color="error" sx={{ marginTop: 2 }}>
            {message}
          </Typography>
            </div>
            
          ))}

          <Button variant="outlined" color="primary" onClick={handleAddEmail} style={{ marginTop: '10px' }}>
            +
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleRemoveLastEmail}
            style={{ marginTop: '10px', marginLeft: '10px' }}
          >
            -
          </Button>
     
        </div>
      )}
    </div>
  );
};

export default CreateTeam;
