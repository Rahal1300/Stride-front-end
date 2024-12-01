import React, { useState } from 'react';
import { IconButton,Icon,Fingerprint, Snackbar, Alert, Box, Modal, TextField, Button, Accordion, AccordionSummary, AccordionDetails, Typography, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddToPhotosIcon from '@mui/icons-material/AddToPhotos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';

// Assuming this action creator is correctly imported
import { loginSuccess } from '../../../../features/reducers/authReducer';

const DeleteButton = ({ taskId, onUpdate, row, base, floor }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({ ...row });
  const userToken = useSelector(loginSuccess); // Adjust based on your Redux setup

  const handleClick = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      handleDelete(taskId);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken.payload.token}`,
        },
      });

      if (!response.ok) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Error: Failed to delete task');
        setSnackbarOpen(true);
        throw new Error('Failed to delete task');
      }

      setSnackbarSeverity('success');
      setSnackbarMessage('Task deleted successfully!');
      setSnackbarOpen(true);

      onUpdate();
    } catch (error) {
      console.error('Error deleting task:', error.message);
    }
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
  };

  const formData = new FormData();
  formData.append('taskId', taskId);

  const handleRevisionClick = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/revisions/create`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken.payload.token}`,
        },
         body: formData,
      });

      if (!response.ok) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Error: Failed to create a revision');
        setSnackbarOpen(true);
        throw new Error('Failed to create revision');
      }

      setSnackbarSeverity('success');
      setSnackbarMessage('Revision created successfully!');
      setSnackbarOpen(true);

    } catch (error) {
      console.error('Error creating Revision:', error.message);
    }
  };


  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleSubtaskChange = (index, field, value, level = 'subtasks') => {
    const updatedSubtasks = [...editData[level]];
    updatedSubtasks[index][field] = value;
    setEditData({ ...editData, [level]: updatedSubtasks });
  };

  const renderSubtasks = (subtasks, level = 'subtasks', parentIndex = '') => {
    return subtasks.map((subtask, index) => {
      const subtaskIndex = parentIndex !== '' ? `${parentIndex}.${index + 1}` : `${index + 1}`;
      return (
        <Accordion key={subtask.id} sx={{ marginBottom: 1 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>1.{subtaskIndex} : {subtask.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              label="Title"
              value={subtask.title}
              onChange={(e) => handleSubtaskChange(index, 'title', e.target.value, level)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description"
              value={subtask.description}
              onChange={(e) => handleSubtaskChange(index, 'description', e.target.value, level)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Weight"
              value={subtask.weight}
              onChange={(e) => handleSubtaskChange(index, 'weight', e.target.value, level)}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="floor-dropdown">Floor</InputLabel>
              <Select
                SelectProps={{ multiple: true }}
                value={subtask.floor || []}  // Ensure it's an array
                onChange={(e) => handleSubtaskChange(index, 'floor', e.target.value, level)}
                label="Floor"
                fullWidth
                margin="normal"
              >
                {Array.from({ length: floor }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    Floor {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="basement-dropdown">Basement</InputLabel>
              <Select
                SelectProps={{ multiple: true }}
                value={subtask.basement || []}  // Ensure it's an array
                onChange={(e) => handleSubtaskChange(index, 'basement', e.target.value, level)}
                label="Basement"
                fullWidth
                margin="normal"
              >
                {Array.from({ length: base }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    Basement {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel htmlFor="status-dropdown">Status</InputLabel>
              <Select
                value={subtask.status}
                onChange={(e) => handleSubtaskChange(index, 'status', e.target.value, level)}
                label="Status"
                fullWidth
                margin="normal"
              >
                <MenuItem value="In progress">In progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                {/* Add more options as needed */}
              </Select>
            </FormControl>
            <DatePickerWrapper sx={{ marginTop: 2 }}>
              <DatePicker
                selected={subtask.startdate}
                onChange={(date) => handleSubtaskChange(index, 'startdate', date, level)}
                customInput={<CustomInput />}
                dateFormat="yyyy/MM/dd"
                fullWidth
                margin="normal"
              />
            </DatePickerWrapper>
            <DatePickerWrapper sx={{ marginTop: 2 }}>
              <DatePicker
                selected={subtask.deadline}
                onChange={(date) => handleSubtaskChange(index, 'deadline', date, level)}
                customInput={<CustomInput2 />}
                dateFormat="yyyy/MM/dd"
                fullWidth
                margin="normal"
              />
            </DatePickerWrapper>
            {subtask.subtasks && subtask.subtasks.length > 0 && (
              <Box mt={2}>
                {renderSubtasks(subtask.subtasks, `${level}.subtasks`, subtaskIndex)}
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
      );
    });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken.payload.token}`,
        },
        body: JSON.stringify({
          parentTaskName: editData.title,
          description: editData.description,
          parentTaskWeight: editData.weight,
          parentTaskStartDate: editData.startdate,
          parentTaskDeadline: editData.deadline,
          parentTaskFloor: editData.floor,
          parentTaskBasement: editData.basement,
          status: editData.status,
          progress: editData.progress,
        }),
      });

      if (!response.ok) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Error: Failed to update task');
        setSnackbarOpen(true);
        throw new Error('Failed to update task');
      }

      const updatedSubtask = await response.json();
      setSnackbarSeverity('success');
      setSnackbarMessage('Task updated successfully!');
      setSnackbarOpen(true);
      onUpdate(); // Refresh or update the list after successful update
      setEditModalOpen(false); // Close the modal
    } catch (error) {
      console.error('Error updating task:', error.message);
      setSnackbarSeverity('error');
      setSnackbarMessage('Error: Failed to update task');
      setSnackbarOpen(true);
    }
  };

  const handleClose = () => {
    setEditModalOpen(false);
  };

  return (
    <>
      <Box display="flex" alignItems="center">
        <IconButton color="primary" onClick={handleEditClick}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" onClick={handleClick}>
          <DeleteIcon />
        </IconButton>
      <IconButton>
      <AddToPhotosIcon onClick={handleRevisionClick}/>
      </IconButton>


      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Modal open={editModalOpen} onClose={handleClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">Edit Task</Typography>
          <TextField
            label="Title"
            value={editData.title}
            onChange={(e) => handleEditChange('title', e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={editData.description}
            onChange={(e) => handleEditChange('description', e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Weight"
            value={editData.weight}
            onChange={(e) => handleEditChange('weight', e.target.value)}
            fullWidth
            margin="normal"
          />
            <TextField
            label="Progress"
            value={editData.progress}
            onChange={(e) => handleEditChange('progress', e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="floor-dropdown">Floor</InputLabel>
            <Select
              SelectProps={{ multiple: true }}
              value={editData.floor || []}  // Ensure it's an array
              onChange={(e) => handleEditChange('floor', e.target.value)}
              label="Floor"
              fullWidth
              margin="normal"
            >
              {Array.from({ length: floor }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  Floor {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="basement-dropdown">Basement</InputLabel>
            <Select
              SelectProps={{ multiple: true }}
              value={editData.basement || []}  // Ensure it's an array
              onChange={(e) => handleEditChange('basement', e.target.value)}
              label="Basement"
              fullWidth
              margin="normal"
            >
              {Array.from({ length: base }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  Basement {i + 1}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel htmlFor="status-dropdown">Status</InputLabel>
            <Select
              value={editData.status}
              onChange={(e) => handleEditChange('status', e.target.value)}
              label="Status"
              fullWidth
              margin="normal"
            >
              <MenuItem value="In progress">In progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              {/* Add more options as needed */}
            </Select>
          </FormControl>
          <DatePickerWrapper sx={{ marginTop: 2 }}>
            <DatePicker
              selected={editData.startdate}
              onChange={(date) => handleEditChange('startdate', date)}
              customInput={<CustomInput />}
              dateFormat="yyyy/MM/dd"
              fullWidth
              margin="normal"
            />
          </DatePickerWrapper>
          <DatePickerWrapper sx={{ marginTop: 2 }}>
            <DatePicker
              selected={editData.deadline}
              onChange={(date) => handleEditChange('deadline', date)}
              customInput={<CustomInput2 />}
              dateFormat="yyyy/MM/dd"
              fullWidth
              margin="normal"
            />
          </DatePickerWrapper>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </Box>
      </Modal>
    </>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const CustomInput = ({ value, onClick }) => (
  <TextField
    onClick={onClick}
    value={value}
    placeholder="Start Date"
    fullWidth
    margin="normal"
  />
);

const CustomInput2 = ({ value, onClick }) => (
  <TextField
    onClick={onClick}
    value={value}
    placeholder="Deadline"
    fullWidth
    margin="normal"
  />
);

export default DeleteButton;
