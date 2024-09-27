import React, { useState,useEffect  } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TaskForm from './FormTask'; 
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import SnackbarContent from '@mui/material/SnackbarContent';
import Alert from '@mui/material/Alert';
import { generateTaskTemplate } from './GenerateTaskTemplate';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import { format } from 'date-fns'; 
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Stack from '@mui/material/Stack';
import { loginSuccess } from '../../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import TaskTable from './TaskTable';
function getStatusColor(status) {
    switch (status) {
      case 'Active':
        return '#00B69B';
      case 'Inactive':
        return '#6226EF';
     
      default:
        return '#FFFFFF'; 
    }
  }

  const customTheme = createTheme({
    components: {
      MuiAvatar: {
          styleOverrides: {
            root: {
              border: '2px solid #6226EF',
            },
          colorDefault: {
            color: '#6226EF',
            backgroundColor: '#E2EAF8',
          },
          rounded: {
            borderRadius: 5,
          }
        }
      }
    }
  });
  
  function Tasks({ descipline, progress, base, floornb ,Team ,id,documents,remain, start, end ,onUpdate  }) {
    const [open, setOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const userToken = useSelector(loginSuccess);
    const [incrementValue, setIncrementValue] = useState(0);
    const [loading, setLoading] = useState(false); 
    const [onAddTask, setOnAddTask ] = useState(false); 
    const [selectedDocumentIds, setSelectedDocumentIds] = useState([]); 
    const [selectedDocumentIdsMap, setSelectedDocumentIdsMap] = useState({});
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [downloadClicked, setDownloadClicked] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleSnackbarClose = () => setSnackbarOpen(false);
    useEffect(() => {
      if (id || onAddTask) { 
        setOnAddTask(false);
      }
      }, [id,onAddTask]);
      const handleDownloadTemplate = () => {
        generateTaskTemplate();
      };
      
  
      const base64Url = userToken?.payload?.token?.split('.')[1];
      let isAdmin = false;
      let isTeamManager = false;
      if (base64Url) {
        try {
          const base64 = base64Url.replace('-', '+').replace('_', '/');
          const decodedToken = JSON.parse(window.atob(base64));

          isAdmin = decodedToken.role === 'Admin';
          isTeamManager =   isTeamManager = decodedToken.cr === 'TeamManager';
        } catch (error) {
          console.error('Error decoding token:', error.message);
        }
      }
    
      const shouldShowModifyIcon = isAdmin || isTeamManager;

      
      
  
    

      
 const userrole = useSelector(state => state.Role); 
 const  cr  = useSelector(state => state.Cr); 
 const Owner = userrole === 'Subscriber' && cr === 'Owner';
 const TeamManagerandOwner = userrole === 'Subscriber' &&  cr === 'TeamManager';
 const Manager= userrole === 'User' &&  cr === 'TeamManager';
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button onClick={handleDownloadTemplate}>Download Excel Template</Button>
   
     


     
        {Owner || Manager || TeamManagerandOwner ? (
        <Button
          variant="contained"
          onClick={handleOpen}
          sx={{
            marginTop: '20px',
            backgroundColor: '#E2EAF8',
            '&:hover': {
              backgroundColor: '#E2EAF8',
              opacity: 0.9,
            },
            color: '#202224',
            marginBottom: '10px',
            borderRadius: '10',
          }}
        >
          Create a new Task
        </Button>
 

      ):(null)}
        <Divider sx={{ borderColor: 'gray', borderWidth: '1px', width: '100%', marginBottom: '20px' }} />
  
        {loading ? (
        <p>Loading...</p>
      ) : (

        <ThemeProvider theme={customTheme}>
<TaskTable documents={documents}  id={id} onUpdate ={onUpdate}  base={base} floor={floornb} />
        </ThemeProvider>

)}
<Snackbar open={uploadSuccess} autoHideDuration={6000} onClose={() => setUploadSuccess(false)}>
  <SnackbarContent sx={{ backgroundColor: '#00B69B' }} message="Documents uploaded successfully" />
</Snackbar>

<Snackbar open={uploadError} autoHideDuration={6000} onClose={() => setUploadError(false)}>
  <SnackbarContent sx={{ backgroundColor: '#EF3826' }} message="Error uploading documents" />
</Snackbar>

<Snackbar open={uploadLoading} autoHideDuration={null}>
  <SnackbarContent sx={{ backgroundColor: '#6226EF' }} message="Uploading documents..." />
</Snackbar>

<Snackbar
        open={downloadClicked}
        autoHideDuration={5000} 
        onClose={() => setDownloadClicked(false)}
      >
        <Alert severity="info" sx={{ marginTop: '20px' }}>
          No documents available for download.
        </Alert>
      </Snackbar>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-Task-modal-title"
        aria-describedby="create-Task-modal-description"
      >
        <TaskForm onClose={handleClose} discipline={descipline} progress={progress}  base={base} floor={floornb} Team={Team} id={id} onAddTask={setOnAddTask} documents={documents} remain={remain} start={start} end={end} />
      </Modal>
    </Box>
  );
}

export default Tasks;
