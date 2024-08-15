import React, { forwardRef, useState,useEffect  } from 'react';
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  Box,
  Button,
  IconButton,
  MenuItem,
  Snackbar,
  SnackbarContent,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import { loginSuccess } from '../../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { grey } from '@mui/material/colors'; // Import grey colors from Material-UI
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Import the error icon you want to use
import Tooltip from '@mui/material/Tooltip';
import { format, parse } from 'date-fns';

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Start Date' autoComplete='off' />;
});

CustomInput.displayName = 'CustomInputTask';


const CustomInput2 = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Deadline' autoComplete='off' />;
});

CustomInput2.displayName = 'CustomInputTask2';
function TaskForm({ onClose, discipline, progress, base, floor, Team, id, onAddTask, documents, remain,start,end }) {
 
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
  const [level1Tasks, setLevel1Tasks] = useState([]);
  const userToken = useSelector(loginSuccess);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [missingLevel1Index, setMissingLevel1Index] = useState(null);
  const [missingLevel2Index, setMissingLevel2Index] = useState(null);
  const [missingLevel3Index, setMissingLevel3Index] = useState(null);

  
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [responseStatus, setResponseStatus] = useState(null); 
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleAddLevel1Task = () => {
    setLevel1Tasks([
      ...level1Tasks,
      { name: '', percentage: '', members: '', floor: [], basement: [], deadline: '', startDate: '', level2Tasks: [] ,description: '', },
    ]);
    setMissingLevel1Index(null); // Reset missing index on add

  };

  const handleRemoveLevel1Task = (index) => {
    const updatedTasks = [...level1Tasks];
    updatedTasks.splice(index, 1);
    setLevel1Tasks(updatedTasks);
  };

  const handleLevel1TaskChange = (index, field, value) => {

    setMissingLevel1Index(null);
    const updatedTasks = [...level1Tasks];
      if (field === 'percentage' && (value === '' || (value >= 0 && value <= 100))) {
      updatedTasks[index][field] = value;
      setLevel1Tasks(updatedTasks);
    } else if (field !== 'percentage') {
      updatedTasks[index][field] = value instanceof Date ? value : value; 
      setLevel1Tasks(updatedTasks);
    }
  };

  const handleAddLevel2Task = (level1Index) => {
    const updatedTasks = [...level1Tasks];
    const level1TaskName = updatedTasks[level1Index].name;
      if (level1TaskName.trim() === '') {
      alert(`Please enter a name for Task ${level1Index + 1} first.`);
      setMissingLevel1Index(level1Index); // Set missing index
      return;
    }
      updatedTasks[level1Index].level2Tasks.push({
      name: '',
      percentage: '',
      members: '',
      floor: [],
      basement: [],
      deadline: '',
      startDate: '',
      level3Tasks: [],
      description: '',
    });
  
    setLevel1Tasks(updatedTasks);
    setMissingLevel1Index(null); // Reset missing index on add

  };
  const handleRemoveLevel2Task = (level1Index, level2Index) => {
    const updatedTasks = [...level1Tasks];
    updatedTasks[level1Index].level2Tasks.splice(level2Index, 1);
    setLevel1Tasks(updatedTasks);
    
  };
  const handleLevel2TaskChange = (level1Index, level2Index, field, value) => {
    const updatedTasks = [...level1Tasks];
    const currentTask = updatedTasks[level1Index];
    const level2Tasks = currentTask.level2Tasks;
    setMissingLevel2Index(null);

    setMissingLevel1Index(null); 
    if (field === 'startDate') {
      const minDate = level1Tasks.startDate;
      const maxDate = level1Tasks.deadline;
      if (value < minDate) value = minDate;
      if (value > maxDate) value = maxDate;
    }

    if (field === 'deadline') {
      const minDate = level1Tasks.startDate;
      const maxDate = level1Tasks.deadline;
      if (value < minDate) value = minDate;
      if (value > maxDate) value = maxDate;
    }
    let currentTotalPercentage = level2Tasks.reduce((acc, task) => acc + task.percentage, 0);
    if (field === 'percentage' && (value === '' || (value >= 0 && value <= 100))) {
      let newTotalPercentage = currentTotalPercentage - level2Tasks[level2Index].percentage + Number(value);
      if (newTotalPercentage > 100) {
       

        alert("Warning: Updating this percentage will cause the total percentage of all Level 2 Tasks to exceed 100%. Please adjust accordingly.");
        return; 
      }
      level2Tasks[level2Index][field] = Number(value);
    } else if (field !== 'percentage') {
      level2Tasks[level2Index][field] = value instanceof Date ? value : value;
    }
    currentTask.level2Tasks = level2Tasks;
    setLevel1Tasks(updatedTasks);
    let updatedTotalPercentage = level2Tasks.reduce((acc, task) => acc + task.percentage, 0);
    if (updatedTotalPercentage > 100) {  
     

      alert("Warning: The total percentage of all Level2Tasks exceeds 100%. Please adjust the percentages to ensure they sum up to 100%.");
    }
  };
  const handleAddLevel3Task = (level1Index, level2Index) => {
    const updatedTasks = [...level1Tasks];
    const level2TaskName = updatedTasks[level1Index].level2Tasks[level2Index].name;
    


   
    if (level2TaskName.trim() === '') {
      setMissingLevel2Index(level2Index); // Set missing index


      alert(`Please enter a name for Level 2 Task ${level2Index + 1} first.`);
      return;
    }
    updatedTasks[level1Index].level2Tasks[level2Index].level3Tasks.push({
      name: '',
      percentage: '',
      members: '',
      floor: [],
      basement: [],
      deadline: '',
      startDate: '',
      description: '',

    });
    setLevel1Tasks(updatedTasks);
    setMissingLevel2Index(null);

    setMissingLevel1Index(null); 
  };

  const handleRemoveLevel3Task = (level1Index, level2Index, level3Index) => {
    const updatedTasks = [...level1Tasks];
    updatedTasks[level1Index].level2Tasks[level2Index].level3Tasks.splice(
      level3Index,
      1
    );
    setLevel1Tasks(updatedTasks);
  };

  const handleLevel3TaskChange = (level1Index, level2Index, level3Index, field, value) => {
    const updatedTasks = [...level1Tasks];
    setMissingLevel1Index(null); 
    setMissingLevel3Index(null);
    setMissingLevel2Index(null);
    if (field === 'startDate') {
      const minDate = updatedTasks[level1Index].level2Tasks[level2Index].startDate;
      const maxDate = updatedTasks[level1Index].level2Tasks[level2Index].deadline;
      console.log("maxDate",maxDate);

      console.log("minDate",minDate);
      if (value < minDate) value = minDate;
      if (value > maxDate) value = maxDate;
    }

    if (field === 'deadline') {
      const minDate = updatedTasks[level1Index].level2Tasks[level2Index].startDate;
      const maxDate = updatedTasks[level1Index].level2Tasks[level2Index].deadline;
      if (value < minDate) value = minDate;
      if (value > maxDate) value = maxDate;
    }

    if (field === 'percentage' && (value === '' || (value >= 0 && value <= 100))) {
      updatedTasks[level1Index].level2Tasks[level2Index].level3Tasks[level3Index][field] = value;
      setLevel1Tasks(updatedTasks);
    } else if (field !== 'percentage') {
      updatedTasks[level1Index].level2Tasks[level2Index].level3Tasks[level3Index][field] = value instanceof Date ? value : value;
      setLevel1Tasks(updatedTasks);
    }
  };
  

  const handleFinish = () => {
  
    for (let i = 0; i < level1Tasks.length; i++) {
      const task = level1Tasks[i];
      if (!task.name) {
        alert(`Please enter a name for  Task ${i + 1}.`);
        setMissingLevel1Index(i + 1); 
        return;
      }
        for (let j = 0; j < task.level2Tasks.length; j++) {
        const level2Task = task.level2Tasks[j];
        if (!level2Task.name) {
          alert(`Please enter a name for  Task ${i + 1}.${j + 1}.`);
          setMissingLevel2Index({ level1Index: i + 1, level2Index: j + 1 });

          setMissingLevel1Index(i + 1); 

          return;
        }
          for (let k = 0; k < level2Task.level3Tasks.length; k++) {
          const level3Task = level2Task.level3Tasks[k];
          if (!level3Task.name) {
            alert(`Please enter a name for Task ${i + 1}.${j + 1}.${k + 1}.`);
            setMissingLevel3Index({ level1Index: i + 1, level2Index: j + 1, level3Index: k + 1 });
            setMissingLevel2Index({ level1Index: i + 1, level2Index: j + 1 });

            setMissingLevel1Index(i + 1); 

            return;
          }
        }
      }
    }
    const formattedTasks = {
      projectId: id,
      tasks: level1Tasks.map(task => ({
        parentTaskName: task.name,
        parentTaskWeight: parseInt(task.percentage, 10),
        parentTaskFloor: task.floor.join(', '),
        parentTaskBasement: task.basement.join(', '),
        parentTaskStartDate: task.startDate,
        parentTaskDeadline: task.deadline,
        description: task.description    ,
        assignedUserId: task.members,
                subtasks: task.level2Tasks.map(subtask => ({
          name: subtask.name,
          weight: parseInt(subtask.percentage, 10),
          floor: subtask.floor.join(', '),
          basement: subtask.basement.join(', '),
          startDate: subtask.startDate,
          deadline: subtask.deadline,
          description: subtask.description ,   
          assignedUserId: subtask.members ,    
           subtasks: subtask.level3Tasks.map((level3Task) => ({
            name: level3Task.name,
            weight: parseInt(level3Task.percentage, 10),
            floor: level3Task.floor.join(', '),
            basement: level3Task.basement.join(', '),
            startDate: level3Task.startDate,
            deadline: level3Task.deadline,
            description: level3Task.description,
            assignedUserId: level3Task.members,
          })),
        })),
      })),
    };
    
    console.log('Formatted Tasks:', formattedTasks);

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/createTasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken.payload.token}`,
      },
      body: JSON.stringify(formattedTasks),
    })
      .then(response => {
        if (response.ok) {
          setSnackbarMessage('Task saved successfully');
          setResponseStatus(response.status);
          setSnackbarOpen(true);
          setLevel1Tasks([]);
         // onClose();
        } else {
          setSnackbarMessage('Error saving task');
          setResponseStatus(response.status);
          setSnackbarOpen(true);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setSnackbarMessage('Error saving task');
        setResponseStatus(null); 
        setSnackbarOpen(true);
      });
  };

  const saveLevel1Tasks = (index) => {
  
    const task = level1Tasks[index];
    let level2Index = -1;
    let level3Index = -1;
  
    // Check for empty names in level 2 tasks
    const hasEmptyLevel2Names = task.level2Tasks.some((subtask, subtaskIndex) => {
      if (subtask.name.trim() === '') {
        level2Index = subtaskIndex;
        return true;
      }
      return false;
    });
  
    if (hasEmptyLevel2Names) {
      alert(` task  ${index + 1}.${level2Index + 1} has an empty name.`);
      setMissingLevel1Index(index + 1); 
      setMissingLevel2Index({ level1Index: index + 1, level2Index: level2Index + 1 }); 
      return;
    }
  
    // Check for empty names in level 3 tasks
    const hasEmptyLevel3Names = task.level2Tasks.some((subtask, subtaskIndex) => {
      return subtask.level3Tasks.some((subsubtask, subsubtaskIndex) => {
        if (subsubtask.name.trim() === '') {
          level2Index = subtaskIndex;
          level3Index = subsubtaskIndex;
          return true;
        }
        return false;
      });
    });
  
    if (hasEmptyLevel3Names) {
      alert(` task  ${index + 1}.${level2Index + 1}.${level3Index + 1} has an empty name.`);
      setMissingLevel1Index(index + 1); 
      setMissingLevel2Index({ level1Index: index + 1, level2Index: level2Index + 1 });
      setMissingLevel3Index({ level1Index: index + 1, level2Index: level2Index + 1, level3Index: level3Index + 1 }); 
      return;
    }
    const formattedTask = {
      projectId: id, // Assuming 'id' is defined elsewhere in your code
      tasks: level1Tasks.map((task) => ({
        parentTaskName: task.name,
        parentTaskWeight: parseInt(task.percentage, 10),
        parentTaskFloor: task.floor.join(', '),
        parentTaskBasement: task.basement.join(', '),
        parentTaskStartDate: task.startDate,
        parentTaskDeadline: task.deadline,
        description: task.description,
        assignedUserId: task.members,
        subtasks: task.level2Tasks.map((subtask) => ({
          name: subtask.name,
          weight: parseInt(subtask.percentage, 10),
          floor: subtask.floor.join(', '),
          basement: subtask.basement.join(', '),
          startDate: subtask.startDate,
          deadline: subtask.deadline,
          description: subtask.description,
          assignedUserId: subtask.members,
          subtasks: subtask.level3Tasks.map((level3Task) => ({
            name: level3Task.name,
            weight: parseInt(level3Task.percentage, 10),
            floor: level3Task.floor.join(', '),
            basement: level3Task.basement.join(', '),
            startDate: level3Task.startDate,
            deadline: level3Task.deadline,
            description: level3Task.description,
            assignedUserId: level3Task.members,
            
          })),
        })),
      })),
    };
    
    console.log('Formatted Task:', formattedTask);
  
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/createTasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken.payload.token}`,
      },
      body: JSON.stringify(formattedTask),
    })
      .then(response => {
        if (response.ok) {
          setSnackbarMessage('Task saved successfully');
          setResponseStatus(response.status);
          setSnackbarOpen(true);
          // Optionally, clear level1Tasks state
          setLevel1Tasks(prevTasks => {
            const updatedTasks = [...prevTasks];
            updatedTasks.splice(index, 1); // Remove 1 element at `index`
            return updatedTasks;
            
          });      
           setMissingLevel1Index(null);
          setMissingLevel2Index(null);
          setMissingLevel3Index(null);
        
        } else {
          setSnackbarMessage('Error saving task');
          setResponseStatus(response.status);
          setSnackbarOpen(true);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setSnackbarMessage('Error saving task');
        setResponseStatus(null); 
        setSnackbarOpen(true);
      });
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
        width: '80%',
        maxWidth: '100%',
        borderRadius: 4,
        height: '90%',
        maxHeight: '100%',
        overflowY: 'auto',
      }}
    >

<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" gutterBottom>
       Creating Tasks
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 'auto', marginRight: '20px' }}>
        <IconButton onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
        {/* <Typography variant="caption" sx={{ fontSize: '0.75rem' ,marginLeft:8, color: grey[400]}}>
        {remain}% of tasks remaining
        </Typography> */}
      </Box>
    </Box>
      {level1Tasks.map((task, index) => (
     <Accordion
     key={index}
     sx={{
       mb: 2,
      }}
   >
    
   
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`level1-task-${index}-content`}
            id={`level1-task-${index}-header`}
          >
 {missingLevel1Index === index + 1 && (
      <Tooltip title="You need to write the Title">

      <ErrorOutlineIcon style={{ color: 'red', marginLeft: '8px' }} />
      </Tooltip>
    )}           <Typography variant="subtitle1">
            {`Task ${index + 1}`} {task.name ? `: ${task.name}` : ''}
            </Typography>
            <IconButton
              onClick={() => handleRemoveLevel1Task(index)}
              aria-label="remove task"
                  sx={{ marginLeft: 'auto',marginRight: '20px' }}

            >
              <DeleteOutlineIcon />
            </IconButton>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Title"
                  fullWidth
                  value={task.name}
                    
                  onChange={(e) => handleLevel1TaskChange(index, 'name', e.target.value)}
                  required 
                  error={task.name === ''}
  helperText={task.name === '' ? 'Title is required' : ''} 
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Percentage"
                  fullWidth
                  
                  value={task.percentage}
                  onChange={(e) => handleLevel1TaskChange(index, 'percentage', e.target.value)}
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 100 } }}                  />
              </Grid>
              <Grid item xs={12}  sm={4}>
                <TextField
                  select
                  fullWidth
                  label="Assign Member"
                  value={task.members}
                  
                  onChange={(e) => handleLevel1TaskChange(index,'members', e.target.value)}
                >
                  {Team?.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.email}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}sm={4}>
              <TextField
    select
    fullWidth
    label="Floor"
    name="floor"
    value={task.floor}
    onChange={(e) => handleLevel1TaskChange(index, 'floor', e.target.value)}
    margin="normal"
    SelectProps={{
      multiple: true,
    }}
  >
    {Array.from({ length: floor }, (_, i) => (
      <MenuItem key={i} value={i}>
        Floor {i}
      </MenuItem>
    ))}
  </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
              <TextField
    select
    fullWidth
    label="Basement"
    name="basement"
    value={task.basement}
    onChange={(e) => handleLevel1TaskChange(index, 'basement', e.target.value)}
    margin="normal"
    SelectProps={{
      multiple: true,
    }}
  >
    {Array.from({ length: base }, (_, i) => (
      <MenuItem key={i + 1} value={i + 1}>
        Basement {i + 1}
      </MenuItem>
    ))}
  </TextField>
              </Grid>
              
              <Grid item xs={12}sm={2}>
              <DatePickerWrapper     sx={{ marginTop:2}}>

    <DatePicker
   label="Start Date"
   selected={task.startDate} 
   onChange={(date) =>
     handleLevel1TaskChange(index, 'startDate', date)
   } // 'date' will be a Date object
   showYearDropdown
   showMonthDropdown
   placeholderText="DD/MM/YYYY"
   dateFormat="dd/MM/yyyy" 

   className="custom-datepicker-input"
   customInput={<CustomInput />}
   
    />       
                      </DatePickerWrapper>
    
  
              </Grid>
              <Grid item xs={12} sm={2}>
             
              <DatePickerWrapper sx={{ marginTop: 2 }}>
    <DatePicker
      label="Deadline"
      selected={task.deadline}
      onChange={(date) =>
        handleLevel1TaskChange(index, 'deadline', date)
      } 
      showYearDropdown
      showMonthDropdown
      
      minDate={start}
      maxDate={end}
      placeholderText="DD/MM/YYYY"
      dateFormat="dd/MM/yyyy" 
            className="custom-datepicker-input"
      customInput={<CustomInput2 />}
    />
  </DatePickerWrapper>

              
              </Grid>
              <Grid item xs={12} sm={12}>
              <TextField
                  label="Description"
                  fullWidth
                  multiline
                   rows={4}
                  value={task.description}
                  onChange={(e) => handleLevel1TaskChange(index, 'description', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} >
             
        <Button
          variant="contained"
          onClick={() => handleAddLevel2Task(index)}
          startIcon={<AddIcon />}
          disabled={task.name.trim() === ''}

        >
          Add Level 2 Task
        </Button>
     
                <Box display="flex" justifyContent="flex-end" mt={2}>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={task.name.trim() === ''}
                  onClick={() =>saveLevel1Tasks(index)}
                >
save       
         </Button>

</Box>

              </Grid>
              {task.level2Tasks.map((level2Task, level2Index) => (
                <Grid item xs={12} key={level2Index}>
                  <Accordion
                    sx={{ backgroundColor: '#E9ECEF', mt: 2 }}
                    elevation={0}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`level2-task-${index}-${level2Index}-content`}
                      id={`level2-task-${index}-${level2Index}-header`}
                    >
                        {missingLevel2Index && missingLevel2Index.level1Index === index + 1 && missingLevel2Index.level2Index === level2Index + 1 && (
            <Tooltip title="You need to write the Title">
  <ErrorOutlineIcon style={{ color: 'red', marginLeft: '8px' }} />    </Tooltip>

      )}
                      <Typography variant="subtitle2">
                      {`${index + 1}.${level2Index + 1}`} {level2Task.name ? `: ${level2Task.name}` : ''}

                      </Typography>
                      <IconButton
                        onClick={() => handleRemoveLevel2Task(index, level2Index)}
                        aria-label="remove task"
                                          sx={{ marginLeft: 'auto',marginRight: '20px' }}

                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Title"
                            fullWidth
                            value={level2Task.name}
                            required 
                            error={task.name === ''}
            helperText={task.name === '' ? 'Title is required' : ''} 
                            onChange={(e) =>
                              handleLevel2TaskChange(
                                index,
                                level2Index,
                                'name',
                                e.target.value
                              )
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            label="Percentage"
                            fullWidth
                            value={level2Task.percentage}
                            onChange={(e) =>
                              handleLevel2TaskChange(
                                index,
                                level2Index,
                                'percentage',
                                e.target.value
                              )
                            }
                            InputProps={{ inputProps: { min: 0, max: 100 } }}                  

                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            select
                            fullWidth
                            label="Assign Member"
                            value={level2Task.members}
                            onChange={(e) =>
                              handleLevel2TaskChange(
                                index,
                                level2Index,
                                'members',
                                e.target.value
                              )
                            }
                          >
                            {Team?.map((member) => (
                              <MenuItem key={member.id} value={member.id}>
                                {member.email}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                        <TextField
    select
    fullWidth
    label="Floor"
    name="floor"
    value={level2Task.floor}
    onChange={(e) =>
      handleLevel2TaskChange(index, level2Index, 'floor', e.target.value)
    }
    margin="normal"
    SelectProps={{
      multiple: true,
    }}
  >
    {Array.from({ length: floor }, (_, i) => (
      <MenuItem key={i} value={i}>
        Floor {i}
      </MenuItem>
    ))}
  </TextField>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                        <TextField
    select
    fullWidth
    label="Basement"
    name="basement"
    value={level2Task.basement}
    onChange={(e) =>
      handleLevel2TaskChange(index, level2Index, 'basement', e.target.value)
    }
    margin="normal"
    SelectProps={{
      multiple: true,
    }}
  >
    {Array.from({ length: base }, (_, i) => (
      <MenuItem key={i + 1} value={i + 1}>
        Basement {i + 1}
      </MenuItem>
    ))}
  </TextField>
                        </Grid>
                        <Grid item xs={12} sm={2}>

                        <DatePickerWrapper sx={{ marginTop: 2 }}>
    <DatePicker
      label="Start Date"
      selected={level2Task.startDate}
      onChange={(date) =>
        handleLevel2TaskChange(index, level2Index, 'startDate', date)
      }
      minDate={task.startDate}
      maxDate={task.deadline}
      showYearDropdown
      showMonthDropdown
      placeholderText="DD/MM/YYYY"
      dateFormat="dd/MM/yyyy"       className="custom-datepicker-input"
      customInput={<CustomInput />}
    />
  </DatePickerWrapper>
                    
                         
                        </Grid>
                        <Grid item xs={12} sm={2}>
                        <DatePickerWrapper sx={{ marginTop: 2 }}>
    <DatePicker
      label="Deadline"
      selected={level2Task.deadline}
      onChange={(date) =>
        handleLevel2TaskChange(index, level2Index, 'deadline', date)
      }
      showYearDropdown
      showMonthDropdown
      minDate={task.startDate}
      maxDate={task.deadline}
      placeholderText="DD/MM/YYYY"
      dateFormat="dd/MM/yyyy"     
        className="custom-datepicker-input"
      customInput={<CustomInput2 />}
    />
  </DatePickerWrapper>
                       
                        </Grid>
                        <Grid item xs={12} sm={12}>
              <TextField
                  label="Description"
                  fullWidth
                  multiline
                   rows={4}
                  value={level2Task.description}
                  onChange={(e) => handleLevel2TaskChange( index,
                    level2Index,
                    'description',
                    e.target.value)}
                />
              </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            disabled={level2Task.name.trim() === ''}

                            onClick={() =>
                              handleAddLevel3Task(index, level2Index)
                            }
                            startIcon={<AddIcon />}
                          >
                            Add Level 3 Task
                          </Button>
                        </Grid>
                        {level2Task.level3Tasks.map(
                          (level3Task, level3Index) => (
                            <Grid item xs={12} key={level3Index}>
                              <Accordion
                                sx={{ backgroundColor: '#DEE2E6', mt: 2 }}
                                elevation={0}
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls={`level3-task-${index}-${level2Index}-${level3Index}-content`}
                                  id={`level3-task-${index}-${level2Index}-${level3Index}-header`}
                                >
                                  {missingLevel3Index && missingLevel3Index.level1Index === index + 1 && missingLevel3Index.level2Index === level2Index + 1 && missingLevel3Index.level3Index === level3Index + 1 && (
          <Tooltip title="You need to write the Title">
    <ErrorOutlineIcon style={{ color: 'red', marginLeft: '8px' }} />    </Tooltip>

        )}
                            <Typography variant="body2">
  {`${index + 1}.${level2Index + 1}.${level3Index + 1}`} {level3Task.name ? `: ${level3Task.name}` : ''}
</Typography>

                                  <IconButton
                                    onClick={() =>
                                      handleRemoveLevel3Task(
                                        index,
                                        level2Index,
                                        level3Index
                                      )
                                    }
                                    aria-label="remove task"
                                                      sx={{ marginLeft: 'auto',marginRight: '20px' }}

                                  >
                                    <DeleteOutlineIcon />
                                  </IconButton>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                      <TextField
                                        label="Title"
                                        
                                        fullWidth
                                        value={level3Task.name}
                                        required 
                           
                                        error={task.name === ''}
                                        helperText={task.name === '' ? 'Title is required' : ''} 
                                        onChange={(e) =>
                                          handleLevel3TaskChange(
                                            index,
                                            level2Index,
                                            level3Index,
                                            'name',
                                            e.target.value
                                          )
                                        }
                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                      <TextField
                                        label="Percentage"
                                        fullWidth
                                        value={level3Task.percentage}
                                        minDate={level2Task.startDate}
                                        maxDate={level2Task.deadline}
                                        onChange={(e) =>
                                          handleLevel3TaskChange(
                                            index,
                                            level2Index,
                                            level3Index,
                                            'percentage',
                                            e.target.value
                                          )
                                        }
                                        InputProps={{ inputProps: { min: 0, max: 100 } }}                  

                                      />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                      <TextField
                                        select
                                        fullWidth
                                        label="Assign Member"
                                        value={level3Task.members}
                                        onChange={(e) =>
                                          handleLevel3TaskChange(
                                            index,
                                            level2Index,
                                            level3Index,
                                            'members',
                                            e.target.value
                                          )
                                        }
                                      >
                                        {Team?.map((member) => (
                                          <MenuItem key={member.id} value={member.id}>
                                            {member.email}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                    <TextField
                                      select
                                      fullWidth
                                      label="Floor"
                                      name="floor"
                                      value={level3Task.floor}
                                      onChange={(e) =>
                                        handleLevel3TaskChange(
                                          index,
                                          level2Index,
                                          level3Index,
                                          'floor',
                                          e.target.value
                                        )
                                      }
                                      margin="normal"
                                      SelectProps={{
                                        multiple: true,
                                      }}
                                    >
                                    {Array.from({ length: floor }, (_, i) => (
                                      <MenuItem key={i} value={i}>
                                        Floor {i}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={4}>
                                                                    <TextField
                                    select
                                    fullWidth
                                    label="Basement"
                                    name="basement"
                                    value={level3Task.basement}
                                    onChange={(e) =>
                                      handleLevel3TaskChange(
                                        index,
                                        level2Index,
                                        level3Index,
                                        'basement',
                                        e.target.value
                                      )
                                    }
                                    margin="normal"
                                    SelectProps={{
                                      multiple: true,
                                    }}
                                  >
                                    {Array.from({ length: base }, (_, i) => (
                                      <MenuItem key={i + 1} value={i + 1}>
                                        Basement {i + 1}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={2}>


                                                                      
                                                                    <DatePickerWrapper sx={{ marginTop: 2 }}>
                                    <DatePicker
                                      label="Start Date"
                                      selected={level3Task.startDate}
                                      onChange={(date) =>
                                        handleLevel3TaskChange(index, level2Index, level3Index, 'startDate', date)
                                      }
                                      showYearDropdown
                                      showMonthDropdown
                                      minDate={level2Task.startDate}
                                      maxDate={level2Task.deadline}
                                      placeholderText="DD/MM/YYYY"
                                      dateFormat="dd/MM/yyyy"       className="custom-datepicker-input"
                                      customInput={<CustomInput />}
                                    />
                                  </DatePickerWrapper>
                                                                
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={2}>
                                                                    <DatePickerWrapper sx={{ marginTop: 2 }}>
                                    <DatePicker
                                      label="Deadline"
                                      selected={level3Task.deadline}
                                      minDate={level2Task.startDate}
                                      maxDate={level2Task.deadline}
                                      onChange={(date) =>
                                        handleLevel3TaskChange(index, level2Index, level3Index, 'deadline', date)
                                      }
                                      showYearDropdown
                                      showMonthDropdown
                                      placeholderText="DD/MM/YYYY"
                                      dateFormat="dd/MM/yyyy"       className="custom-datepicker-input"
                                      customInput={<CustomInput2 />}
                                    />
                                  </DatePickerWrapper>
                                                                  
                                                                    
                                                                    </Grid>
                                                                    <Grid item xs={12} sm={12}>
                                              <TextField
                                                  label="Description"
                                                  fullWidth
                                                  multiline
                                                  rows={4}
                                                  value={level3Task.description}
                                                  onChange={(e) => handleLevel3TaskChange( index,
                                                    level2Index,
                                                    level3Index,
                                                    'description',
                                                    e.target.value)}
                                                />
                                              </Grid>

                                                                  </Grid>
                                                                </AccordionDetails>
                                                              </Accordion>
                                                            </Grid>
                                                          )
                                                        )}
                                                      </Grid>
                                                    </AccordionDetails>
                                                  </Accordion>
                                                </Grid>
                                              ))}
                                            </Grid>
                                          </AccordionDetails>
                                        </Accordion>
                                      ))}
                                      <Button
                                        variant="contained"
                                        onClick={handleAddLevel1Task}
                                        startIcon={<AddIcon />}
                                        sx={{mt:5 }}
                                      >
                                        Add Level 1 Task
                                      </Button>
                                      <Box display="flex" justifyContent="flex-end" mt={2}>
                                  <Button variant="contained" color="primary" onClick={handleFinish}>
                                  Save All And  Finish
                                  </Button>
                                </Box>

                                    </Box>
                                    <Snackbar
                                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                  open={snackbarOpen}
                                  autoHideDuration={6000}
                                  onClose={handleSnackbarClose}
                                >
                                  <SnackbarContent
                                    style={{
                                      backgroundColor: responseStatus === 200 ? '#4CAF50' : '#f44336',
                                    }}
                                    message={
                                      <span id="client-snackbar" style={{ display: 'flex', alignItems: 'center' }}>
                                        <CheckCircleIcon style={{ fontSize: 20, marginRight: '8px' }} />
                                        {snackbarMessage}
                                      </span>
                                    }
                                    action={[
                                      <IconButton key="close" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                                        <CloseIcon />
                                      </IconButton>,
                                    ]}
                                  />
                                </Snackbar>
                                </ThemeProvider>
                                  );
}
export default TaskForm;
