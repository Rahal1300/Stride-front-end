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
  SnackbarContent,Input
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
import * as XLSX from 'xlsx';

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

/* 11/11/2024*/
const downloadTemplate = () => {
  const link = document.createElement('a');
  // Adjust this path to match your file location
  link.href = '/assets/TaskTemplate.xlsx';
  link.download = 'TaskTemplate.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }
  
    // Check if the file name matches exactly
    if (file.name !== 'TemplateExcel.xlsx') {
      alert('Please use the provided template file (TemplateExcel.xlsx). Other files are not accepted.');
      event.target.value = ''; // Reset file input
      return;
    }
    if (file) {
      readExcelAndFormatTasks(file, id);
    } else {
      console.error("No file selected");
    }
  };

  const readExcelAndFormatTasks = (file, id) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const formattedTasks = formatTasksFromExcel(jsonData, id);
      console.log('Formatted Tasks:', formattedTasks);

      // Send the formatted tasks to your API
      sendTasksToAPI(formattedTasks);
    };

    reader.readAsArrayBuffer(file);
  };

  const formatTasksFromExcel = (data, id) => {
    const level1Tasks = [];
    const taskMap = {};
    let lastParentId = null;
    let lastSubtaskId = null; 
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    console.log("Processing row:", row); // Log the entire row for debugging

    const parentId = row[0]; // Column A: Parent Task ID
    const subtaskId = row[1]; // Column B: Subtask ID
    const subSubtaskId = row[2]; // Column C: Sub-subtask ID
    const taskName = row[4]; // Column E: Task Name

    // Log the values of interest
    console.log("parentId value:", parentId);
    console.log("subtaskId value:", subtaskId);
    console.log("subSubtaskId value:", subSubtaskId);
    console.log("taskName value:", taskName);

    // Skip empty rows or rows without task names
    if (!taskName) continue;

    // Determine the level based on the parentId
    let currentLevel = 1; // Default to level 1
    if (parentId && typeof parentId === 'string') {
      currentLevel = parentId.split('.').length; // Count the number of dots to determine the level
      lastParentId = parentId; // Update last valid parent ID
    } else if (subtaskId && typeof subtaskId === 'string') {
      currentLevel = subtaskId.split('.').length; // If parentId is empty, check subtaskId
      lastSubtaskId = subtaskId; // Update last valid subtask ID
    } else if (subSubtaskId && typeof subSubtaskId === 'string') {
      currentLevel = subSubtaskId.split('.').length; // If subtaskId is empty, check subSubtaskId
    }

    if (currentLevel === 1) {
      // Level 1 Task
      const level1Task = { 
        parentTaskName: taskName,
        parentTaskWeight: null,
        parentTaskFloor: "",
        parentTaskBasement: "",
        parentTaskStartDate: "",
        parentTaskDeadline: "",
        description: "",
        assignedUserId: "",
        subtasks: []
      };
      level1Tasks.push(level1Task);
      taskMap[parentId] = level1Task; // Store reference by ID
      lastParentId = parentId; // Update last valid parent ID
    } else if (currentLevel === 2) {
      // Level 2 Task (Subtask)
      const level2Task = { 
        name: taskName,
        weight: null,
        floor: "",
        basement: "",
        startDate: "",
        deadline: "",
        description: "",
        assignedUserId: "",
        subtasks: []
      };
      if (taskMap[lastParentId]) {
        taskMap[lastParentId].subtasks.push(level2Task);
        taskMap[subtaskId] = level2Task; // Store reference by ID
        lastSubtaskId = subtaskId; // Update last valid subtask ID
      } else {
        console.error("Parent task not found for subtask:", subtaskId);
      }
    } else if (currentLevel === 3) {
      // Level 3 Task (Sub-subtask)
      const level3Task = { 
        name: taskName,
        weight: null,
        floor: "",
        basement: "",
        startDate: "",
        deadline: "",
        description: "",
        assignedUserId: "",
        subtasks: []
      };
      if (taskMap[lastSubtaskId]) { // Use lastSubtaskId to find the parent for sub-subtask
        taskMap[lastSubtaskId].subtasks.push(level3Task);
      } else {
        console.error("Parent subtask not found for sub-subtask:", subSubtaskId);
      }
    }
   
  }
  

  

   

    return {
      projectId: id, // Use the passed project ID
      tasks: level1Tasks,
    };
  };

  const sendTasksToAPI = (formattedTasks) => {
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
          console.log('Task saved successfully');
        } else {
          console.error('Error saving task');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  
 


const formatDataToTasks = (data) => {
    const tasks = [];
    const taskMap = {};

    data.forEach(row => {
        if (row.Level === "Task") {
            const task = {
                parentTaskName: row['Task Title'] || '',
                parentTaskWeight: row['Percentage'] ? parseInt(row['Percentage'], 10) : null,
                parentTaskFloor: row['Floor'] || '',
                parentTaskBasement: row['Basement'] || '',
                parentTaskStartDate: row['Start Date'] || '',
                parentTaskDeadline: row['Deadline'] || '',
                description: row['Description'] || '',
                assignedUserId: row['Assigned Member'] || '',
                subtasks: []
            };
            tasks.push(task);
            taskMap[row['Task Title']] = task; // Map task title to task object
        } else if (row.Level === "Subtask") {
            const subtask = {
                name: row['Subtask Title'] || '',
                weight: row['Subtask Percentage'] ? parseInt(row['Subtask Percentage'], 10) : null,
                floor: row['Subtask Floor'] || '',
                basement: row['Subtask Basement'] || '',
                startDate: row['Subtask Start Date'] || '',
                deadline: row['Subtask Deadline'] || '',
                description: row['Subtask Description'] || '',
                assignedUserId: row['Subtask Assigned Member'] || '',
                subtasks: [] // Initialize for potential nested subtasks
            };

            // Find the parent task and add the subtask to it
            const parentTask = taskMap[row['Task Title']];
            if (parentTask) {
                parentTask.subtasks.push(subtask);
            }
        }
    });

            return {
                projectId: id, // Pass the project ID from props
                tasks: tasks
            };
};

const sendTaskRequest = async (taskRequest) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/tasks/createTasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userToken.payload.token}`,
            },
            body: JSON.stringify(taskRequest),
        });

        if (response.ok) {
            setSnackbarMessage('Tasks saved successfully');
            setResponseStatus(response.status);
            setSnackbarOpen(true);
        } else {
            setSnackbarMessage('Error saving tasks');
            setResponseStatus(response.status);
            setSnackbarOpen(true);
        }
    } catch (error) {
        console.error('Error:', error);
        setSnackbarMessage('Error saving tasks');
        setResponseStatus(null);
        setSnackbarOpen(true);
    }
};


//**/ */
  

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
     sx={{ backgroundColor: '#f0f0f0',
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
  {/* START of level 2 TASK */}

              {task.level2Tasks.map((level2Task, level2Index) => (
                <Grid item xs={12} key={level2Index}>
                  <Accordion
                    sx={{backgroundColor: '#d0d0d0',mt: 2 }}
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

        {/* Start of level 3 TASK*/}
              {level2Task.level3Tasks.map(
                          (level3Task, level3Index) => (
                            <Grid item xs={12} key={level3Index}>
                              <Accordion
                                sx={{  backgroundColor:'#a0a0a0',mt: 2 }}
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
        {/* END OF LEVEL 3 TASK*/}

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

                                                      </Grid>
                                                    </AccordionDetails>
                                                  </Accordion>
                                                </Grid>
                                              ))}
{/* END of level 2 TASK */}

              <Grid item xs={12} >

        <Button
          variant="contained"
          onClick={() => handleAddLevel2Task(index)}
          startIcon={<AddIcon />}
          disabled={task.name.trim() === ''}

        >
          Add Level 2 Task
        </Button>
{/*  SAVE BUTTON FOR SINGLE TASK*/}
   {/*             <Box display="flex" justifyContent="flex-end" mt={2}>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled={task.name.trim() === ''}
                  onClick={() =>saveLevel1Tasks(index)}
                >
Save
         </Button>

</Box>*/}
{/*  SAVE BUTTON FOR SINGLE TASK*/}

              </Grid>

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
                                      <Box sx={{ 
                                            display: 'flex', 
                                            gap: 2,  // Creates equal spacing between elements
                                            alignItems: 'center',
                                            mt: 2  // Adds margin top
                                          }}>
                                      <Button 
                                        variant="contained" 
                                        color="primary" 
                                        onClick={handleFinish}
                                        sx={{
                                          height: '44px',
                                          textTransform: 'none',
                                        }}
                                      >
                                        Save All And Finish
                                      </Button>

                                      <Input 
                                        type="file" 
                                        accept=".xlsx, .xls" 
                                        onChange={handleFileChange}  
                                        sx={{
                                          color: 'white',
                                          height: '44px',
                                          textTransform: 'none',
                                          background: '#6226EF',
                                          '&:hover': {
                                            background: '#6226EF',
                                          },
                                          flex: 1  // Takes up remaining space
                                        }}
                                      />

                                      <Button
                                        type="submit"
                                        onClick={downloadTemplate}
                                        sx={{
                                          color: 'white',
                                          height: '44px',
                                          textTransform: 'none',
                                          background: '#6226EF',
                                          '&:hover': {
                                            background: '#6226EF',
                                          },
                                          minWidth: '150px'  // Fixed width instead of percentage
                                        }}
                                      >
                                        + Download Template
                                      </Button>
                                    </Box>
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
