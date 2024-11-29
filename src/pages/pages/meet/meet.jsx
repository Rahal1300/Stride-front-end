import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { Typography, Card, Chip, Tooltip, Box, TextField, Button } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';

import axios from 'axios';

const theme = createTheme({
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      color: '#202224',
      marginBottom: '1rem',
    },
    body1: {
      fontSize: '0.875rem',
    },
  },
  palette: {
    label: {
      important: '#FF3D00', // Red
      high: '#FFD600', // Yellow
      low: '#00BFA5', // Green
      urgent: '#6200EA', // Purple
    },
  },
});

const UserEmails = ({ emails }) => {
  const renderUserEmails = () => {
    if (emails.length <= 2) {
      return emails.map((email, index) => (
        <Chip key={index} label={email} style={{ margin: '2px' }} />
      ));
    } else {
      const visibleEmails = emails.slice(0, 2);
      const remainingCount = emails.length - 2;
      return (
        <>
          {visibleEmails.map((email, index) => (
            <Chip key={index} label={email} style={{ margin: '2px' }} />
          ))}
          <Tooltip
            title={
              <div>
                {emails.slice(2).map((email, index) => (
                  <div key={index}>{email}</div>
                ))}
              </div>
            }
            placement="top"
          >
            <Chip label={`+${remainingCount}`} style={{ margin: '2px' }} />
          </Tooltip>
        </>
      );
    }
  };
  return (
    <div>
      {renderUserEmails()}
    </div>
  );
};

const DescriptionCell = ({ description }) => (
  <TableCell>
    {description ? (
      <Tooltip title={description} placement="top">
        <Typography variant="body1">
          {description.length > 0 ? `Read Here` : description}
        </Typography>
      </Tooltip>
    ) : (
      <Typography variant="body1" color="textSecondary">
        No description provided
      </Typography>
    )}
  </TableCell>
);

const TableSpanning = ({ meetings }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMeetings, setFilteredMeetings] = useState(meetings);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredList = meetings.filter((meeting) =>
      meeting.name.toLowerCase().includes(query)
    );
    setFilteredMeetings(filteredList);
  };
  const usertoken = useSelector(loginSuccess);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/visits/delete/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
          'Content-Type': 'application/json',
        },
      });


      console.log('Delete successful:', response.data);
      // Optionally update the state to remove the deleted item from the UI
      setFilteredMeetings((prevMeetings) => prevMeetings.filter(meeting => meeting.id !== id));
    } catch (error) {
      console.error('Error deleting visit:', error);
      alert('Failed to delete visit. Please try again later.');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <TextField
        label="Search"
        variant="outlined"
        value={searchQuery}
        style={{ width: '20%', height: '20%', margin: 30 }}
        onChange={handleSearch}
      />
      <Card sx={{ margin: 5 }}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1300 }} aria-label='spanning table'>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Topic</TableCell>
                <TableCell>Participants</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Mandatory</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>Project Name</TableCell>
                <TableCell>Meeting Type</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMeetings?.map((meeting, index) => (
                <TableRow key={index}>
                  <TableCell>{meeting.name}</TableCell>
                  <TableCell>{meeting.topic}</TableCell>
                  <TableCell><UserEmails emails={meeting.attendees} /></TableCell>
                  <TableCell>{meeting.startDate}</TableCell>
                  <TableCell>{meeting.duration} Min</TableCell>
                  <TableCell>
                    {meeting.mandatory === 'Yes' ? (
                      <Chip label="Yes" color="success" style={{ marginRight: '4px' }} />
                    ) : (
                      <Chip label="No" color="error" style={{ marginRight: '4px' }} />
                    )}
                  </TableCell>
                  <DescriptionCell description={meeting.description} />
                  <TableCell>
                    {meeting.label === 'Urgent' && (
                      <Chip label="Urgent" color="error" style={{ marginRight: '4px' }} />
                    )}
                    {meeting.label === 'Important' && (
                      <Chip label="Important" color="primary" style={{ marginRight: '4px' }} />
                    )}
                    {meeting.label === 'High Priority' && (
                      <Chip label="High Priority" color="secondary" style={{ marginRight: '4px' }} />
                    )}
                    {meeting.label === 'Low Priority' && (
                      <Chip label="Low Priority" color="default" style={{ marginRight: '4px' }} />
                    )}
                  </TableCell>
                  <TableCell>{meeting.project_name}</TableCell>
                  <TableCell>
                    {meeting.meeting_type === 'vr' && (
                      <Chip label="VR Meeting" color="primary" />
                    )}
                    {meeting.meeting_type === 'googleMeet' && (
                      <Chip label="Google Meet" color="secondary" />
                    )}
                    {meeting.meeting_type === 'inPerson' && (
                      <Chip label="In Person" color="info" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(meeting.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </ThemeProvider>
  );
};

export default TableSpanning;
