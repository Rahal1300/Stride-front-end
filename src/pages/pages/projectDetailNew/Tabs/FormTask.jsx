import React, { forwardRef, useState, useEffect } from 'react';
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
  return <TextField  {...props} inputRef={ref} autoComplete='off' />;
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
function TaskForm({ onClose }) {
  const [taskDetails, setTaskDetails] = useState({
    assignMembers: '',
    level1: '',
    level2: '',
    level3: '',
    floor: '',
    deadline: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission, you can send taskDetails to the backend here
    // Close the modal
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
              fullWidth
              select

              label="Level 1"
              name="level1"
              value={taskDetails.level1}
              onChange={handleChange}
              margin="normal"
              required
            >
                <MenuItem value="level11">Analyse des Données D entrées</MenuItem>
              <MenuItem value="level12">Realisation du lot CVC</MenuItem>
              <MenuItem value="level13">Realisation du lot PLB</MenuItem>
              <MenuItem value="level13">Realisation du lot CVPB</MenuItem>
              <MenuItem value="level13">Locaux Techniques</MenuItem>

            </TextField>
          </Box>
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <TextField
              fullWidth
              select
                            label="Level 2"
              name="level 2"
              value={taskDetails.level2}
              onChange={handleChange}
              margin="normal"
              required
            >
                    <MenuItem value="level21">Analyse du dossier CVC</MenuItem>
              <MenuItem value="level22">Analyse du dossier PLB</MenuItem>
              <MenuItem value="level23">Realisation du sous-lot Aeraulique</MenuItem>       
              <MenuItem value="level23">Realisation du sous-lot Evacuation</MenuItem>       
              <MenuItem value="level23">Realisation du sous-lot Alimentation</MenuItem>   

              <MenuItem value="level23">Realisation du lot Reservations</MenuItem>       
              <MenuItem value="level23">Realisation des Attentes Electriques</MenuItem>       

              <MenuItem value="level23">Realisation des Renfort sanitaires</MenuItem>       
              <MenuItem value="level23">Chaufferie</MenuItem>       
              <MenuItem value="level23">LOCAL CTA</MenuItem>       
              <MenuItem value="level23">SOUS STATION</MenuItem>       

              
                   </TextField>

            <TextField
              select
              fullWidth
              label="Level 3"
              name="level3"
              value={taskDetails.level3}
              onChange={handleChange}
              margin="normal"
            >
              <MenuItem value="level31">Analyse des Reseaux Aerauliques</MenuItem>
              <MenuItem value="level32">Analyse des Reseaux Hydrauliques</MenuItem>
              <MenuItem value="level33">Lecture du CCTP CVC</MenuItem>
              <MenuItem value="level33">Analyse des Reseaux d evacuation y compris Reseaux EP</MenuItem>

              <MenuItem value="level33">Analyse des Reseaux d alimentations</MenuItem>

              <MenuItem value="level33">Lecture du CCTP PLB</MenuItem>
              <MenuItem value="level33">Bilan Aeraulique</MenuItem>
              <MenuItem value="level33">Plan des Terminaux par niveau (depond des niveaux)</MenuItem>
              <MenuItem value="level33">Note de Calcul Dimensionnement Aeraulique (tout niveaux/tout système)</MenuItem>
              <MenuItem value="level33">Synoptique Aeraulique</MenuItem>
              <MenuItem value="level33">Selection Equipements</MenuItem>
              <MenuItem value="level33">Plan des Terminaux par niveau (depond des niveaux)</MenuItem>
              <MenuItem value="level33">Note de Calcul Dimensionnement Hydraulique (tout niveaux/tout système)</MenuItem>
              <MenuItem value="level33">Plan Hydraulique par niveau (depond des niveaux)</MenuItem>
              <MenuItem value="level33">Note de Calcul Perte de Charge Hydraulique (tout niveaux/tout système)</MenuItem>
              <MenuItem value="level33">Synoptique Hydraulique</MenuItem>

              <MenuItem value="level33">Plan des Attentes au Sol</MenuItem>
              <MenuItem value="level33">Note de Calcul Dimensionnement Evacuation (tout niveaux/tout système)</MenuItem>

              <MenuItem value="level33">Note de Calcul Dimensionnement Eau pluviale (tout niveaux/tout système)</MenuItem>

              <MenuItem value="level33">Synoptique Evacuation</MenuItem>

              <MenuItem value="level33">Synoptique Eau pluviale</MenuItem>

              <MenuItem value="level33">Note de Calcul Dimensionnement EFS (tout niveaux/tout système)</MenuItem>
              <MenuItem value="level33">Note de Calcul Dimensionnement ECS (tout niveaux/tout système)</MenuItem>
              <MenuItem value="level33">Note de Calcul Dimensionnement BECS (tout niveaux/tout système)</MenuItem>

              <MenuItem value="level33">Plan Alimentation par niveau (depond des niveaux)</MenuItem>
              <MenuItem value="level33">Synoptique Alimentation</MenuItem>
              <MenuItem value="level33">Note de Calcul Dimensionnement BECS (tout niveaux/tout système)</MenuItem>

              <MenuItem value="level33">Plan Reservations Plancher Haut par niveau (depond des niveaux)</MenuItem>
              <MenuItem value="level33">Realisation des Attentes Electriques</MenuItem>
              <MenuItem value="level33">Plan des Attentes Electriques par niveau (depond des niveaux)</MenuItem>
              <MenuItem value="level33">Realisation des Renfort sanitaires</MenuItem>
              <MenuItem value="level33">Plan des Renfort sanitaires par niveau (depond des niveaux)</MenuItem>



              <MenuItem value="level33">Locaux Techniques</MenuItem>

              <MenuItem value="level33">Chaufferie</MenuItem>
              <MenuItem value="level33">Schema de Principe</MenuItem>
              <MenuItem value="level33">Maqquetage Chaufferie</MenuItem>
              <MenuItem value="level33">LOCAL CTA</MenuItem>
              <MenuItem value="level33">Schema de Principe</MenuItem>
              <MenuItem value="level33">Maqquetage Chaufferie</MenuItem>
              <MenuItem value="level33">SOUS STATION</MenuItem>
              <MenuItem value="level33">Schema de Principe</MenuItem>
              <MenuItem value="level33">Maqquetage Chaufferie</MenuItem>




            </TextField>
          </Box>

          <Box sx={{ display: 'flex', gap: '16px' }}>
  <TextField
    label="Floor (if applicable)"
    name="floor"
    value={taskDetails.floor}
    onChange={handleChange}
    margin="normal"
    sx={{ width: 'calc(50% - 8px)' }} // Adjust width as needed
  />       

<DatePickerWrapper sx={{ marginTop: '16px' }}> {/* Adjust the marginTop value as needed */}

<DatePicker

  showYearDropdown
  showMonthDropdown
  placeholderText="MM-DD-YYYY"
  className="custom-datepicker-input"
  customInput={<CustomInput  />} // Set fullWidth to true
  
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
