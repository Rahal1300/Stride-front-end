import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { circularProgressClasses } from '@mui/material/CircularProgress'; // Add this line

function CustomizedProgressBars() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <CircularProgress
        variant="indeterminate"
        sx={{
          color:  '#1a90ff' ,
          animationDuration: '550ms',
          zIndex: 1,
          marginTop:'150px',
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={260}
        thickness={3}
      />
    </Box>
  );
}

export default CustomizedProgressBars;
