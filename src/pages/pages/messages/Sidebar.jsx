import React from 'react';
import { List, ListItem, ListItemText, Typography, Divider, Card } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Adjust primary color as needed
    },
    secondary: {
      main: '#dc004e', // Adjust secondary color as needed
    },
    background: {
      default: '#f0f0f0', // Adjust default background color
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif', // Adjust font family
  },
});

const Sidebar = () => {
  // Function to get all unique labels from emails
  const getAllLabels = () => {
    let labels = new Set();
    emails.forEach((email) => {
      email.labels.forEach((label) => labels.add(label));
    });
    return Array.from(labels);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card variant="permanent" style={{ display: 'flex', flexDirection: 'column' }}>
        <List style={{ flexGrow: 1 }}>
          <ListItem>
            <Typography variant="h6">My Email</Typography>
          </ListItem>
          <Divider />
          <ListItem button style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary="Inbox" secondary="1253" />
          </ListItem>
          <ListItem button style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary="Starred" secondary="245" />
          </ListItem>
          <ListItem button style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary="Sent" secondary="24,532" />
          </ListItem>
          <ListItem button style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary="Draft" secondary="09" />
          </ListItem>
          <ListItem button style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary="Spam" secondary="14" />
          </ListItem>
          <ListItem button style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary="Important" secondary="18" />
          </ListItem>
          <ListItem button style={{ display: 'flex', justifyContent: 'space-between' }}>
            <ListItemText primary="Bin" secondary="9" />
          </ListItem>
          <Divider />
          {/* Additional list items can be added here */}
        </List>
      </Card>
    </ThemeProvider>
  );
};

export default Sidebar;
