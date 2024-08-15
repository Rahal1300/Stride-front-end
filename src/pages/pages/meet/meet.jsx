import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { Typography, Card, Chip, Tooltip, Box, TextField } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
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

// const meetings = [
//   {
//     name: 'Project Alpha',
//     topic: 'Kickoff Meeting',
//     userEmails: ['user1@example.com', 'user2@example.com', 'user3@example.com'],
//     startDate: '2023-05-15 09:00 AM',
//     duration: '60 minutes',
//     mandatory: 'Yes',
//     description: 'Initial project meeting to discuss goals and deliverables.',
//     label: ['Important'],
//     Idproject: 1,
//     Meeting_type: {
//       vr: true,
//       googleMeet: false,
//       inPerson: true
//     }
//   },
//   {
//     name: 'Project Beta',
//     topic: 'Sprint Planning',
//     userEmails: ['user4@example.com', 'user5@example.com'],
//     startDate: '2023-05-20 10:30 AM',
//     duration: '90 minutes',
//     mandatory: 'No',
//     description: null, // No description provided
//     label: ['Urgent'],
//     Idproject: 2,
//     Meeting_type: {
//       vr: false,
//       googleMeet: true,
//       inPerson: false
//     }
//   },
//   // Add more meetings as needed
// ];
const UserEmails = ({ emails }) => {
  const renderUserEmails = () => {
    if (emails.length <= 2) {
      return emails.map((email, index) => (
        <Chip key={index} label={email} style={{ margin: '2px' }} />
      ));
    } else {
      const visibleEmails = emails.slice(0, 2); // Display the first two emails
      const remainingCount = emails.length - 2; // Calculate the count of remaining emails
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
}
const DescriptionCell = ({ description }) => (
  <TableCell>
    {description ? (
      <Tooltip title={description} placement="top">
        <Typography variant="body1">
          {description.length > 0? `Read Here` : description}
        </Typography>
      </Tooltip>
    ) : (
      <Typography variant="body1" color="textSecondary">
        No description provided
      </Typography>
    )}
  </TableCell>
);

// const MeetingType = ({ meetingType }) => (
//   <div>
//     {Object.entries(meetingType).map(([key, value]) => {
//       if (value) {
//         return <div key={key}>{key}</div>;
//       }
//       return null;
//     })}
//   </div>
// );

const TableSpanning = ({meetings}) => {
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
  
  return (
    <ThemeProvider theme={theme}>
      
      <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            style={{ width: '20%', height: '20%',margin:30 }}
            onChange={handleSearch}
          />
      <Card  sx={{ margin: 5 }}>
   
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
    <Chip label="VR Meeting" color="primary"/>
  )}
  {meeting.meeting_type === 'googleMeet' && (
    <Chip label="Google Meet" color="secondary"  />
  )}
  {meeting.meeting_type === 'inPerson' && (
    <Chip label="In Person" color="info"  />
  )}
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
