import React, { forwardRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import DatePicker from 'react-datepicker';

const CustomInput = forwardRef((props, ref) => {
  return <TextField {...props} inputRef={ref} autoComplete='off' />;
});
CustomInput.displayName = 'CustomInput';

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

const taskLevels = {
  level1: {
    '1': 'Analyse des Données D entrées',
    '2': 'Realisation du lot CVC',
    '3': 'Realisation du lot PLB',
    '4': 'Realisation du lot CVPB',
    '5': 'Locaux Techniques',
  },
  level2: {
    '1': {
      '1.1': 'Analyse du dossier CVC',
      '1.2': 'Analyse du dossier PLB',
    },
    '2': {
      '2.1': 'Realisation du sous-lot Aeraulique',
      '2.2': 'Realisation du sous-lot Hydraulique',
    },
    '3': {
      '3.1': 'Realisation du sous-lot Evacuation',
      '3.2': 'Realisation du sous-lot Alimentation',
    },
    '4': {
      '4.1': 'Realisation du lot Reservations',
      '4.2': 'Realisation des Attentes Electriques',
      '4.3': 'Realisation des Renfort sanitaires',
    },
    '5': {
      '5.1': 'Chaufferie',
      '5.2': 'LOCAL CTA',
      '5.3': 'SOUS STATION',
    },
  },
  level3: {
    '1.1': {
      '1.1.1': 'Analyse des Reseaux Aerauliques',
      '1.1.2': 'Analyse des Reseaux Hydrauliques',
      '1.1.3': 'Lecture du CCTP CVC',
    },
    '1.2': {
      '1.2.1': 'Analyse des Reseaux d evacuation y compris Reseaux EP',
      '1.2.2': 'Analyse des Reseaux d alimentations',
      '1.2.3': 'Lecture du CCTP PLB',
    },
    // Add remaining sub-levels for other level2 options similarly
  },
};

function TaskForm({ onClose }) {
  const [taskDetails, setTaskDetails] = useState({
    assignMembers: '',
    level1: '',
    level2: '',
    level3: '',
    floor: '',
    deadline: '',
  });
  const [level2Options, setLevel2Options] = useState([]);
  const [level3Options, setLevel3Options] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    if (name === 'level1') {
      setLevel2Options(taskLevels.level2[value] || []);
      setTaskDetails((prevDetails) => ({ ...prevDetails, level2: '', level3: '' }));
      setLevel3Options([]);
    }

    if (name === 'level2') {
      setLevel3Options(taskLevels.level3[value] || []);
      setTaskDetails((prevDetails) => ({ ...prevDetails, level3: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    onClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          width: 850,
          maxWidth: '90%',
          borderRadius: 4,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" id="create-task-modal-title">
            Create Task
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <TextField
                select
                fullWidth
                label="Assign Member(s)"
                name="assignMembers"
                value={taskDetails.assignMembers}
                onChange={handleChange}
                margin="normal"
                required
              >
                <MenuItem value="member1">Member 1</MenuItem>
                <MenuItem value="member2">Member 2</MenuItem>
                <MenuItem value="member3">Member 3</MenuItem>
              </TextField>
              <TextField
                select
                fullWidth
                label="Level 1"
                name="level1"
                value={taskDetails.level1}
                onChange={handleChange}
                margin="normal"
                required
              >
                {Object.keys(taskLevels.level1).map((key) => (
                  <MenuItem key={key} value={key}>
                    {taskLevels.level1[key]}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <TextField
                select
                fullWidth
                label="Level 2"
                name="level2"
                value={taskDetails.level2}
                onChange={handleChange}
                margin="normal"
                required
                disabled={!taskDetails.level1}
              >
                {Object.keys(level2Options).map((key) => (
                  <MenuItem key={key} value={key}>
                    {level2Options[key]}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                label="Level 3"
                name="level3"
                value={taskDetails.level3}
                onChange={handleChange}
                margin="normal"
                disabled={!taskDetails.level2}
              >
                {Object.keys(level3Options).map((key) => (
                  <MenuItem key={key} value={key}>
                    {level3Options[key]}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <TextField
                label="Floor (if applicable)"
                name="floor"
                value={taskDetails.floor}
                onChange={handleChange}
                margin="normal"
                sx={{ width: 'calc(50% - 8px)' }} 
              />
              <DatePickerWrapper sx={{ marginTop: '16px' }}> 
                <DatePicker
                  showYearDropdown
                  showMonthDropdown
                  placeholderText="MM-DD-YYYY"
                  className="custom-datepicker-input"
                  customInput={<CustomInput />} 
                  selected={taskDetails.deadline}
                  onChange={(date) => setTaskDetails((prevDetails) => ({ ...prevDetails, deadline: date }))}
                />
              </DatePickerWrapper>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button type="submit" variant="contained" color="primary">
              Create
            </Button>
          </Box>
        </form>
      </Box>
    </ThemeProvider>
  );
}

export default TaskForm;
