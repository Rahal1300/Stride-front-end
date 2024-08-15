import React, { forwardRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CustomizedProgressBars from './loading';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTranslation } from 'react-i18next';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import withAuth from '../../../features/reducers/withAuth';
const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />;
});
CustomInput.displayName = 'CustomInputeditproject';

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

const EditProject = () => {
  const router = useRouter();
  const { id } = router.query; // Accessing project ID from query
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);





  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // State variable to hold selected image
  const usertoken = useSelector(loginSuccess);
  const [projectName, setProjectName] = useState('');
  const [departement, setDepartement] = useState([]); // State variable to hold selected department(s)

  // Update the handler function to handle multiple selections

    const [date, setDate] = useState(null);
  const [date2, setDate2] = useState(null);
  const [date3, setDate3] = useState(null);
  const [description, setDescription] = useState('');
  const [lod, setLod] = useState('');
  const [loi, setLoi] = useState('');
  const [projectsManager, setProjectsManager] = useState('');
  const [client, setClient] = useState('');
  const [projectwebsite, setProjectWebsite] = useState('');
  const [owner, setOwner] = useState('');
  const [progress, setProgress] = useState('');
  const [projectSize, setProjectSize] = useState('');
  const [status, setStatus] = useState('');
  const [projectLang, setProjectLang] = useState('');
  const [company, setCompany] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [country, setCountry] = useState('');
  const { t } = useTranslation(); // Hook to access translations


  const [assignedTeam, setAssignedTeam] = useState('');
  const [discipline, setDiscipline] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('Project has been updated');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [snackbarMessageError, setSnackbarMessageError] = useState('Error');
  const handleDepartementChange = (event) => {
    setDepartement(event.target.value); // event.target.value will be an array of selected values
  };
  const sendDataToServer = async () => {
    const departementString = departement.join('-');
    const formData = new FormData();
    const projectData = {
      projectName: projectName,
      departement: departementString,
      startdate: date,
      enddate: date2,
      description: description,
      estimatedDuration: estimatedDuration,
      location: '',
      lod: lod,
      loi: loi,
      projectmanager: projectsManager,
      client: client,
      projectwebsite: projectwebsite,
      owner: owner,
      progress: '0',
      country: country,
      projectsize: projectSize,
      extend_to: date3,
      projectlang: projectLang,
      company: company,
      status:'Active'
    };
    // Append project data as JSON
   //formData.append('project', new Blob([JSON.stringify(projectData)], { type: 'application/json' }));
    //formData.append('imageFile', logoFile);
   //// formData.append('projectLogo', logoFile, 'hi');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/update/${id}`, {
        method: 'PUT',
        headers: {
          
          Authorization: `Bearer ${usertoken.payload.token}`,
        'Content-Type': 'application/json', 
  
        },
        body: JSON.stringify(projectData)
      });
      if (response.status === 200) {
        // Request was successful
        setShowSuccessMessage(true);
        setLoading(false);
  
      } else {
        // Handle error responses
        setLoading(false);
  
        console.error('Server error:', response.statusText);
      }
    } catch (error) {
      setLoading(false);
  
      console.error('Error occurred:', error.message);
    }
   
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        const data = await response.json();
        setProject(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);  };
  const goBack = () => {
    router.back();
  };
  const handleUpdate = () => {
  };

  if (loading) {
    return <CustomizedProgressBars />;
  }

  if (error) {
    return (
      <Typography variant="body1" color="error">
        {error}
      </Typography>
    );
  }

  if (!project) {
    return <Typography variant="body1">Project not found</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <CustomizedProgressBars />
      ) : (
        <>
          <DatePickerWrapper>
            <Typography variant="h3" component="h1" sx={{ fontFamily: 'Arial', fontWeight: 700, fontSize: '32px', color: '#202224', marginBottom: '20px' }}>
              Project
            </Typography>
            <Card sx={{ padding: 10 }}>
              <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right' }}>
                <Button variant="contained" color="primary" onClick={goBack} sx={{ background: '#6226EF' }}>Back</Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ marginRight: '20px' }}>
                  <Image
                    src={'/images/icons/Photo.png'}
                    alt="Selected Image"
                    height={192}
                    width={192}
                  />
<Typography variant="body1" sx={{ color: '#4379EE', fontWeight: 500, marginRight: '20px', marginBottom: '60px', marginLeft: '50px', cursor: 'pointer' }}>
<label htmlFor="image-upload">
       Project Picture
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </Typography>
                  <Typography variant="body1" gutterBottom>Description</Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ backgroundColor: '#F5F6FA', border: 'none', width: '223px' }}
                  />
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ padding: '20px' }}>
                      <Typography variant="body1" gutterBottom>Project Name</Typography>
                      <TextField
                        fullWidth
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA', borderColor: '#F5F6FA' }}
                      />
                      <Typography variant="body1" gutterBottom>Department</Typography>
                      <Select
                        fullWidth
                        multiple
                        value={departement}
                        onChange={handleDepartementChange} 
                        sx={{ backgroundColor: '#F5F6FA' }}
                      >
                        <MenuItem value='Structure'>Structure</MenuItem>
                        <MenuItem value='Architecture'>Architecture</MenuItem>
                        <MenuItem value='MEP'>MEP</MenuItem>
                        <MenuItem value='Electrical'>Electrical</MenuItem>
                      </Select>
                      <Typography variant="body1" gutterBottom>Start date</Typography>
                      <DatePicker
                        showYearDropdown
                        showMonthDropdown
                        placeholderText="MM-DD-YYYY"
                        className="custom-datepicker-input"
                        selected={date}
                        onChange={(date) => setDate(date)}
                        customInput={<CustomInput />}
                      />
                      <Typography variant="body1" gutterBottom>End date</Typography>
                      <DatePicker
                        showYearDropdown
                        showMonthDropdown
                        placeholderText="MM-DD-YYYY"
                        className="custom-datepicker-input"
                        selected={date2}
                        onChange={(date) => setDate2(date)}
                        customInput={<CustomInput />}
                      />
                      <Typography variant="body1" gutterBottom>Extend to</Typography>
                      <DatePicker
                        showYearDropdown
                        showMonthDropdown
                        placeholderText="MM-DD-YYYY"
                        className="custom-datepicker-input"
                        selected={date3}
                        onChange={(date) => setDate3(date)}
                        customInput={<CustomInput />}
                      />
                      <Typography variant="body1" gutterBottom>Estimated Duration</Typography>
                      <TextField
                        fullWidth
                        value={estimatedDuration}
                        onChange={(e) => setEstimatedDuration(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      />
                      <Typography variant="body1" gutterBottom>Project language</Typography>
                      <Select
                        fullWidth
                        
                        value={projectLang}
                        onChange={(e) => setProjectLang(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      >
                        <MenuItem value='French'>French</MenuItem>
                        <MenuItem value='English'>English</MenuItem>
                        <MenuItem value='Arabic'>Arabic</MenuItem>
                        <MenuItem value='Other'>Other</MenuItem>
                      </Select>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ padding: '20px' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="body1" gutterBottom>LOD</Typography>
                          <Select
                            fullWidth
                            value={lod}
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
                          </Select>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body1" gutterBottom>LOI</Typography>
                          <Select
                            fullWidth
                            value={loi}
                            onChange={(e) => setLoi(e.target.value)}
                            id='form-layouts-separator-select'
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
                      </Grid>
                      <Typography variant="body1" gutterBottom>Project Manager</Typography>
                      <TextField
                        fullWidth
                        value={projectsManager}
                        onChange={(e) => setProjectsManager(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      />
                      <Typography variant="body1" gutterBottom>Client</Typography>
                      <TextField
                        fullWidth
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      />
                      <Typography variant="body1" gutterBottom>Project Size</Typography>
                      <TextField
                        fullWidth
                        value={projectSize}
                        onChange={(e) => setProjectSize(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      />
                      <Typography variant="body1" gutterBottom>Project Website</Typography>
                      <TextField
                        fullWidth
                        value={projectwebsite}
                        onChange={(e) => setProjectWebsite(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      />
                      <Typography variant="body1" gutterBottom>Owner</Typography>
                      <TextField
                        fullWidth
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      />
                      <Typography variant="body1" gutterBottom>Country</Typography>
                      <TextField
                        fullWidth
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>
            <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '15px' }}>
              <Button variant="contained" color="primary" onClick={sendDataToServer} sx={{ background: '#6226EF' }}>+ Update Project</Button>
            </Box>
          </DatePickerWrapper>
          <Snackbar
  open={showSuccessMessage} // Use showSuccessMessage state variable here
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
  message={snackbarMessage}
/>

<Snackbar
  open={showErrorMessage} // Use showErrorMessage state variable here
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
  message={snackbarMessageError}
/>

        </>
      )}
    </ThemeProvider>
  );
};

export default withAuth(EditProject);
