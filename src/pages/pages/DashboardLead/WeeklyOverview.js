import React, { useState } from 'react';
import ReactApexcharts from 'src/@core/components/react-apexcharts'
import Card from '@mui/material/Card';

const WeeklyOverview = () => {
  const dates = [
    [new Date(2022, 0, 1, 8).getTime(), 12],   // January 1st, 2022, 8:00 AM, user spent 2 hours
    [new Date(2022, 0, 2, 10).getTime(), 1],  // January 2nd, 2022, 10:00 AM, user spent 1 hour
    [new Date(2022, 0, 3, 12).getTime(), 3],  // January 3rd, 2022, 12:00 PM, user spent 3 hours
    [new Date(2021, 0, 4, 14).getTime(), 10],  // January 4th, 2022, 2:00 PM, user spent 2 hours
    // Add more data as needed
  ];

  const [series] = useState([
    {
      name: 'Hours',
      data: dates
    }
  ]);

  const [options] = useState({
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0
    },
    title: {
      text: 'Sales Details',
      align: 'left'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    },
    yaxis: {
      min: 0,
      max: 15,
      labels: {
        formatter: function (val) {
          return Math.round(val).toString(); // Rounds the value to the nearest integer
        }
      },
      title: {
        text: 'Hours'
      },
    },
    xaxis: {
      type: 'datetime',
      labels: {
        formatter: function (value, timestamp) {
          const date = new Date(timestamp);
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'short' });
          return `${day} ${month}`;
        }
      }
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return Math.round(val).toString(); // Rounds the value to the nearest integer
        }
      }
    }
  });

  return (
        <Card sx={{Width:'1138px',
          Height:'444px',marginTop:10}}>

      <div id="chart">
        <ReactApexcharts options={options} series={series} type="area" height={450} />
      </div>
      <div id="html-dist"></div>
      </Card>
  );
};

export default WeeklyOverview;
