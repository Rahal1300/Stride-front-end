// pages/index.js

import React from 'react';
import { Grid, Paper,Card } from '@mui/material';
import Sidebar from './Sidebar';
import EmailList from './EmailList';

const HomePage = () => {
  return (
    <Card>
    <Grid container spacing={2}>
      {/* Sidebar */}
      <Grid item xs={3}>
        <Sidebar />
      </Grid>

      {/* Email List */}
      <Grid item xs={9}>
        <Paper elevation={3} style={{ padding: '20px', minHeight: '80vh' }}>
          <EmailList />
        </Paper>
      </Grid>
    </Grid></Card>
  );
};

export default HomePage;
