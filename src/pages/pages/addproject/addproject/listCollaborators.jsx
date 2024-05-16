import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import Avatar from '@mui/material/Avatar';
import TablePagination from '@mui/material/TablePagination'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';

import EyeOutlineIcon from 'mdi-material-ui/EyeOutline';
import DotsVerticalIcon from 'mdi-material-ui/DotsVertical';
import LeadPencil from 'mdi-material-ui/LeadPencil';
import IconButton from '@mui/material/IconButton';
import ExportVariant from 'mdi-material-ui/ExportVariant';
import { useTranslation } from 'react-i18next';

ExportVariant
import CollaboratorsList from './Components/collaborators-list'

import Paper from '@mui/material/Paper'


const rows = [
    {
      age: 27,
      status: 'Active',
      date: '09/27/2018',
      name: 'Sally Quinn',
      salary: '$19586.23',
      email: 'eebsworth2m@sbwire.com',
      designation: 'Human Resources Assistant',
      role: 'Admin',
      team: 'Enterprise'
    },
    {
      age: 61,
      status: 'Active',
      date: '09/23/2016',
      salary: '$23896.35',
      name: 'Margaret Bowers',
      email: 'kocrevy0@thetimes.co.uk',
      designation: 'Nuclear Power Engineer',
      role: 'Team Manager',
      team: 'Team'
    },
   
  ];
  

const statusObj = {
  Pending: { color: 'info' },
  Suspended: { color: 'error' },

  Active: { color: 'success' }
}

const Collaborators = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const { t } = useTranslation();

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
    return (


        <div>        <Typography variant='h6' sx={{ fontWeight: 600, marginTop: '50px' }}>
        {t('Collaborators_List')}
      </Typography>
      <Typography variant='body2'>{t('Add_team_members_and_collaborators')}</Typography>
      <Card className='mt-5'>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Button variant='outlined' color='secondary'>
                  <ExportVariant sx={{ marginRight: '10px' }} />
                  {t('Export')}
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                {/* Assuming CollaboratorsList is another component for adding collaborators */}
                <CollaboratorsList />
                <Button variant='contained'>{t('Add_Collaborator')}</Button>
              </Grid>
            </Grid>
          </CardContent>
          <TableContainer>
            <Table sx={{ minWidth: 800 }} aria-label='table in dashboard'>
              <TableHead>
                <TableRow>
                  <TableCell>{t('User')}</TableCell>
                  <TableCell>{t('Email')}</TableCell>
                  <TableCell>{t('Role')}</TableCell>
                  <TableCell>{t('Team')}</TableCell>
                  <TableCell>{t('Status')}</TableCell>
                  <TableCell>{t('Action')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                  return (
                    <TableRow hover key={row.name} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
                  <TableCell sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar src={`/images/avatars/${index+1}.png`} />
                      <Box sx={{ ml: 2 }}>
                        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.name}</Typography>
                        <Typography variant='caption'>{row.designation}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell >
                    {/* Assuming 'role' is one of Admin, Collaborator, Team Manager, Project Manager */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                     {row.role === 'Admin' && <img src={`/images/avatars/${row.role}.png`}  style={{ marginRight: '8px' }} />}
                     {row.role === 'Collaborator' && <img src={`/images/avatars/${row.role}.png`}  style={{ marginRight: '8px' }} />}
                      {row.role === 'Team Manager' && <img src={`/images/avatars/${row.role}.png`}  style={{ marginRight: '8px' }} />}
                      {row.role === 'Project Manager' && <img src={`/images/avatars/${row.role}.png`}  style={{ marginRight: '8px' }} />}
                        <Box sx={{ ml: 2 }}>
                        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.role}</Typography>
                        </Box>
                    </Box>
                  </TableCell>
                  <TableCell  >
                    {row.team }
            
                  </TableCell>
                  <TableCell >
                  {statusObj[row.status] ? (
                    <Chip
                      label={row.status}
                      color={statusObj[row.status].color}
                      
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        textTransform: 'capitalize',
                        '& .MuiChip-label': { fontWeight: 500 },
                      }}
                    />
                        ) : (
                          // Handle the case when the status is not defined in statusObj
                          <Chip label="Unknown Status" color="default" />
                        )}
                      </TableCell>
                               <TableCell>
                        <IconButton style={{ marginRight: '8px' }}>
                        <EyeOutlineIcon  />
                        </IconButton>
                     
                        <IconButton>
                        <LeadPencil />
                        </IconButton>
                        <IconButton>
                        <DotsVerticalIcon />
                        </IconButton>
                                </TableCell>
                                </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component='div'
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Card>
    </div>
  );
};

export default Collaborators;