// ** MUI Imports
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Chip from '@mui/material/Chip'




const TableProject = ({rows}) => {


  if (!rows) {
    return null; // or render a loading indicator, an empty state, or handle it in any appropriate way
  }

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
            <TableCell align='right'>name</TableCell>
            <TableCell align='right'>Description</TableCell>
            <TableCell align='right'>Start Date</TableCell>
            <TableCell align='right'>End Date</TableCell>
            <TableCell align='right'>Progress</TableCell>
            <TableCell align='right'>STATUS</TableCell>

          </TableRow>
        </TableHead>
        <TableBody             
 >
{rows.map(row => (
            <TableRow key={row.ID} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
       
       
              <TableCell align='right' style={{  fontSize: '14px', color: 'black' }} >{row.projectName}</TableCell>
              <TableCell align='right' style={{  fontSize: '14px', color: 'black' }}>{row.description}</TableCell>
              <TableCell align='right' style={{ fontSize: '14px', color: 'black' }}>{row.startDate}</TableCell>
              <TableCell align='right' style={{  fontSize: '14px', color: 'black' }}>{row.enddate}</TableCell>
              <TableCell align='right' style={{  fontSize: '14px', color: 'black' }}>{row.progress}</TableCell>
              <TableCell align='right' style={{ fontSize: '14px', color: 'black' }}> 
  <Chip
    size='small'
    label={row.status} 
    style={{
      backgroundColor: row.status === 'Completed' ? 'rgba(0, 182, 155, 0.2)' :
                       row.status === 'In Progress' ? 'rgba(98, 38, 239, 0.2)' :
                       row.status === 'On Hold' ? 'rgba(255, 167, 86, 0.3)' :
                       row.status === 'Canceled' ? 'rgba(239, 56, 38, 0.2)' : '',
                       color: row.status === 'Completed' ? '#00B69B' :
                       row.status === 'In Progress' ? '#6226EF' :
                       row.status === 'On Hold' ? '#FFA756' :
                       row.status === 'Canceled' ? '#EF3826' : '',      height: 27,
      width: 93,
      fontSize: '0.75rem',
      fontWeight: 500,
      borderRadius: '4px'
    }}
  />
</TableCell>




            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TableProject
