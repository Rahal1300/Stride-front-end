// PlanItem.js
import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CheckboxBlankCircleOutline from 'mdi-material-ui/CheckboxBlankCircleOutline';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const PlanItem = ({ price }) => {
  return (

 
        <Box display="flex" alignItems="baseline" justifyContent="center" className="text-center">
          <Typography variant="h2" sx={{ color: 'primary.main',fontWeight:'600' }}>
           ${price}
          </Typography>
        </Box>

      
     
  );
};

export default PlanItem;
