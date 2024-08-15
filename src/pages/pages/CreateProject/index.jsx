import React, { forwardRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CustomizedProgressBars from './loading';
import { loginSuccess } from '../../../features/reducers/authReducer';
import Select from '@mui/material/Select';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Snackbar from '@mui/material/Snackbar';
import MenuItem from '@mui/material/MenuItem';
import withAuth from '../../../features/reducers/withAuth';
const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} autoComplete='off' />;
});
CustomInput.displayName = 'CustomInputproject';

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

const Index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projectName, setProjectName] = useState('');
  const [departement, setDepartement] = useState([]); // State variable to hold selected department(s)
  const [date, setDate] = useState(null);
  const [date2, setDate2] = useState(null);
  const [date3, setDate3] = useState(null);
  const [description, setDescription] = useState('');
  const [lod, setLod] = useState('');
  const [loi, setLoi] = useState('');
  const [projectsPhase, setProjectsPhase] = useState('');
  const [projectwebsite, setProjectWebsite] = useState('');
  const [owner, setOwner] = useState('');
  const [projectSize, setProjectSize] = useState('');
  const [status, setStatus] = useState('');
  const [projectLang, setProjectLang] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');

  const [estimatedDuration, SetEstimatedDuration] = useState('');
  const usertoken = useSelector(loginSuccess);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('Project has been added');
  const [snackbarMessageError, setSnackbarMessageError] = useState('Error');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [logoFile, setLogoFile] = useState(null); // Initialize logoFile state with null
  const [membersList, setMembersList] = useState([]); // Define membersList state variable
  const [teamList, setTeamList] = useState([]); // Define membersList state variable
  const [selectedMembers, setSelectedMembers] = useState([]); // State variable to hold selected users
  const [selectedTeams, setSelectedTeams] = useState([]); 
  
  const [floor, setFloor] = useState('');
  const [base, setBase] = useState('');

  const [selectedImageUrl, setSelectedImageUrl] = useState(null);
  // Define state variables for discipline selection
  const [customDiscipline, setCustomDiscipline] = useState('');
  const [otherDiscipline, setOtherDiscipline] = useState(false); 
  const handleDepartementChange = (event) => {
    const selectedValue = event.target.value;
    const isOtherSelected = selectedValue.includes('Other');
    
    if (isOtherSelected) {
      setOtherDiscipline(true);
    } else {
      setOtherDiscipline(false);
      setDepartement(selectedValue);
    }
  };
  
  const handleCustomDisciplineChange = (event) => {
    setCustomDiscipline(event.target.value);
  };
  
  const addCustomDiscipline = () => {
    if (customDiscipline.trim() !== '') {
      setDepartement([...departement, customDiscipline]);
      setCustomDiscipline('');
      setOtherDiscipline(false); // Hide the custom discipline input field after adding
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file); 
  
    // Create a temporary URL for the selected image
    const imageUrl = URL.createObjectURL(file);
    setSelectedImageUrl(imageUrl);
  };
  
  const goBack = () => {
    router.back();
  };

  
  const sendDataToServer = async () => {

    setLoading(true);

    const departementString =departement.join('-');
    const formData = new FormData();
    const projectData = {
      projectName: projectName,
      Descipline: departementString,
      startdate: date,
      enddate: date2,
      description: description,
      estimatedDuration: estimatedDuration,
      lod: lod,
      loi: loi,
      projectwebsite: projectwebsite,
      owner: owner,
      progress: '0',
      country: country,
      projectlang: projectLang,
      project_company: company,
      status:status,
      projectsPhase:projectsPhase,
      Floor:floor,
      Base:base,

 
    };
    console.log(projectData);
   
    const teamIds = selectedTeams.map(team => team.id);
    const memberIds = selectedMembers.map(member => member.id);
    formData.append('project', new Blob([JSON.stringify(projectData)], { type: 'application/json' }));
    if (logoFile) {
      formData.append('projectLogo', logoFile);
    } else {
      // Create a Blob from the default image URL
      const defaultImageBlob = await fetch('/images/icons/Photo.png').then(res => res.blob());
      formData.append('projectLogo', defaultImageBlob, 'Photo.png');
    } 
     formData.append('selectedTeamId', selectedTeams); // Remove { type: 'application/json' }
    formData.append('additionalUserIds', selectedMembers);



      try {
     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/Addproject`, {
        method: 'POST',
        headers: {
          
         Authorization: `Bearer ${usertoken.payload.token}`,
         //  'Content-Type': 'multipart/form-data', Explicitly set the Content-Type
  
        },
        body: formData,
     });
      if (response.status === 200) {
        setShowSuccessMessage(true);
       setLoading(false);
         setProjectName('');
       setDepartement([]);
        setDate(null);
        setDate2(null);
       setDescription('');
        SetEstimatedDuration('');
        setLod('');
        setLoi('');
        setProjectWebsite('');
        setOwner('');
       setCountry('');
        setProjectLang('');
         setCompany('');
        setStatus('');
        setProjectsPhase('');
       setFloor('');
         setBase('');
        setSelectedImageUrl(null);
       setLogoFile(null);
       setSelectedMembers([]);
        setSelectedTeams([]);
       } else {
        setLoading(false);
         setShowErrorMessage(true);

        
        const errorMessage = await response.text();
        console.log('Error response from API:', errorMessage);
     }
     } catch (error) {
       setLoading(false);
       console.log('Server error:', response.statusText);
      const errorMessage = await response.text();
       console.log('Error response from API:', errorMessage);
      console.error('Error sending data to the API:', error.message);

       console.error('Error occurred:', error.message);
     }
   
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setShowSuccessMessage(false);
    setShowErrorMessage(false);

    
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/users-without-team`, {
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });
        if (!response.ok) {
          setSnackbarMessage('Something went wrong !!');
          setSnackbarOpen(true);
        }
        const data = await response.json();
     
        if (response.ok) {
          setMembersList(data);
       setLoading(false);
        }

      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    const fetchDataTeam = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/teams`, {
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
        });
        if (!response.ok) {
          setSnackbarMessage('Something went wrong !!');
          setSnackbarOpen(true);
        }
        const data = await response.json();
      
        if (response.ok) {
          setTeamList(data);
       setLoading(false);
        }

      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }; 
    fetchDataTeam();
    fetchData();
  }, [usertoken]);
  return (
    <ThemeProvider theme={theme}>
      {loading ? (
        <CustomizedProgressBars />
      ) : (
        <>
          <DatePickerWrapper>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, fontSize: '32px', color: '#202224', marginBottom: '20px' }}>
              Project
            </Typography>
            <Card sx={{ padding: 10 }}>
              <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right' }}>
                <Button variant="contained" color="primary" onClick={goBack} sx={{ background: '#6226EF' }}>Back</Button>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ marginRight: '20px' }}>
                {selectedImageUrl ? (
  <Image
    src={selectedImageUrl}
    alt="Selected Image"
    height={192}
    width={192}
  />
) : (
  <Image
    src={'/images/icons/Photo.png'}
    alt="Placeholder Image"
    height={192}
    width={192}
  />
)}

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
                    rows={10}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ backgroundColor: '#F5F6FA', border: 'none', width: '223px' }}
                  />
                   <Typography variant="body1" gutterBottom>Team *</Typography>

              <Select fullWidth multiple value={selectedTeams} onChange={(e) => setSelectedTeams(e.target.value)} >
                  {teamList.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.teamName}
                    </MenuItem>
                  ))}   </Select>
            <Typography variant="body1" gutterBottom>Members</Typography>
                <Select fullWidth multiple value={selectedMembers} onChange={(e) => setSelectedMembers(e.target.value)}>
                  {membersList.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {member.first_name}
                    </MenuItem>
                  ))}
                </Select>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ padding: '20px' }}>
                      <Typography variant="body1" gutterBottom>Project Name *</Typography>
                      <TextField
                        fullWidth
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA', borderColor: '#F5F6FA' }}
                      />
       <Box sx={{ display: 'flex', gap: '16px' }}>
  <Box>
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
  </Box>
  <Box>
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
  </Box>
</Box>



<Typography variant="body1" gutterBottom>Country</Typography>
                      <TextField
                        fullWidth
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      />                 
                      
                      
<Typography variant="body1" gutterBottom>Company</Typography>
                      <TextField
                        fullWidth
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      />    
                      <Typography variant="body1" gutterBottom>Discipline *</Typography>
                      <Select
  fullWidth
  multiple
  value={departement}
  onChange={handleDepartementChange}
  sx={{ backgroundColor: '#F5F6FA' }}
>
{departement.map((discipline) => (
    (discipline !== 'Fluids' && discipline !== 'Electrical') && (
      <MenuItem key={discipline} value={discipline}>
        {discipline}
      </MenuItem>
    )
  ))}  <MenuItem value='Fluids'>Fluids</MenuItem>
  <MenuItem value='Electrical'>Electrical</MenuItem>
  <MenuItem value='Other'>Other</MenuItem>

  {/* Custom disciplines */}
 
</Select>

{/* Show custom discipline input field if Other is selected */}
{otherDiscipline && (
  <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
    <TextField
      fullWidth
      value={customDiscipline}
      onChange={handleCustomDisciplineChange}
      label="Custom Discipline"
      sx={{ backgroundColor: '#F5F6FA' }}
    />
    <Button onClick={addCustomDiscipline}>Add</Button>
  </Box>
)}




        
 
                     
                      <Typography variant="body1" gutterBottom>Status</Typography>
                      <Select
                        fullWidth
                        
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      >
                        <MenuItem value='ACTIVE'>Active</MenuItem>
                        <MenuItem value='Pending'>Pending</MenuItem>
                        <MenuItem value='Inactive'>Inactive</MenuItem>
             
                      </Select>
                      <Typography variant="body1" gutterBottom>Basement</Typography>
                      <TextField
                        fullWidth
                        value={base}
                        onChange={(e) => setBase(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                        type="number"
                        inputProps={{ min: 0 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ padding: '20px' }}>
                    <Typography variant="body1" gutterBottom>Owner</Typography>
                      <TextField
                        fullWidth
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      />
                  
                  
                      <Typography variant="body1" gutterBottom>Estimated Duration</Typography>
                      <TextField
                        fullWidth
                        value={estimatedDuration}
                        onChange={(e) => SetEstimatedDuration(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      /> 
                
                    
                    <Typography variant="body1" gutterBottom>Project Website</Typography>
                      <TextField
                        fullWidth
                        value={projectwebsite}
                        onChange={(e) => setProjectWebsite(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      />
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
                      <Typography variant="body1" gutterBottom>Project Phase</Typography>
                      <TextField
                        fullWidth
                        value={projectsPhase}
                        onChange={(e) => setProjectsPhase(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      />
                             <Typography variant="body1" gutterBottom>Main Floor</Typography>
                      <TextField
                        fullWidth
                        value={floor}
                        onChange={(e) => setFloor(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                        type="number"
                        inputProps={{ min: 0 }}
                      />
                      {/* <Typography variant="body1" gutterBottom>Client</Typography>
                      <TextField
                        fullWidth
                        value={client}
                        onChange={(e) => setClient(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      /> */}
                      {/* <Typography variant="body1" gutterBottom>Project Size</Typography>
                      <TextField
                        fullWidth
                        value={projectSize}
                        onChange={(e) => setProjectSize(e.target.value)}
                        sx={{ backgroundColor: '#F5F6FA' }}
                      /> */}
                    
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>
            <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', marginTop: '15px' }}>
              <Button variant="contained" color="primary" onClick={sendDataToServer} sx={{ background: '#6226EF' }}>+ Add Project</Button>
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

 export default withAuth(Index);
