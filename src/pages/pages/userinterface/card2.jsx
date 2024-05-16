import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const Card2 = ({ number,percentage }) => {
  return (
    <Card sx={{ padding: '20px', borderRadius: '8px', width: '262px', height: '161px', textAlign: 'left', position: 'relative' }}>
      <CardContent>
        <Typography
          variant="body1"
          sx={{
            width: '120px',
            height: '22px',
            position: 'absolute',
            top: '10px',
            left: '20px',
            opacity: 0.7,
            fontSize: '18px',
            fontFamily: 'Nunito Sans',
            color: '#404040'
          }}
        >
Total Projects        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>

          <Typography variant="h4" style={{ fontSize: '24px', fontWeight: '600', fontFamily: 'Nunito Sans', margin: '0' }}>{number}</Typography>
          
          <img src="/images/icons/Icon2.png" style={{ marginLeft: 'auto', width: '40px', height: '40px' }} alt="Manage Icon" />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
        <img src="/images/icons/stonks.png" style={{ marginLeft: 'auto', width: '24px', height: '24px' }} alt="Manage Icon" />

        <Typography style={{ color: '#00B69B', marginRight: '5px',fontFamily:'Nunito Sans',fontSize:'16px' }}>{percentage}%</Typography>
        <Typography variant="body2" style={{ fontSize: '14px', fontFamily: 'Nunito Sans', color: '#404040', display: 'inline' }}>
            Up from past month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Card2;
