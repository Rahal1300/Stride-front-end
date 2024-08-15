import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {Button } from '@mui/material';
import { useRouter } from 'next/router';

import Box from '@mui/material/Box';

const TableProject = ({ rows }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRows, setFilteredRows] = useState(rows);
  const customTheme = createTheme({
    components: {
      MuiAvatar: {
        styleOverrides: {
          root: {
            border: '2px solid #6226EF', 
          },
          colorDefault: {
            color: '#6226EF',
            backgroundColor: '#E2EAF8',
          },
          rounded: {
            borderRadius: 5,
          }
        }
      }
    }
  });
  useEffect(() => {
    setFilteredRows(rows);
  }, [rows]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filteredList = rows.filter((row) =>
      row.projectName.toLowerCase().includes(query) ||
      row.description.toLowerCase().includes(query)
      
    );
    setFilteredRows(filteredList);
  };

  if (!rows) {
    return null; 
  }
  
  const router = useRouter();

  const handleView = (row) => {
    router.push({
      pathname: '/pages/projectDetailNew/',
      query: {
        id: row.id
      },
    });
  };
  /*if (!project || !project.image) {
    return null; // or render a loading indicator, an empty state, or handle it in any appropriate way
  }
*/
  return (
    <ThemeProvider theme={customTheme}>
        <TextField
          label="Search"
          variant="outlined"
          value={searchQuery}
          style={{ width: '35%', height: '20%',marginBottom:20 }}
          onChange={handleSearch}
        /> 
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 850 }} aria-label='a dense table'>
          <TableHead
            sx={{
              width: '88px',
              height: '19px',
              top: '276px',
              left: '445px',
              fontFamily: 'Arial',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '19.1px',
              color: 'black',
            }}
          >
            <TableRow>
              <TableCell align='right'>Name</TableCell>
              <TableCell align='right'>Description</TableCell>
              <TableCell align='right'>Start Date</TableCell>
              <TableCell align='right'>End Date</TableCell>
              <TableCell align='right'>Progress</TableCell>
              <TableCell align='right'>Status
          </TableCell>
          <TableCell align='right'>
            View
          </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map(row => (
              <TableRow key={row.ID} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
                <TableCell align='right' style={{ fontSize: '14px', color: 'black' }}>
                {row.projectName ? row.projectName : 'No project name available'}
              </TableCell>
              <TableCell align='right' style={{ fontSize: '14px', color: 'black' }}>
                {row.description ? row.description : 'No description available'}
              </TableCell>
              <TableCell align='right' style={{ fontSize: '14px', color: 'black' }}>
                {row.startDate ? row.startDate : 'No start date available'}
              </TableCell>
              <TableCell align='right' style={{ fontSize: '14px', color: 'black' }}>
                {row.enddate ? row.enddate : 'No end date available'}
              </TableCell>
                <TableCell align='right' style={{ fontSize: '14px', color: 'black' }}>{row.progress}</TableCell>
                <TableCell align='right' style={{ fontSize: '14px', color: 'black' }}>
                  <Chip
                    size='small'
                    label={row.status}
                    style={{
                      backgroundColor: row.status === 'ACTIVE' ? 'rgba(0, 182, 155, 0.2)' :
                            row.status === 'In Progress' ? 'rgba(98, 38, 239, 0.2)' :
                            row.status === 'On Hold' ? 'rgba(255, 167, 86, 0.3)' :
                            row.status === 'Canceled' ? 'rgba(239, 56, 38, 0.2)' : '',
                            color: row.status === 'ACTIVE' ? '#00B69B' :
                            row.status === 'In Progress' ? '#6226EF' :
                            row.status === 'On Hold' ? '#FFA756' :
                            row.status === 'Canceled' ? '#EF3826' : '',
                            height: 27,
                            width: 93,
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            borderRadius: '4px'
                    }}
                  />
                </TableCell>
                <TableCell   align='right' style={{ fontSize: '14px', color: 'black' }}>
                    <Button key={row.id}
                variant="contained"
                sx={{
                  backgroundColor: "#E2EAF8",
                  marginLeft: '15px',
                  color: "#202224",
                  border: "none",
                  "&:hover": {
                    backgroundColor: "#E2EAF8",
                  },
                }}
                onClick={()=>
                  {
                    router.push({
                      pathname: '/pages/projectDetailNew/',
                      query: {
                        id: row.id
                      },
                    });
                  }
                }
              >
                View Project
              </Button>
          </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
};

export default TableProject;
