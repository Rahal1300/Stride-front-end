import React, { forwardRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import MenuItem from '@mui/material/MenuItem';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
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

// Define the number of basements and floors
const numBasements = 5;
const numFloors = 7;

const taskData = {
  fluid: {
    level1: {
      '1': 'Analyse des Données D\'entrées',
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
        '2.2': 'Realisation du sous-lot Aeraulique',
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
        '1.2.1': 'Analyse des Reseaux d\'evacuation y compris Reseaux EP',
        '1.2.2': 'Analyse des Reseaux d\'alimentations',
        '1.2.3': 'Lecture du CCTP PLB',
      },
      '2.1': {
        '2.1.1': 'Bilan Aeraulique',
        '2.1.2': 'Plan des Terminaux par niveau (depond des niveaux)',
        '2.1.3': 'Note de Calcul Dimensionnement Aeraulique (tout niveaux/tout système)',
        '2.1.4': 'Plan Aeraulique par niveau (depond des niveaux)',
        '2.1.5': 'Note de Calcul Perte de Charge Aeraulique (tout niveaux/tout système)',
        '2.1.6': 'Synoptique Aeraulique',
      },
      '2.2': {
        '2.2.1': 'Selection Equipements',
        '2.2.2': 'Plan des Terminaux par niveau (depond des niveaux)',
        '2.2.3': 'Note de Calcul Dimensionnement Hydraulique (tout niveaux/tout système)',
        '2.2.4': 'Plan Hydraulique par niveau (depond des niveaux)',
        '2.2.5': 'Note de Calcul Perte de Charge Hydraulique (tout niveaux/tout système)',
        '2.2.6': 'Synoptique Hydraulique',
      },
      '3.1': {
        '3.1.1': 'Plan des Attentes au Sol',
        '3.1.2': 'Note de Calcul Dimensionnement Evacuation (tout niveaux/tout système)',
        '3.1.3': 'Note de Calcul Dimensionnement Eau pluviale (tout niveaux/tout système)',
        '3.1.4': 'Plan Evacuation y compris EP par niveau (depond des niveaux)',
        '3.1.5': 'Synoptique Evacuation',
        '3.1.6': 'Synoptique Eau pluviale',
      },
      '3.2': {
        '3.2.1': 'Note de Calcul Dimensionnement EFS (tout niveaux/tout système)',
        '3.2.2': 'Note de Calcul Dimensionnement ECS (tout niveaux/tout système)',
        '3.2.3': 'Note de Calcul Dimensionnement BECS (tout niveaux/tout système)',
        '3.2.4': 'Plan Alimentation par niveau (depond des niveaux)',
        '3.2.5': 'Synoptique Alimentation',
      },
      '4.1': {
        '4.1.1': 'Plan Reservations Plancher Haut par niveau (depond des niveaux)',
      },
      '4.2': {
        '4.2.1': 'Plan des Attentes Electriques par niveau (depond des niveaux)',
      },
      '4.3': {
        '4.3.1': 'Plan des Renfort sanitaires par niveau (depond des niveaux)',
      },
      '5.1': {
        '5.1.1': 'Schema de Principe',
        '5.1.2': 'Maqquetage Chaufferie',
      },
      '5.2': {
        '5.2.1': 'Schema de Principe',
        '5.2.2': 'Maqquetage Chaufferie',
      },
      '5.3': {
        '5.3.1': 'Schema de Principe',
        '5.3.2': 'Maqquetage Chaufferie',
      },
    },
  },
  mep: {
    level1: {
      '1': 'mep 1',
      '2': 'mep 2',
      '3': 'mep 3',
    },
    level2: {
      '2': {
        '2.1': 'mep 2',
        '2.2': 'mep mep',
      },
    },
    level3: {
      '5.1': {
        '5.1.1': 'mep mep',
        '5.1.2': 'mep mep',
      },
      '5.2': {
        '5.2.1': 'mep dmep mep',
        '5.2.2': 'mep mep',
      },
    },
  },
  electric: {
    level1: {
      '1': 'Analyse des Données D\'entrées',
      '2': 'LOT CFA/CFO/SSI',
      '3': 'LOT CFO',
      '4': 'LOT CFA',
      '5': 'LOT SSI',
      '6': 'Locaux Techniques',
      '7': 'Document de references',
    },
    level2: {
      '1': {
        '1.1': 'Analyse du dossier CFO',
        '1.2': 'Analyse du dossier CFA',
        '1.3': 'Analyse du dossier SSI',
      },
      '2': {
        '2.1': 'PLAN CHEMINEMENT',
        '2.2': 'plans implantataion CFO/CFA/SSI',
        '2.3': 'Realisation du plans d\'incorporations BETON',
        '2.4': 'NDC CFO/CFA/SSI',
      },
      '3': {
        '3.1': 'ECLAIRAGE',
        '3.2': 'FORCE',
      },
      '4': {
        '4.1': 'PLAN distribution VDI',
      },
      '5': {
        '5.1': 'Realisation du plans de distribution SSI',
      },
      '6': {
        '6.1': 'Maquettage local transfo',
        '6.2': 'Maquettage local TGBT',
      },
      '7': {
        '7.1': 'Document de references',
      },
    },
    level3: {
      '1.1': {
        '1.1.1': 'Analyse des Reseaux CFO + Lecture du CCTP CFO + FICHE TECHNIQUE',
        '1.1.2': 'Analyse de Distribution CFO + Lecture du CCTP CFO + FICHE TECHNIQUE',
      },
      '1.2': {
        '1.2.1': 'Analyse des Reseaux CFA + Lecture du CCTP CFA + FICHE TECHNIQUE',
        '1.2.2': 'Analyse de Distribution CFA + Lecture du CCTP CFA + FICHE TECHNIQUE',
      },
      '1.3': {
        '1.3.1': 'Analyse des Reseaux SSI + Lecture du CCTP SSI + FICHE TECHNIQUE',
        '1.3.2': 'Analyse de Distribution SSI + Lecture du CCTP SSI + FICHE TECHNIQUE',
      },
      '2.1': {
        '2.1.1': 'Plan des Réseaux RESERVATIONS par niveau (depend des niveaux)',
      },
      '2.2': {
        '2.2.1': 'Plan des terminaux par niveau (depend des niveaux) CFO/CFA/SSI',
      },
      '2.3': {
        '2.3.1': 'Plan d\'incorporations par niveau (depend des niveaux)',
      },
      '2.4': {
        '2.4.1': 'bilan de puissance',
        '2.4.2': 'Note de calcul de distribution + schèmas armoires électriques',
      },
      '3.1': {
        '3.1.1': 'Realisation étude d\'éclairement',
        '3.1.2': 'Plan des circuits par niveau (depend des niveaux)',
      },
      '3.2': {
        '3.2.1': 'Plan des circuits par niveau (depend des niveaux)',
        '3.2.2': 'Synoptiques CFO',
      },
      '4.1': {
        '4.1.1': 'Plan des VDI par niveau (depend des niveaux)',
        '4.1.2': 'Synoptiques CFA',
      },
      '5.1': {
        '5.1.1': 'Plan des terminaux par niveau (depend des niveaux)',
        '5.1.2': 'Synoptiques SSI',
      },
      '6.1': {
        '6.1.1': 'Maquettage local transfo',
      },
      '6.2': {
        '6.2.1': 'Maquettage local TGBT',
      },
      '7.1': {
        '7.1.1': 'Liste de livrables',
        '7.1.2': 'Legendes',
        '7.1.3': 'Presentation et Cartouches',
      },
    },
  },
};

function TaskForm({ onClose }) {
  const [selectedTab, setSelectedTab] = useState('fluid');
  const [taskDetails, setTaskDetails] = useState({
    assignMembers: '',
    level1: '',
    level2: '',
    level3: '',
    floor: [],
    basement: [],
    deadline: '',
    startDate: '', // New state for start date
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
      setLevel2Options(taskData[selectedTab].level2[value] || []);
      setTaskDetails((prevDetails) => ({ ...prevDetails, level2: '', level3: '' }));
      setLevel3Options([]);
    }

    if (name === 'level2') {
      setLevel3Options(taskData[selectedTab].level3[value] || []);
      setTaskDetails((prevDetails) => ({ ...prevDetails, level3: '' }));
    }
  };

  const handleFloorChange = (event) => {
    const { value } = event.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      floor: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleBasementChange = (event) => {
    const { value } = event.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      basement: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, you can send taskDetails to the backend here
    // Close the modal
    onClose();
  };

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setTaskDetails({
      assignMembers: '',
      level1: '',
      level2: '',
      level3: '',
      floor: [],
      basement: [],
      deadline: '',
      startDate: '', // Reset start date when changing tabs
    });
    setLevel2Options([]);
    setLevel3Options([]);
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
        <Tabs value={selectedTab} onChange={handleTabChange} aria-label="project tabs">
          <Tab label="Fluid" value="fluid" />
          <Tab label="Electric" value="electric" />
          <Tab label="MEP" value="mep" />
        </Tabs>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', mt: 2 }}>
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
                {Object.keys(taskData[selectedTab].level1).map((key) => (
                  <MenuItem key={key} value={key}>
                    {taskData[selectedTab].level1[key]}
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
                select
                fullWidth
                label="Basement"
                name="basement"
                value={taskDetails.basement}
                onChange={handleBasementChange}
                margin="normal"
                SelectProps={{
                  multiple: true,
                }}
              >
                {Array.from({ length: numBasements }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    Basement {i + 1}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                label="Floor"
                name="floor"
                value={taskDetails.floor}
                onChange={handleFloorChange}
                margin="normal"
                SelectProps={{
                  multiple: true,
                }}
              >
                {Array.from({ length: numFloors }, (_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    Floor {i + 1}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ display: 'flex', gap: '16px' }}>
              <DatePickerWrapper sx={{ marginTop: '16px' }}>
                Deadline
                <DatePicker
                  selected={taskDetails.deadline}
                  onChange={(date) => setTaskDetails({ ...taskDetails, deadline: date })}
                  showYearDropdown
                  showMonthDropdown
                  placeholderText="MM-DD-YYYY"
                  className="custom-datepicker-input"
                  customInput={<CustomInput />}
                />
              </DatePickerWrapper>
              <DatePickerWrapper sx={{ marginTop: '16px' }}>
                Start Date
                <DatePicker
                  selected={taskDetails.startDate}
                  onChange={(date) => setTaskDetails({ ...taskDetails, startDate: date })} // Set start date
                  showYearDropdown
                  showMonthDropdown
                  placeholderText="MM-DD-YYYY"
                  className="custom-datepicker-input"
                  customInput={<CustomInput />}
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
