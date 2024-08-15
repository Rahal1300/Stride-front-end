// EmailList.js

import React, { useState } from 'react';
import { List, ListItem, ListItemText, Typography, Divider, Paper, IconButton, TextField, Grid } from '@mui/material';
const emails = [
  {
    id: 1,
    sender: 'john.doe@example.com',
    subject: 'Meeting tomorrow',
    body: 'Hey, just a reminder about our meeting tomorrow at 10 AM.',
    messages: [
      { time: '6.30 pm', text: 'There are many variations of passages of Lorem Ipsum available...' },
      { time: '6.34 pm', text: 'The point of using Lorem Ipsum is that it has a more-or-less normal distribution...' }
    ]
  },
  {
    id: 2,
    sender: 'jane.smith@example.com',
    subject: 'Project update',
    body: 'Here is the latest update on the project. Please review.',
    messages: [
      { time: '6.38 pm', text: 'Contrary to popular belief, Lorem Ipsum is not simply random text...' }
    ]
  },
  // Add more emails as needed
];
const EmailList = () => {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  const handleEmailClick = (email) => {
    setSelectedEmail(email);
  };

  const handleReplyChange = (event) => {
    setReplyMessage(event.target.value);
  };

  const handleSendReply = () => {
    // Implement send reply functionality here
    console.log('Sending reply:', replyMessage);
    // Clear reply message input after sending
    setReplyMessage('');
  };

  return (
    <div style={{ display: 'flex' }}>
      {/* Email List */}
      <div style={{ width: '30%', marginRight: '20px' }}>
        <List>
          {emails.map((email) => (
            <ListItem button key={email.id} onClick={() => handleEmailClick(email)}>
              <ListItemText
                primary={email.sender}
                secondary={email.subject}
              />
            </ListItem>
          ))}
        </List>
      </div>

      {/* Email Details */}
      {selectedEmail && (
        <div style={{ width: '70%' }}>
          <Paper elevation={3} style={{ padding: '20px' }}>
            <Typography variant="h6">{selectedEmail.sender}</Typography>
            <Typography variant="subtitle1">{selectedEmail.subject}</Typography>
            <Divider style={{ margin: '10px 0' }} />
            <Typography variant="body1">{selectedEmail.body}</Typography>
            <Divider style={{ margin: '10px 0' }} />
            {selectedEmail.messages.map((message, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <Typography variant="subtitle2">{message.time}</Typography>
                <Typography variant="body2">{message.text}</Typography>
              </div>
            ))}
            {/* Reply Section */}
            <Grid container spacing={1} alignItems="center" style={{ marginTop: '20px' }}>
              <Grid item xs={10}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  value={replyMessage}
                  onChange={handleReplyChange}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton color="primary" onClick={handleSendReply}>
                  {/* Icon for send */}
                  {/* Replace with your send icon */}
                  Send
                </IconButton>
              </Grid>
            </Grid>
          </Paper>
        </div>
      )}
    </div>
  );
};

export default EmailList;
