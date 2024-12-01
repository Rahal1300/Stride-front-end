import React, { forwardRef, useState,useEffect  } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import TextField from '@mui/material/TextField';
import CheckIcon from '@mui/icons-material/Check';
import GetAppIcon from '@mui/icons-material/GetApp';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { loginSuccess } from '../../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {TablePagination} from '@mui/material';
import DeleteButton from './Actionrevision'

import DeleteIcon from '@mui/icons-material/Delete';
function createRevisisonData(taskId,parentTaskName, description, parentTaskWeight, parentTaskFloor, parentTaskBasement, parentTaskStartDate, parentTaskDeadline, status, memberName, documents, subtasks) {
  return {
    taskId,
    parentTaskName,
    description,
    parentTaskWeight,
    parentTaskFloor,
    parentTaskBasement,
    parentTaskStartDate,
    parentTaskDeadline,
    status,
    memberName,
    documents,
    subtasks,
    percentage: 0,
  };
}

function createSubtaskData(taskId,name, description, weight, floor, basement, startDate, deadline, status, memberName, documents, subsubtasks) {
  return {
    taskId,
    name,
    description,
    weight,
    floor,
    basement,
    startDate,
    deadline,
    status,
    memberName,
    documents,
    subsubtasks,
  };
}

function createSubsubtaskData(taskId,name, description, weight, floor, basement, startDate, deadline, status, memberName, documents) {
  return {
    taskId,
    name,
    description,
    weight,
    floor,
    basement,
    startDate,
    deadline,
    status,
    memberName,
    documents,

  };
}
function StatusChip({ status }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Done':
        return {
          backgroundColor: 'rgba(0, 182, 155, 0.2)',
          color: '#00B69B',
        };
      case 'In progress':
        return {
          backgroundColor: 'rgba(98, 38, 239, 0.2)',
          color: '#6226EF',
        };
      case 'Rejected':
        return {
          backgroundColor: 'rgba(239, 56, 38, 0.2)',
          color: '#EF3826',
        };
        case 'pending':
          return {
            backgroundColor: 'rgba(239, 56, 38, 0.2)',
            color: '#EA3526',
          };
      default:
        return {};
    }
  };
  return (
    <Chip
      size="small"
      label={status}
      style={{
        ...getStatusStyle(status),
        height: 27,
        width: 93,
        fontSize: '0.75rem',
        fontWeight: 600,
        borderRadius: '4px',
        marginRight: '10px',
      }}
    />
  );
}
function Row(props) {
  const { row,documents,onUpdate,base,floor  } = props;
  const [open, setOpen] = React.useState(false);
  const [descOpen, setDescOpen] = React.useState(false);
  const [percentages, setPercentages] = useState({});


  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const truncate = (text, length) => text.length > length ? text.substring(0, length) + '...' : text;
  const userToken = useSelector(loginSuccess);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [openLevel3Rows, setOpenLevel3Rows] = useState([]);
  const toggleLevel3Collapse = (subtaskIndex) => {
    const currentIndex = openLevel3Rows.indexOf(subtaskIndex);
    const newOpenRows = [...openLevel3Rows];

    if (currentIndex === -1) {
      newOpenRows.push(subtaskIndex);
    } else {
      newOpenRows.splice(currentIndex, 1);
    }

    setOpenLevel3Rows(newOpenRows);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleFileUpload = (event) => {
    const file = event.target.documents[0];
    console.log('File uploaded:', file);
  };
  const handleFileDownload = (fileName) => {
    console.log('File downloaded:', fileName);
  };
  const handlePercentageChange = (event, taskId) => {
    const newPercentage = event.target.value;
    if (newPercentage >= 0 && newPercentage <= 100) {
      setPercentages((prevPercentages) => ({
        ...prevPercentages,
        [taskId]: newPercentage,
      }));
      setIsConfirmed((prevIsConfirmed) => ({
        ...prevIsConfirmed,
        [taskId]: false,
      }));
    }
  };

  const handlePercentageChangesubtask = (event, subtaskId) => {
    const newPercentage = event.target.value;
    if (newPercentage >= 0 && newPercentage <= 100) {
      setPercentages((prevPercentages) => ({
        ...prevPercentages,
        [subtaskId]: newPercentage,
      }));
      setIsConfirmed((prevIsConfirmed) => ({
        ...prevIsConfirmed,
        [subtaskId]: false,
      }));
    }
  };

  const handlePercentageChangesubsubtask = (event, subsubtaskId) => {
    const newPercentage = event.target.value;
    if (newPercentage >= 0 && newPercentage <= 100) {
      setPercentages((prevPercentages) => ({
        ...prevPercentages,
        [subsubtaskId]: newPercentage,
      }));
      setIsConfirmed((prevIsConfirmed) => ({
        ...prevIsConfirmed,
        [subsubtaskId]: false,
      }));
    }
  };

  const handleConfirmPercentage = async (taskId) => {
    const percentage = percentages[taskId];
    setIsConfirmed((prevIsConfirmed) => ({
      ...prevIsConfirmed,
      [taskId]: true,
    }));

    setIsConfirmed(true); // Set confirmation flag to true
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${taskId}/progress?progress=${percentage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken.payload.token}`,
        },

      });

      if (!response.ok) {
        setSnackbarOpen(true);

        setSnackbarSeverity('error');

        setSnackbarMessage('Error: Failed to update Task progress');
        throw new Error('Failed to update subtask progress');

      }
      const contentType = response.headers.get("content-type");
      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = {};

      }

      setSnackbarSeverity('success');

        setSnackbarMessage('Update successful!');
        setSnackbarOpen(true);
        setTimeout(() => {
          onUpdate();
        }, 2000);
    } catch (error) {
      console.error('Error updating subtask:', error.message);

    }

  };
  const handleConfirmPercentagesubtask = async (subtaskId) => {
    const percentage = percentages[subtaskId];
    setIsConfirmed((prevIsConfirmed) => ({
      ...prevIsConfirmed,
      [subtaskId]: true,
    }));

    setIsConfirmed(true); // Set confirmation flag to true
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/updateSubtaskProgress?subtaskId=${subtaskId}&newProgress=${percentage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken.payload.token}`,
        },

      });

      if (!response.ok) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Error: Failed to update SubTask progress');
        setSnackbarOpen(true);
        throw new Error('Failed to update subtask progress');

      }
      const contentType = response.headers.get("content-type");
      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = {};

      }

      setSnackbarSeverity('success');

        setSnackbarMessage('Update successful!');
        setSnackbarOpen(true);
        setTimeout(() => {
          onUpdate();
        }, 2000);

    } catch (error) {
      console.error('Error updating subtask:', error.message);

    }

  };
  const handleConfirmPercentagesubsubtask = async (subsubtaskId) => {
    const percentage = percentages[subsubtaskId];
  setIsConfirmed((prevIsConfirmed) => ({
    ...prevIsConfirmed,
    [subsubtaskId]: true,
  }));
    setIsConfirmed(true); // Set confirmation flag to true
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/updateSubtaskProgress?subtaskId=${subsubtaskId}&newProgress=${percentage}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken.payload.token}`,
        },

      });

      if (!response.ok) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Error: Failed to update SubTask progress');
        setSnackbarOpen(true);
        throw new Error('Failed to update subtask progress');

      }
      const contentType = response.headers.get("content-type");
      let responseData;
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        responseData = {};

      }

      setSnackbarSeverity('success');

        setSnackbarMessage('Update successful!');
        setSnackbarOpen(true);
        setTimeout(() => {
          onUpdate();
        }, 2000);
    } catch (error) {
      console.error('Error updating subtask:', error.message);

    }

  };
  const handleDownloadAll = () => {
    console.log('Percentage confirmed:');
  };

    const handleDocumentSelect = (e) => {
      setSelectedDocumentIds(e.target.value);
    };

    const uploadSelectedDocuments = async (taskId) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${taskId}/documents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken.payload.token}`,
          },
          body: JSON.stringify({
            documentIds: selectedDocumentIds,
          }),
        });


        if (!response.ok) {
          throw new Error('Failed to upload documents');
        }

        setSnackbarSeverity('success');
        setSnackbarMessage('Documents uploaded successfully');
        setSnackbarOpen(true);      } catch (error) {
          setSnackbarSeverity('error');
          setSnackbarMessage('Failed to upload documents');
          setSnackbarOpen(true);
        console.error('Error uploading documents:', error.message);
      }
    };
    const formatDate = (isoDate) => {
      if (!isoDate) return ''; // Handle case where date is null or undefined

      const date = new Date(isoDate);
      if (isNaN(date.getTime())) {
        console.error(`Invalid date format: ${isoDate}`);
        return ''; // Return an empty string or handle the error as needed
      }

      return date.toLocaleDateString(); // Adjust locale and options as needed
    };
  const renderPercentageInput = () => (
   <> {row.progress !== 100 ? (
      <div style={{ display: 'flex', alignItems: 'center' }}>

      <TextField
        id={`percentage-input-${row.title}`}
        type="number"
        InputProps={{ inputProps: { min: 0, max: 100 } }}
        onChange={(event) => handlePercentageChange(event, row.id)}
        size="small"
        style={{ width: 80, marginRight: 10 }}

        placeholder={row.progress}

      />
        <Tooltip title="Confirm">
          <IconButton
            aria-label="confirm percentage"
            size="small"
            onClick={() => handleConfirmPercentage(row.id)}
            >
            <CheckIcon style={{ color: 'green' }} />
          </IconButton>
        </Tooltip>

      </div>):(
      <div >
        {row.progress}</div>
      )}</>
  );
  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>

        <TableCell>
        {row.subRevisions.length > 0 && (

          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>)}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.title}
        </TableCell>
        <TableCell  >
          <Tooltip title={row.description ? row.description : 'No Description'}>
            <Typography
              variant="body2"
              onClick={() => setDescOpen(!descOpen)}
              style={{ cursor: row.description ? 'pointer' : 'default' }}
            >
              {row.description ? truncate(row.description, 20) : 'No Description'}
            </Typography>
          </Tooltip>
        </TableCell>
        <TableCell  >{row.weight  ?   row.weight.toFixed(2):'No weight'}</TableCell>
        <TableCell  >{row.floor ?  row.floor :'No Floor'}</TableCell>
        <TableCell  >{row.basement  ?  row.basement :'No Basement'}</TableCell>
        <TableCell   sx={{ fontSize: '12px' }}>
                {formatDate(row.startdate) ? formatDate(row.startdate) :'No Start Date'}
              </TableCell>
              <TableCell   sx={{ fontSize: '12px' }}>
                {formatDate(row.deadline) ?  formatDate(row.deadline) :'No Dead Line'}
              </TableCell>

        <TableCell  >{row.assigneduser ?  row.assigneduser :'No memeber assigne'}</TableCell>
        {/*THIS IS THE START OF DOCUMENTS SECTION*/}
  {/*      <TableCell  >
  {row.documents && row.documents.length > 0 ? (
    <React.Fragment>
      {row.documents.map((file, index) => (
        <Tooltip title="Download File" key={index}>
          <IconButton
            onClick={() => handleFileDownload(file.fileName)}
            aria-label={`download file ${file.fileName}`}
            size="small"
          >
            <CloudDownloadIcon />
          </IconButton>
        </Tooltip>
      ))}
      <input
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
        id={`file-upload-${row.title}`}
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor={`file-upload-${row.title}`}>
        <Tooltip title="Upload File">
          <IconButton
            aria-label={`upload file for ${row.title}`}
            size="small"
            component="span"
          >
            <CloudUploadIcon />
          </IconButton>
        </Tooltip>
      </label>
    </React.Fragment>
  ) : (
    <React.Fragment>
      No Documents
      <input
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
        id={`file-upload-${row.title}`}
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor={`file-upload-${row.title}`}>
        <Tooltip title="Upload File">
          <IconButton
            aria-label={`upload file for ${row.title}`}
            size="small"
            component="span"
          >
            <CloudUploadIcon />
          </IconButton>
        </Tooltip>
      </label>
    </React.Fragment>
  )}
</TableCell>*/}
{/*THIS IS THE END OF DOCUMENTS SECTION*/}

<TableCell  >
          {renderPercentageInput()}
        </TableCell>
  {/*      <TableCell  >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <TextField
          select
          label="Documents"
          name="documents"
          margin="normal"
          onChange={(e) => handleDocumentSelect(e)}
          SelectProps={{
            multiple: true,
            value: selectedDocumentIds,
          }}
          size="small"
          sx={{ marginRight: '10px', width: '150px' }}
        >
          {documents.map((document) => (
            <MenuItem key={document.id} value={document.id}>
              {document.documentName}               {document.id}

            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          size="small"
          onClick={() => uploadSelectedDocuments(row.id)} // Assuming `row.taskId` is accessible
        >
          Upload
        </Button>
      </Box>
</TableCell>
*/}
<TableCell  >
          <StatusChip status={row.status} />
        </TableCell>
        <TableCell  >
        <DeleteButton taskId={row.id} onUpdate={onUpdate} row={row } base={base}floor={floor}/>        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11} >

          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">



              </Typography>
              <Table size="small" aria-label="subtasks" sx={{marginLeft:'100px'}}>

                <TableHead>
                  <TableRow>

                    <TableCell sx={{ fontWeight: '600' }} >Name</TableCell>
                    <TableCell   sx={{ fontWeight: '600' }}>Description</TableCell>
                    <TableCell  sx={{ fontWeight: '600' }}>Weight</TableCell>
                    <TableCell   sx={{ fontWeight: '600' }}>Floor</TableCell>
                    <TableCell   sx={{ fontWeight: '600' }}>Basement</TableCell>
                    <TableCell   sx={{ fontWeight: '600' }}>Start Date</TableCell>
                    <TableCell   sx={{ fontWeight: '600' }}>Deadline</TableCell>
                    <TableCell   sx={{ fontWeight: '600' }}>Member Name</TableCell>
                   {/* <TableCell   sx={{ fontWeight: '600' }}>Upload/Download Files</TableCell>*/}
                    <TableCell   sx={{ fontWeight: '600' }}>Percentage</TableCell>
                   {/* <TableCell   sx={{ fontWeight: '600' }}>documents</TableCell>*/}
                    <TableCell   sx={{ fontWeight: '600' }}>Status</TableCell>
                    <TableCell   sx={{ fontWeight: '600' }}>Action</TableCell>


                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.subRevisions.map((subtask,subIndex) => (
                    <React.Fragment key={subtask.title}>

                      <TableRow>

                        <TableCell component="th" scope="row">
                          {subtask.title}
                        </TableCell>
                        <TableCell  >
                          <Tooltip title={subtask.description ? subtask.description : 'No Description'}>
                            <Typography
                              variant="body2"
                              onClick={() => setDescOpen(!descOpen)}
                              style={{ cursor: subtask.description ? 'pointer' : 'default' }}
                            >
                              {subtask.description ? truncate(subtask.description, 20) : 'No Description'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell  >{subtask.weight ? subtask.weight.toFixed(2) :'No weight'}</TableCell>
                        <TableCell  >{subtask.floor ? subtask.floor :'No Floor'}</TableCell>
                        <TableCell  >{subtask.basement ? subtask.basement :'No Basement'}</TableCell>
                        <TableCell   sx={{ fontSize: '12px' }}>
                {formatDate(subtask.startdate) ?  formatDate(subtask.startdate) :'No Start Date'}

              </TableCell>
              <TableCell   sx={{ fontSize: '12px' }}>
                {formatDate(subtask.deadline) ?  formatDate(subtask.deadline) :'No Dead Line'}

              </TableCell>

                        <TableCell  >{subtask.assigneduser ?  subtask.assigneduser :'No member assigned'}</TableCell>
                     {/*   <TableCell  >
                                    {subtask.documents.length > 0 ? (
                                      <React.Fragment>
                                        {subtask.documents.map((file, index) => (
                                          <Tooltip title="Download File" key={index}>
                                            <IconButton
                                              onClick={() => handleFileDownload(file.fileName)}
                                              aria-label={`download file ${file.fileName}`}
                                              size="small"
                                            >
                                              <CloudDownloadIcon />
                                            </IconButton>
                                          </Tooltip>
                                        ))}
                                        <input
                                          accept=".pdf,.doc,.docx"
                                          style={{ display: 'none' }}
                                          id={`file-upload-${subtask.name}`}
                                          type="file"
                                          onChange={handleFileUpload}
                                        />
                                        <label htmlFor={`file-upload-${subtask.name}`}>
                                          <Tooltip title="Upload File">
                                            <IconButton
                                              aria-label={`upload file for ${subtask.name}`}
                                              size="small"
                                              component="span"
                                            >
                                              <CloudUploadIcon />
                                            </IconButton>
                                          </Tooltip>
                                        </label>
                                      </React.Fragment>
                                    ) : (
                                      <React.Fragment>
                                        <input
                                          accept=".pdf,.doc,.docx"
                                          style={{ display: 'none' }}
                                          id={`file-upload-${subtask.name}`}
                                          type="file"
                                          onChange={handleFileUpload}
                                        />
                                        <label htmlFor={`file-upload-${subtask.name}`}>
                                          <Tooltip title="Upload File">
                                            <IconButton
                                              aria-label={`upload file for ${subtask.name}`}
                                              size="small"
                                              component="span"
                                            >
                                              <CloudUploadIcon />
                                            </IconButton>
                                          </Tooltip>
                                        </label>
                                      </React.Fragment>
                                    )}
                                  </TableCell> */}
                                  <TableCell  >
                                  {subtask.progress !== 100 ? (
                                  <div style={{ display: 'flex', alignItems: 'center' }}>

                                  <TextField
        type="number"
        InputProps={{ inputProps: { min: 0, max: 100 } }}
        onChange={(event) => handlePercentageChangesubtask(event,subtask.id)}
        size="small"
        style={{ width: 80, marginRight: 10 }}
        placeholder={subtask.progress}

      />
                      <Tooltip title="Confirm">
                        <IconButton

                          aria-label="confirm percentage"
                          size="small"
                          onClick={() => handleConfirmPercentagesubtask(subtask.id)}
                        >
                          <CheckIcon style={{ color: 'green' }} />
                        </IconButton>
                      </Tooltip>
                      </div>):(<>{subtask.progress}</>)}
                    </TableCell>
               {/*  <TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <TextField
        select
        label="Documents"
        name="documents"
        margin="normal"
        onChange={(e) => handleDocumentSelect(e)}
        SelectProps={{
          multiple: true,
          value: selectedDocumentIds,
        }}
        size="small"
        sx={{ marginRight: '10px', width: '150px' }}
      >
        {documents?.map((document, index) => (
          <MenuItem key={index} value={document.id}>
            {document.documentName}
          </MenuItem>
        ))}
      </TextField>

        <Button
          variant="contained"
          size="small"

        >
          ✔️
        </Button>

    </Box></TableCell>*/}
    <TableCell  >
                          <StatusChip status={subtask.status} />
                        </TableCell>
                        <TableCell  >
                        <DeleteButton taskId={row.id} onUpdate={onUpdate} row={subtask } base={base}floor={floor}/>        </TableCell>
                      </TableRow>
                      <TableRow onClick={() => toggleLevel3Collapse(subtask.id)}>

                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>

                        { subtask.subRevisions &&  subtask.subRevisions.length > 0 && (
                         <TableRow >
                              <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => toggleLevel3Collapse(subtask.id)}
          >
          {openLevel3Rows.includes(subtask.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

                         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
                           <Collapse in={openLevel3Rows.includes(subtask.id)} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>

                              <Table size="small" aria-label="subsubtasks"  sx={{marginLeft:'100px'}}>
                                <TableHead>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: '600' }}>Name</TableCell>
                                    <TableCell   sx={{ fontWeight: '600' }}>Description</TableCell>
                                    <TableCell   sx={{ fontWeight: '600' }}>Weight</TableCell>
                                    <TableCell   sx={{ fontWeight: '600' }}>Floor</TableCell>
                                    <TableCell   sx={{ fontWeight: '600' }}>Basement</TableCell>
                                    <TableCell   sx={{ fontWeight: '600' }}>Start Date</TableCell>
                                    <TableCell   sx={{ fontWeight: '600' }}>Deadline</TableCell>
                                    <TableCell   sx={{ fontWeight: '600' }}>Member Name</TableCell>
                                    {/*<TableCell   sx={{ fontWeight: '600' }}>Upload/Download Files</TableCell>*/}
                                    <TableCell   sx={{ fontWeight: '600' }}>Percentage</TableCell>
                                    {/*<TableCell   sx={{ fontWeight: '600' }}>documents</TableCell>*/}
                                    <TableCell   sx={{ fontWeight: '600' }}>Status</TableCell>
                                    <TableCell   sx={{ fontWeight: '600' }}>Action</TableCell>

                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  { subtask.subRevisions && subtask.subRevisions.map((subsubtask) => (
                                    <TableRow key={subsubtask.title}>
                                      <TableCell component="th" scope="row">
                                        {subsubtask.title}
                                      </TableCell>
                                      <TableCell  >
                                        <Tooltip title={subsubtask.description ? subsubtask.description : 'No Description'}>
                                          <Typography
                                            variant="body2"
                                            onClick={() => setDescOpen(!descOpen)}
                                            style={{ cursor: subsubtask.description ? 'pointer' : 'default' }}
                                          >
                                            {subsubtask.description ? truncate(subsubtask.description, 20) : 'No Description'}
                                          </Typography>
                                        </Tooltip>
                                      </TableCell>
                                      <TableCell  > {subsubtask.weight  ?  subsubtask.weight.toFixed(2) :'No weight'}</TableCell>
                                      <TableCell  > {subsubtask.floor  ?  subsubtask.floor :'No floor'}</TableCell>
                                      <TableCell  >{subsubtask.basement  ?  subsubtask.basement :'No basement'}</TableCell>
                                      <TableCell  >
                                         {formatDate(subsubtask.startdate) ?  formatDate(subsubtask.startdate) :'No Start Date'}
                                        </TableCell>
                                      <TableCell  >
                                       {formatDate(subsubtask.deadline) ?  formatDate(subsubtask.deadline) :'No Dead line'}

                                      </TableCell>

                                      <TableCell  >{subsubtask.memberName  ?  subsubtask.memberName :'No memberName'}</TableCell>
                       {/*               <TableCell  >
  {subsubtask.documents && subsubtask.documents.length > 0 ? (
    <React.Fragment>
      {subsubtask.documents.length > 3 ? (
        <Tooltip title="Download All Files">
          <IconButton
            onClick={handleDownloadAll}
            aria-label="download all files"
            size="small"
          >
            <GetAppIcon />
          </IconButton>
        </Tooltip>
      ) : (
        subsubtask.documents.map((file, index) => (
          <Tooltip title={`Download ${file.fileName}`} key={index}>
            <IconButton
              onClick={() => handleFileDownload(file.fileName)}
              aria-label={`download file ${file.fileName}`}
              size="small"
            >
              <CloudDownloadIcon />
            </IconButton>
          </Tooltip>
        ))
      )}
      <input
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
        id={`file-upload-${subsubtask.name}`}
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor={`file-upload-${subsubtask.name}`}>
        <Tooltip title="Upload File">
          <IconButton
            aria-label={`upload file for ${subsubtask.name}`}
            size="small"
            component="span"
          >
            <CloudUploadIcon />
          </IconButton>
        </Tooltip>
      </label>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <input
        accept=".pdf,.doc,.docx"
        style={{ display: 'none' }}
        id={`file-upload-${subsubtask.name}`}
        type="file"
        onChange={handleFileUpload}
      />
      <label htmlFor={`file-upload-${subsubtask.name}`}>
        <Tooltip title="Upload File">
          <IconButton
            aria-label={`upload file for ${subsubtask.name}`}
            size="small"
            component="span"
          >
            <CloudUploadIcon />
          </IconButton>
        </Tooltip>
      </label>
    </React.Fragment>
  )}
</TableCell>*/}


<TableCell  >
<div style={{ display: 'flex', alignItems: 'center' }}>

<TextField
        id={`percentage-input-${row.title}`}
        type="number"
        InputProps={{ inputProps: { min: 0, max: 100 } }}
        onChange={(event) => handlePercentageChangesubsubtask(event,subsubtask.id)}
        size="small"
        style={{ width: 80, marginRight: 10 }}
        placeholder={subsubtask.progress}

      />
                      <Tooltip title="Confirm">
                        <IconButton
                          aria-label="confirm percentage"
                          size="small"
                          onClick={() => handleConfirmPercentagesubsubtask(subsubtask.id)}
                        >
                          <CheckIcon style={{ color: 'green' }} />
                        </IconButton>
                      </Tooltip>
                      </div>
                    </TableCell>
                    {/*<TableCell>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <TextField
        select
        label="Documents"
        name="documents"
        margin="normal"
        onChange={(e) => handleDocumentSelect(e)}
        SelectProps={{
          multiple: true,
          value: selectedDocumentIds,
        }}
        size="small"
        sx={{ marginRight: '10px', width: '150px' }}
      >
        {documents?.map((document, index) => (
          <MenuItem key={index} value={document.id}>
            {document.documentName}
          </MenuItem>
        ))}
      </TextField>

        <Button
          variant="contained"
          size="small"

        >
          ✔️
        </Button>

    </Box></TableCell>  */}
    <TableCell  >
                                        <StatusChip status={subsubtask.status} />

                                      </TableCell>
                                      <TableCell  >
        <DeleteButton taskId={row.id} onUpdate={onUpdate} row={subsubtask } base={base}floor={floor}/>        </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                            </Collapse>
    </TableCell>
  </TableRow>)}
                        </TableCell>

                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity} // This sets the severity for the MuiAlert, not Snackbar
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    parentTaskWeight: PropTypes.number,
    parentTaskFloor: PropTypes.string,
    parentTaskBasement: PropTypes.string,
    parentTaskStartDate: PropTypes.string,
    parentTaskDeadline: PropTypes.string,
    memberName: PropTypes.string,
    documents: PropTypes.arrayOf(
      PropTypes.shape({
        fileName: PropTypes.string,
        fileLink: PropTypes.string,
      })
    ).isRequired,
    status: PropTypes.string,

    subtasks: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string,
        description: PropTypes.string,
        weight: PropTypes.number,
        floor: PropTypes.string,
        basement: PropTypes.string,
        startDate: PropTypes.string,
        deadline: PropTypes.string,
        assigneduser: PropTypes.string,
        progress: PropTypes.string,

        documents: PropTypes.arrayOf(
          PropTypes.shape({
            fileName: PropTypes.string,
            fileLink: PropTypes.string,
          })
        ).isRequired,
        status: PropTypes.string,

        subsubtasks: PropTypes.arrayOf(
          PropTypes.shape({
            taskId: PropTypes.string.isRequired,
            name: PropTypes.string,
            description: PropTypes,
            weight: PropTypes.number,
            floor: PropTypes.string,
            basement: PropTypes.string,
            startDate: PropTypes.string,
            deadline: PropTypes.string,
            status: PropTypes.string,
            memberName: PropTypes.string,
            progress: PropTypes.string,

            documents: PropTypes.arrayOf(
              PropTypes.shape({
                fileName: PropTypes.string,
                fileLink: PropTypes.string,
              })
            ),
          })
        ),
      })
    ),
  }),
};



 function RevisionTable({documents,id,onUpdate,base,floor  }) {
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const userToken = useSelector(loginSuccess);
  useEffect(() => {
    fetchTasks();
  }, [currentPage]);

  const fetchTasks = async () => {
    setLoadingFetch(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/revisions/project/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken.payload.token}`,
        },
      });
      const data = await response.json();
      console.log("tasks: ",data);
      const newTotalItems = data.length;
      setTotalItems(newTotalItems);
      const newTotalPages = Math.ceil(newTotalItems / pageSize);
      setTotalPages(newTotalPages);
      const startIndex = currentPage * pageSize;
      const endIndex = Math.min(startIndex + pageSize, newTotalItems);
      const slicedData = data.slice(startIndex, endIndex);
      setRows(slicedData);
      setLoadingFetch(false);
    } catch (error) {
      setLoadingFetch(false);
      console.error('Error fetching tasks:', error);
    }
  };
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setCurrentPage(0);
  };
  return (
    <>

    <TableContainer component={Paper}>
      <Table aria-label="collapsible table" >
        <TableHead>
        <TableRow >
        <TableCell />
            <TableCell sx={{ fontWeight: '600' }}>Task Name</TableCell>
            <TableCell   sx={{ fontWeight: '600' }}>Description</TableCell>
            <TableCell   sx={{ fontWeight: '600' }}>Weight</TableCell>
            <TableCell   sx={{ fontWeight: '600' }}>Floor</TableCell>
            <TableCell   sx={{ fontWeight: '600' }}>Basement</TableCell>
            <TableCell   sx={{ fontWeight: '600' }}>Start Date</TableCell>
           <TableCell   sx={{ fontWeight: '600' }}>Deadline</TableCell>
            <TableCell   sx={{ fontWeight: '600' }}>Member Name</TableCell>
          {/*}  <TableCell   sx={{ fontWeight: '600' }}>Upload/Download Files</TableCell>*/}
            <TableCell   sx={{ fontWeight: '600' }}>Percentage</TableCell>
            {/*<TableCell align="center" sx={{ fontWeight: '600' }}>documents</TableCell>*/}
            <TableCell   sx={{ fontWeight: '600' }}>Status</TableCell>
            <TableCell   sx={{ fontWeight: '600' }}>Action</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.id} row={row} documents={documents} onUpdate ={onUpdate} base={base} floor={floor} />
          ))}
        </TableBody>
      </Table>

    </TableContainer>
    <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        count={totalItems} // Use totalItems for accurate pagination count
        rowsPerPage={pageSize}
        page={currentPage}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
</>
  );
}
export default RevisionTable;
