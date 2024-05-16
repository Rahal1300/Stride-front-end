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
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round',
          },
        }}
        size={300}
        thickness={4}
      />
    </Box>
  );
}

export default CustomizedProgressBars;
