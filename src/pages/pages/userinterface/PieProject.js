import React, { useState } from 'react';
import ReactApexcharts from 'src/@core/components/react-apexcharts';
import Card from '@mui/material/Card';
import { Grid, Typography } from '@mui/material';

const PieProject = () => {
  const [pieSeries] = useState([30, 70, 50]); // Example data
  const [pieOptions] = useState({
    chart: {
      type: 'pie',
      height: '100%'
    },
    labels: ['Active', 'Pending', 'Inactive'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: '100%',
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
  });

  return (
    <Card sx={{ width: '100%', height: '100%' }}>
      <Grid container justifyContent="center" alignItems="center" height="100%" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6" align="center" gutterBottom>
            Project Status
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <div id="pie-chart">
            <ReactApexcharts options={pieOptions} series={pieSeries} type="pie" height={350} />
          </div>
        </Grid>
      </Grid>
    </Card>
  );
};

export default PieProject;