import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Chip from '@mui/material/Chip';
import Image from 'next/image';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import { useRouter } from 'next/router';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { FormControl, InputLabel, Snackbar, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import axios from 'axios';
const stages = ['Converted', 'Lost Lead', 'Not Qualified', 'Intake', 'Qualified'];
const labels = ['Important', 'In transit', 'On Hold', 'Potential', 'Qualified'];
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});
const TableLeads = ({ leads }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [editStageRowId, setEditStageRowId] = useState(null);
  const [editLabelRowId, setEditLabelRowId] = useState(null);
  const [editAssignToRowId, setEditAssignToRowId] = useState(null); // New state
  const [selectedStage, setSelectedStage] = useState('');
  const [selectedLabel, setSelectedLabel] = useState('');
  const [selectedManager, setSelectedManager] = useState('');
  const [teamManagers, setTeamManagers] = useState([]); // Add this state
  const [loading, setLoading] = useState(false);
  const [snackOpen, setSnackOpen] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackSeverity, setSnackSeverity] = useState('success');

  const router = useRouter();
  const usertoken = useSelector(loginSuccess);

  const handleEdit = (id) => {
    handleClose();
    router.push(`/pages/UpdateLead?id=${id}`);
  };
  useEffect(() => {
    const fetchTeamManagers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/TeamManagersFromCompany`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });
    
        if (response.status === 200) {
          setTeamManagers(response.data);
        } else {
          setSnackSeverity('error');
          setSnackMessage('Failed to fetch team managers');
          setSnackOpen(true);
        }
      } catch (error) {
        console.error('Error fetching team managers:', error);
        setSnackSeverity('error');
        setSnackMessage('Failed to fetch team managers');
        setSnackOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamManagers();
  }, [usertoken]);

  const handleClose = () => {
    setAnchorEl(null);
    setEditStageRowId(null);
    setEditLabelRowId(null);
    setEditAssignToRowId(null);
  };

  const handleCloseSnackbar = () => {
    setSnackOpen(false);
  };

  const handleClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedRowId(id);
  };

  const handleStageChange = async (event, row) => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/update/${row.leads_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
        body: JSON.stringify({ stage: event.target.value ,leads_id: row.leads_id  }),
      });
  
      if (response.ok) {
        setSelectedStage(event.target.value);
        row.stage = event.target.value;
        setEditStageRowId(null);
        setSnackSeverity('success');
        setSnackMessage('Stage updated successfully');
        setSnackOpen(true);
      } else {
        setSnackSeverity('error');
        setSnackMessage('Failed to update stage');
        setSnackOpen(true);
      }
    } catch (error) {
      console.error('Error updating stage:', error);
      setSnackSeverity('error');
      setSnackMessage('Failed to update stage');
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };
  const handleLabelChange = async (event, row) => {
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/update/${row.leads_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
        body: JSON.stringify({ label: event.target.value ,leads_id: row.leads_id  }),
      });
  
      if (response.ok) {
        setSelectedLabel(event.target.value);
        row.label = event.target.value;
        setEditLabelRowId(null);
        setSnackSeverity('success');
        setSnackMessage('Label updated successfully');
        setSnackOpen(true);
      } else {
        setSnackSeverity('error');
        setSnackMessage('Failed to update label');
        setSnackOpen(true);
      }
    } catch (error) {
      console.error('Error updating label:', error);
      setSnackSeverity('error');
      setSnackMessage('Failed to update label');
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };
  const handleManagerChange = async (event, row) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads/update/${row.leads_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
        body: JSON.stringify({ user_assigned_to: event.target.value ,leads_id: row.leads_id  }),
      });
  
      if (response.ok) {
        setSelectedManager(event.target.value);
      row.user_assigned_to = event.target.value; 
      setEditAssignToRowId(null);
      setSnackSeverity('success');
      setSnackMessage('Assigned manager updated successfully');
      setSnackOpen(true);
      } else {
        setSnackSeverity('error');
        setSnackMessage('Failed to update assigned manager');
        setSnackOpen(true);
      }
    } catch (error) {
      console.error('Error updating assigned manager:', error);
      setSnackSeverity('error');
      setSnackMessage('Failed to update assigned manager');
      setSnackOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  const handleStageEdit = (id) => {
    setEditStageRowId(id);
    setAnchorEl(null);
  };

  const handleLabelEdit = (id) => {
    setEditLabelRowId(id);
    setAnchorEl(null);
  };
  const handleAssignToEdit = (id) => {
    setEditAssignToRowId(id);
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>

    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 850 }} aria-label='a dense table'>
        <TableHead
          sx={{
            width: '88px',
            height: '19px',
            fontFamily: 'Arial',
            fontWeight: 600,
            fontSize: '14px',
            lineHeight: '19.1px',
            color: 'black',
          }}>
          <TableRow>
            <TableCell>Date added</TableCell>
            <TableCell>Project</TableCell>

            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Company</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Channel</TableCell>
            <TableCell>Assigned To</TableCell>
            <TableCell>Notes</TableCell>
            <TableCell>Label</TableCell>
            <TableCell>Stage</TableCell>
            <TableCell>
              <Image src={'/images/icons/modify.png'} alt="Modify" width={15} height={15} />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leads?.map((row) => (
            <TableRow key={row.leads_id} sx={{ '&:last-of-type td, &:last-of-type th': { border: 0 } }}>
              <TableCell style={{ fontSize: '14px', color: 'black' }}>
                {row.added_date ? new Date(row.added_date).toLocaleDateString() : 'NULL'}
              </TableCell>
              <TableCell style={{ fontSize: '14px', color: 'black' }}>{row.project || 'No project assigned yet'}</TableCell>

              <TableCell style={{ fontSize: '14px', color: 'black' }}>{row.first_name || 'Add first Name'}</TableCell>
              <TableCell style={{ fontSize: '14px', color: 'black' }}>{row.last_name || 'Add Last Name'}</TableCell>
              <TableCell style={{ fontSize: '14px', color: 'black' }}>{row.phone_number || 'Add Phone Number'}</TableCell>
              <TableCell style={{ fontSize: '14px', color: 'black' }}>{row.company || 'Add Compnay'}</TableCell>
              <TableCell style={{ fontSize: '14px', color: 'black' }}>{row.source || 'Add Source'}</TableCell>
              <TableCell style={{ fontSize: '14px', color: 'black' }}>{row.channel || 'Add Channel'}</TableCell>
              <TableCell align='right' style={{ fontSize: '14px', color: 'black' }}>
                  {editAssignToRowId === row.leads_id ? (
                    <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                      <InputLabel>Assign To</InputLabel>
                      <Select
                        value={selectedManager}
                        onChange={(event) => handleManagerChange(event, row)}
                        label="Assign To"
                      >
                        {teamManagers.map((manager) => (
                          <MenuItem key={manager.id} value={manager.email}>
                            {manager.first_name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <Chip label={row.user_assigned_to || 'No Team Manager Found'} />
                  )}
                </TableCell>              <TableCell style={{ fontSize: '14px', color: 'black' }}>
                {row.notes ? (
                  <Tooltip title={row.notes}>
                    <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Read notes</span>
                  </Tooltip>
                ) : (
                  'No notes'
                )}
              </TableCell>
              <TableCell align='right' style={{ fontSize: '14px', color: 'black' }}>
                {editLabelRowId === row.leads_id ? (
                  <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                    <InputLabel>Label</InputLabel>
                    <Select
                      value={selectedLabel || row.label}
                      onChange={(event) => handleLabelChange(event, row)}
                      label="Label"
                     
                    >
                      {labels.map((label) => (
                        <MenuItem key={label} value={label}>
                          {label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Chip
                    size='small'
                    label={row.label || 'NULL'}
                    style={{
                      backgroundColor: 'white',
                      color:
                        row.label === 'Important'
                          ? '#FD5454'
                          : row.label === 'In transit'
                          ? '#4379EE'
                          : row.label === 'On Hold'
                          ? '#6226EF'
                          : row.label === 'Potential'
                          ? '#FCBE2D'
                          : row.label === 'Qualified'
                          ? '#00B69B'
                          : '',
                      height: 27,
                      borderColor:
                        row.label === 'Important'
                          ? '#FD5454'
                          : row.label === 'In transit'
                          ? '#4379EE'
                          : row.label === 'On Hold'
                          ? '#6226EF'
                          : row.label === 'Potential'
                          ? '#FCBE2D'
                          : row.label === 'Qualified'
                          ? '#00B69B'
                          : '',
                      border: '1px solid',
                      width: 93,
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      borderRadius: '10px'
                    }}
                  />
                )}
              </TableCell>
              <TableCell align='right' style={{ fontSize: '14px', color: 'black' }}>
                {editStageRowId === row.leads_id ? (
                  <FormControl variant="outlined" size="small" style={{ minWidth: 120 }}>
                    <InputLabel>Stage</InputLabel>
                    <Select
                      value={selectedStage || row.stage}
                      onChange={(event) => handleStageChange(event, row)}
                      label="Stage"
                    >
                      {stages.map((stage) => (
                        <MenuItem key={stage} value={stage}>
                          {stage}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Chip
                    size='small'
                    label={row.stage || 'NULL'}
                    style={{
                      backgroundColor:
                      
                        row.stage === 'Converted'
                          ? '#00B69B'
                          : row.stage === 'Initial Contact'
                          ? '#6226EF'
                          : row.stage === 'Lost Lead'
                          ? '#FD5454'
                          : row.stage === 'Not Qualified'
                          ? '#606060'
                          : row.stage === 'Intake'
                          ? '#FCBE2D'
                          : row.stage === 'Qualified'
                          ? '#4379EE'
                          : '',
                      color: '#FFFFFF',
                      height: 27,
                      width: 122,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      borderRadius: '10px'
                    }}
                  />
                )}
              </TableCell>
              <TableCell align='right' style={{ fontSize: '14px' }}>
                <MoreVertIcon onClick={(event) => handleClick(event, row.leads_id)} />
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  sx={{
                    '& .MuiPaper-root': {
                      backgroundColor: 'white', // Set background color
                      boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', // Custom shadow
                    },
                    '& .MuiMenuItem-root': {
                      color: '#333', // Custom color
                      fontSize: '14px', // Custom font size
                      padding: '10px 20px', // Custom padding
                      '&:hover': {
                        backgroundColor: '#f5f5f5', // Custom hover background
                      },
                    },
                    '& .MuiDivider-root': {
                      borderWidth: '1px',
                      borderColor: '#979797',
                    },
                  }}
                  
                  
                  >
                  <MenuItem onClick={() => handleEdit(selectedRowId)}>Edit</MenuItem>
                  <Divider sx={{ borderWidth: '1px', borderColor: '#979797' }} />
                  <MenuItem onClick={() => handleStageEdit(selectedRowId)}>Change stage</MenuItem>
                  <Divider sx={{ borderWidth: '1px', borderColor: '#979797' }} />
                  <MenuItem onClick={() => handleLabelEdit(selectedRowId)}>Change label</MenuItem>
                  <Divider sx={{ borderWidth: '1px', borderColor: '#979797' }} />
                  <MenuItem onClick={() => handleAssignToEdit(selectedRowId)}>Assign to</MenuItem>
                  {/*  <Divider />
                   <MenuItem onClick={handleClose}>View Lead</MenuItem> */}
                </Menu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackMessage}
        severity={snackSeverity}
      />
      {loading && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CircularProgress />
        </div>
      )}
    </ThemeProvider>
  );
};

export default TableLeads;
