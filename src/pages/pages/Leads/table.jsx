import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Chip from '@mui/material/Chip'
import Image from 'next/image';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import { useRouter } from 'next/router';

import MoreVertIcon from '@mui/icons-material/MoreVert';
const createData = (ID, DATE_ADDED, name, COMPANY, SOURCE, CHANNEL, ASSIGNED_TO, Notes, Label, Stage) => {
  return { ID, DATE_ADDED, name, COMPANY, SOURCE, CHANNEL, ASSIGNED_TO, Notes, Label, Stage }
}

const rows = [
  createData(
    '00001',
    '2019-09-04',
    'Christine Brooks',
    '089 Kutch Green Apt. 448',
    '2019-09-04',
    '2019-09-04',
    '2019-09-04',
    '2019-09-04',
    'Important',
    'Converted'
  ),
  createData(
    '00002',
    '2019-05-28',
    'Rosie Pearson',
    '979 Immanuel Ferry Suite 526',
    '2019-05-28',
    '2019-05-28',
    '2019-05-28',
    '2019-05-28',
    'In transit',
    'Lost Lead'
  ),
  createData(
    '00003',
    '2019-05-28',
    'Rosie Pearson',
    '979 Immanuel Ferry Suite 526',
    '2019-05-28',
    '2019-05-28',
    '2019-05-28',
    '2019-05-28',
    'On Hold',
    'Not Qualified'
  ),
  createData(
    '00004',
    '2019-05-28',
    'Rosie Pearson',
    '979 Immanuel Ferry Suite 526',
    '2019-05-28',
    '2019-05-28',
    '2019-05-28',
    '2019-05-28',
    'Potential',
    'Intake'
  ),
  createData(
    '00005',
    '2019-05-28',
    'Rosie Pearson',
    '979 Immanuel Ferry Suite 526',
    '2019-05-28',
    '2019-05-28',
    '2019-05-28',
    '2019-05-28',
    'Qualified',
    'Qualified'
  ),
  // Add more rows here as needed
];


const TableLeads = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const router = useRouter();

  const handleEdit = (ID) => {
    handleClose();
    // router.push(`/pages/UpdateLead?id=${id}`);

    console.log(ID); // Log the ID of the selected lead

  };


  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 850 }}  aria-label='a dense table'>
        <TableHead  sx={{ 
    width: '88px', 
    height: '19px', 
    top: '276px', 
    left: '445px', 
    fontFamily: 'Nunito Sans', 
    fontWeight: 600, 
    fontSize: '14px', 
    lineHeight: '19.1px', 
    color: 'black' 
  }}>
          <TableRow   >
            <TableCell>Date added</TableCell>
            <TableCell >Name</TableCell>
            <TableCell >Company</TableCell>
            <TableCell >Source</TableCell>
            <TableCell >Channel</TableCell>
            <TableCell >Assigned To</TableCell>
            <TableCell >Notes</TableCell>
            <TableCell >Label</TableCell>
            <TableCell >Stage</TableCell>
            <TableCell >
<Image
                    src={'/images/icons/modify.png'}
                    alt="Selected Image"
                    width={15}
                    height={15}

                  /></TableCell>

          </TableRow>
        </TableHead>
        <TableBody             
 >
          {rows.map(row => (
            <TableRow key={row.ID} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
      
              <TableCell  style={{  fontSize: '14px', color: 'black' }} >{row.DATE_ADDED}</TableCell>
              <TableCell  style={{  fontSize: '14px', color: 'black' }}>{row.name}</TableCell>
              <TableCell  style={{ fontSize: '14px', color: 'black' }}>{row.COMPANY}</TableCell>
              <TableCell  style={{  fontSize: '14px', color: 'black' }}>{row.SOURCE}</TableCell>
              <TableCell  style={{  fontSize: '14px', color: 'black' }}>{row.CHANNEL}</TableCell>

              <TableCell  style={{  fontSize: '14px', color: 'black' }}>{row.ASSIGNED_TO}</TableCell>
           
              <TableCell  style={{  fontSize: '14px', color: 'black' }}>{row.Notes}</TableCell>

              
              
              <TableCell  style={{ fontSize: '14px', color: 'black' }}> 
  <Chip
    size='small'
    label={row.Label} 
    style={{
      backgroundColor: 'white',

                       color: row.Label === 'Important' ? '#FD5454' :
                       row.Label === 'In transit' ? '#4379EE' :
                       row.Label === 'On Hold' ? '#6226EF' :

                       row.Label === 'Potential' ? '#FCBE2D' :
                       row.Label === 'Qualified' ? '#00B69B' : '',      height: 27,
                       borderColor: row.Label === 'Important' ? '#FD5454' :
                       row.Label === 'In transit' ? '#4379EE' :
                       row.Label === 'On Hold' ? '#6226EF' :
                       row.Label === 'Potential' ? '#FCBE2D' :
                       row.Label === 'Qualified' ? '#00B69B' : '',
                       border: '1px solid',
      width: 93,
      fontSize: '0.75rem',
      fontWeight: 500,
      borderRadius: '10px'
    }}
  />
</TableCell>
<TableCell align='right' style={{ fontSize: '14px', color: 'black' }}> 
  <Chip
    size='small'
    label={row.Stage} 
    style={{
      backgroundColor: row.Stage === 'Converted' ? '#00B69B' :
                       row.Stage === 'Lost Lead' ? '#FD5454' :
                       row.Stage === 'Not Qualified' ? '#606060' :
                       row.Stage === 'Intake' ? '#FCBE2D' : 
                       row.Stage === 'Qualified' ? '#4379EE' : '',
                       borderColor: row.Stage === 'Important' ? '#FD5454' :
                       row.Stage === 'In transit' ? '#4379EE' :
                       row.Stage === 'On Hold' ? '#6226EF' :
                       row.Stage === 'Potential' ? '#FCBE2D' :
                       row.Stage === 'Qualified' ? '#00B69B' : '',
                       color:  '#FFFFFF' ,
                         height: 27,
                          width: 122,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          borderRadius: '10px'
    }}
  />



</TableCell>
<TableCell>

<MoreVertIcon  onClick={handleClick}/></TableCell>
<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleClose}

  
>
<MenuItem onClick={() => {
  console.log(row.ID); // Log the ID before calling handleEdit
  handleEdit(row.ID);
}}>Edit</MenuItem>
  <Divider sx={{  borderWidth: '1px',borderColor:'#979797' }}/>

  <MenuItem>Change stage</MenuItem>
  <Divider sx={{  borderWidth: '1px',borderColor:'#979797' }}/>

  <MenuItem onClick={handleClose}>Assign to </MenuItem>
  <Divider sx={{  borderWidth: '1px',borderColor:'#979797' }}/>

  <MenuItem onClick={handleClose}>View Lead</MenuItem>

</Menu>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableLeads
