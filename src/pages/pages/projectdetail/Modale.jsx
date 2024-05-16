import React, { useState,forwardRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import DatePicker from 'react-datepicker';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import CountrySelect from '../addproject/addproject/Components/country'; // Adjust the import path
import { useTheme } from '@mui/material/styles';
import { Grid } from '@mui/material';
import { loginSuccess } from '../../../features/reducers/authReducer'
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
const names = ['Structure', 'Architecture', 'MEP', 'Electrical'];
function valuetext(value) {
  return `${value}°C`;
}
const CustomInput3 = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Extend to' autoComplete='off' />;
});
CustomInput3.displayName = 'CustomInput3';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function EditableModal({
  open,
  handleClose,
  idproject,
  role,ProjectNameFromDetail // Receive the callback function
}) {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
    const [projectManager, setProjectManager] = useState('');
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [language, setLanguage] = useState('');
    const [loi, setLoi] = useState('');
    const [lod, setLod] = useState('');
    const [estimatedDuration, setEstimatedDuration] = useState('');
    const [status, setStatus] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedDepartments, setSelectedDepartments] = useState([]); // <-- Declare the state here
    const [date3, setDate3] = useState(null);


    const isAuthenticated = useSelector((state) => state.isAuthenticated);

    // const updatedDetails = {
      
    //   "projectName":   projectName,

    //   "description":  description,
  
    //   "country": "Updated Country",
  
    //   "projectmanager":  projectManager,
  
    //   "projectlang": language,
  
    //   "loi": loi,
  
    //   "lod": lod,
  
    //  "estimatedDuration" :estimatedDuration,
  
    //  "departement":"Elec",
  
    //  "status": status,
    // };


    const handleCountrySelect = (country) => {
      setSelectedCountry(country);
    };
    const  user  = useSelector(loginSuccess);  

  async function handleUpdateClick() {
    const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/projects/update/${idproject}`;

    const token = user.payload.token;
    const updatedDetails = {
      "projectName": projectName,
      "description": description,
      "country": selectedCountry ? selectedCountry.label : null,
      "projectmanager": projectManager,
      "lang": language,
      "loi": loi,
      "lod": lod,
      extendto: date3, 
      "progress":progress,
      "estimatedDuration": estimatedDuration,
      "departement": selectedDepartments.join(','), 
      "status": status,
    };
  
    try {
      const response = await fetch(endpoint, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedDetails),
      });
  
      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Update failed:', response.statusText);
        
      }
    } catch (error) {
      console.error('Error during update:', error);
    }
    handleClose();

  }
  const handleIncrement = () => {
    setProgress((prevProgress) => Math.min(prevProgress + 1, 100)); 
  };

  const handleDecrement = () => {
    setProgress((prevProgress) => Math.max(prevProgress - 1, 0)); 
  };
    return (
      <DatePickerWrapper>  

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Porject {ProjectNameFromDetail} </DialogTitle>
        {role === "TeamLeader" && (
          <Card sx={{ width: '500px', height: '300px', padding: '20px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)' }}>
  <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

    <Typography variant='h6'>
      Extend To Date:
    </Typography>

    <DatePicker
      selected={date3}
      showYearDropdown
      showMonthDropdown
      placeholderText='MM-DD-YYYY'
      customInput={<CustomInput3 />}
      id='form-layouts-separator-date'
      onChange={(date3) => setDate3(date3)}
      sx={{ width: '100%', margin: '10px 0' }}
    />

    <Typography variant='h6'>
      Projects Progress: {progress}%
    </Typography>

    <Box sx={{ width: '80%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    
      <Slider
        aria-label='Temperature'
        value={progress}
        onChange={(e, value) => setProgress(value)}
        getAriaValueText={valuetext}
        color='primary'
        sx={{ width: '100%', margin: '0 10px' }}
      />
        <Button variant="outlined" onClick={handleDecrement}>
        -
      </Button>
      <Button variant="outlined" onClick={handleIncrement}>
        +
      </Button>
    </Box>

  </DialogContent>
</Card>

)}
            {role !== "TeamLeader" && (
      <DialogContent sx={{ width: '100%', height: '100%' }}>
          <TextField
            margin="dense"
            label="Project Manager"
            type="text"
            name="projectManager"
            fullWidth
            value={projectManager}
            onChange={(e) => setProjectManager(e.target.value)}
          />
           <TextField
            margin="dense"
            label="Projects Name"
            placeholder="Projects Name"
            fullWidth
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
       <TextField
            margin="dense"
            label="Description"
            type="text"
            name="description"
            fullWidth
            multiline
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        <CountrySelect onSelectCountry={handleCountrySelect}  />
  
          <TextField
            margin="dense"
            label="Language"
            type="text"
            name="language"
            fullWidth
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
                                <Grid container spacing={2}>
                                  <Grid item xs={12} sm={4}>

                                    <InputLabel id='form-layouts-separator-select-label'> LOI</InputLabel>

                                  <Select
                                  label='Detail_level'
                                  value={loi}
                                  onChange={(e) => setLoi(e.target.value)}
                                  id='form-layouts-separator-select'
                                  sx={{ width: '100%' }} // Set the width and margin as needed

                                  labelId='form-layouts-separator-select-label'
                                  >
                                    <MenuItem value='LOI-50'>LOI-50</MenuItem>
                                    <MenuItem value='LOI-100'>LOI-100</MenuItem>
                                    <MenuItem value='LOI-150'>LOI-150</MenuItem>
                                    <MenuItem value='LOI-200'>LOI-200</MenuItem>
                                    <MenuItem value='LOI-250'>LOI-250</MenuItem>
                                    <MenuItem value='LOI-300'>LOI-300</MenuItem>
                                    <MenuItem value='LOI-350'>LOI-350</MenuItem>
                                    <MenuItem value='LOI-400'>LOI-400</MenuItem>
                                    <MenuItem value='LOI-450'>LOI-450</MenuItem>
                                    <MenuItem value='LOI-500'>LOI-500</MenuItem>

                                  </Select>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                              <InputLabel id='form-layouts-separator-select-label'> LOD </InputLabel>
                                                                              <Select
                                                        label='Detail_level'
                                                        value={lod}
                                                        sx={{ width: '100%' }} // Set the width and margin as needed

                                                        onChange={(e) => setLod(e.target.value)}
                                                        id='form-layouts-separator-select'
                                                        labelId='form-layouts-separator-select-label'
                                                      >
                                                            <MenuItem value='LOD-50'>LOD-50</MenuItem>
                                                            <MenuItem value='LOD-100'>LOD-100</MenuItem>
                                                            <MenuItem value='LOD-150'>LOD-150</MenuItem>
                                                            <MenuItem value='LOD-200'>LOD-200</MenuItem>
                                                            <MenuItem value='LOD-250'>LOD-250</MenuItem>
                                                            <MenuItem value='LOD-300'>LOD-300</MenuItem>
                                                            <MenuItem value='LOD-350'>LOD-350</MenuItem>
                                                            <MenuItem value='LOD-400'>LOD-400</MenuItem>
                                                            <MenuItem value='LOD-450'>LOD-450</MenuItem>
                                                            <MenuItem value='LOD-500'>LOD-500</MenuItem>
                                                          </Select>       </Grid>              </Grid>

  <InputLabel id='form-layouts-separator-select-label'>Departments</InputLabel>
  <Select
    label='Departments'
    value={selectedDepartments}
    onChange={(e) => setSelectedDepartments(e.target.value)}
    id='form-layouts-separator-select'
    labelId='form-layouts-separator-select-label'
    multiple
    sx={{ width: '80%' }} 

    renderValue={(selected) => (
      <div>
        {selected.map((value) => (
          <Chip key={value} label={value} />
        ))}
      </div>
    )}
    MenuProps={MenuProps}
  >
    {names.map((name) => (
      <MenuItem key={name} value={name} style={getStyles(name, selectedDepartments, theme)}>
        {name}
      </MenuItem>
    ))}
  </Select>
        <TextField
            margin="dense"
            label="Estimated Duration"
            type="text"
            name="estimatedDuration"
            fullWidth
            value={estimatedDuration}
            onChange={(e) => setEstimatedDuration(e.target.value)}
          />
          <Typography variant='text' >
                    Projects progress : {progress}%
                  </Typography>
                  <div>
                <Slider
                  aria-label='Temperature'
                  value={progress}
                  onChange={(e, value) => setProgress(value)}
                  getAriaValueText={valuetext}
                  color='primary'
                  sx={{ width: '70%' }} // Set the width and margin as needed
                  /> 
                  <Button onClick={handleDecrement}   sx={{ fontSize: '15px'}} >
                  -
                </Button>
                <Button onClick={handleIncrement}   sx={{ fontSize: '15px'  }}>
                  +
                </Button></div>   
                <DatePicker
      selected={date3}
      showYearDropdown
      showMonthDropdown
      placeholderText='MM-DD-YYYY'
      customInput={<CustomInput3 />}
      id='form-layouts-separator-date'
      onChange={(date3) => setDate3(date3)}
      sx={{ width: '100%' }}
    />
 <InputLabel id='form-layouts-separator-select-label'>Status</InputLabel>
    <Select
      label='Status'
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      id='form-layouts-separator-select'
      labelId='form-layouts-separator-select-label'
    >
      <MenuItem value='Active'>Active</MenuItem>
      <MenuItem value='Pending_level'>Pending_level</MenuItem>
      <MenuItem value='Inactive'>Inactive</MenuItem>
    </Select>
        </DialogContent>
 )}
        <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpdateClick} color="primary">
          Update
        </Button>
        </DialogActions>
      </Dialog>
      </DatePickerWrapper>  
    );
  }
  
