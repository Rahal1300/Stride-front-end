import React, { forwardRef, useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import Alert from 'react-bootstrap/Alert';
import DatePicker from 'react-datepicker';
import EyeOutline from 'mdi-material-ui/EyeOutline';
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline';
import AlertOutline from 'mdi-material-ui/AlertOutline';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import CountrySelect from './Components/country';
import { useTheme } from '@mui/material/styles';


import Chip from '@mui/material/Chip';

import { loginSuccess } from '../../../../features/reducers/authReducer'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
const Img = styled('img')(({ theme }) => ({
  height: '10rem',
  borderRadius: theme.shape.borderRadius,
}));

const CustomInput = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Start Date' autoComplete='off' />;
});
CustomInput.displayName = 'CustomInput';

const CustomInput2 = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='End Date' autoComplete='off' />;
});
CustomInput2.displayName = 'CustomInput2';

const CustomInput3 = forwardRef((props, ref) => {
  return <TextField fullWidth {...props} inputRef={ref} label='Extend to' autoComplete='off' />;
});
CustomInput3.displayName = 'CustomInput3';

function valuetext(value) {
  return `${value}°C`;
}
const names = [
  'Structure',
  'Architecture',
  'MEP',
  'Electrical',

];

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
const Insert = ({ }) => {
  // const Insert = ({ formData, setFormData, handleNext }) => {

  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };




  const { t } = useTranslation(); // Hook to access translations
  const user = useSelector(loginSuccess);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const customColor = '#fdede1';
  const [show, setShow] = useState(true);
  const customStyle = {
    backgroundColor: customColor,
    borderColor: customColor,
    color: '#e8a914', // You may want to adjust the text color for better visibility
  };
  const [imageUrl, setImageUrl] = useState('/images/cards/analog-clock.jpg'); // Default image URL
  const [language, setLanguage] = useState('');
  const [otherLanguage, setOtherLanguage] = useState('');

  const [date, setDate] = useState(null);
  const [date2, setDate2] = useState(null);
  const [date3, setDate3] = useState(null);
  const [projectLang, setProjectLang] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState('/images/cards/analog-clock.jpg');
const [logoFile, setLogoFile] = useState(null);
const handleLanguageChange = (event) => {
  const {
    target: { value },
  } = event;

  setLanguage(value);
  // If "Other" is selected, set project_lang to the value of otherLanguage
  setProjectLang(value === 'other' ? otherLanguage : value);
};

  const handleOtherLanguageChange = (event) => {
    setOtherLanguage(event.target.value);

    setProjectLang( otherLanguage = event.target.value);

  };

  const handleReset = () => {
    // Reset the logo URL to an empty string or the default logo URL
    setLogoUrl('/images/cards/analog-clock.jpg');
    setLogoFileError(false);

  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      setSelectedFile(file);
      SetImgError(true);

      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
    else {
      SetImgError(false);

    }
   
  };
  const [logoFileError, setLogoFileError] = useState(false);
  const [imgError, SetImgError] = useState(false);

  const handleResetimg = () => {
    // Reset the image URL to the default image or an empty string
    setImageUrl('/images/cards/analog-clock.jpg');
    SetImgError(false);

  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      setLogoFile(file);
        // Reset the error when a file is selected
        setLogoFileError(true);

      const reader = new FileReader();
      reader.onload = () => {
        setLogoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
    else {
      setLogoFileError(false);

    }
   
  };
  const handleNameChange = (event) => {
    setFormData({ ...formData, name: event.target.value });
  };

  const handleNextClick = () => {
    // Validate the data if needed
    handleNext();
  };



  
  const usertoken = useSelector(loginSuccess);

const [projectName, setProjectName] = useState('');
const [description, setDescription] = useState('');
const [loi, setLoi] = useState('');
const [lod, setLod] = useState('');
const [owner, setOwner] = useState('');
const [progress, setProgress] = useState(0);
const [selectedCountry, setSelectedCountry] = useState(null);
const handleCountrySelection = (country) => {
  setSelectedCountry(country);
};
const [projectSize, setProjectSize] = useState(0);
const [status, setStatus] = useState('');
const [company, setCompany] = useState('');
const [client, setClient] = useState('');

const [estimatedDuration, SetEstimatedDuration] = useState('');
const [formSubmitted, setFormSubmitted] = useState(false);
const [projectwebsite, setProjectwebsite] = useState('');
const [projectsManager, setProjectsManager] = useState('');

const [departement, setDepartement] = useState('');
const [formSubmittedSuccessfully, setFormSubmittedSuccessfully] = useState(false);
const [showSuccessMessage, setShowSuccessMessage] = useState(false);
const handleRefresh = () => {


    window.location.reload();
 
};
useEffect(() => {
  if (showSuccessMessage) {
    const timeoutId = setTimeout(() => {
      setShowSuccessMessage(false);
      handleRefresh();
    }, 2000);

    // Clear the timeout if the component unmounts or if showSuccessMessage becomes false
    return () => clearTimeout(timeoutId);
  }
}, [showSuccessMessage]);
const handleFormSubmit = (e) => {
  e.preventDefault();
  setFormSubmitted(true);

  // Validate and submit the form data
  if (validateFormData()) {
    sendDataToServer();
    setFormSubmittedSuccessfully(true); // Set success state

  }

};
const validateFormData = () => {
  // Add your validation logic here
  // For example, check if required fields are filled out
  return projectName && selectedCountry && description && owner && progress && selectedFile && logoFile !== null;
};
const handleChangedepartement  = (event) => {
  const {
    target: { value },
  } = event;

  // Update the departement state with the selected value
  setDepartement(value);

  setPersonName(
    // On autofill we get a stringified value.
    typeof value === 'string' ? value.split(',') : value,
  );
};

const sendDataToServer = async () => {
  const departementString = departement.join('-');

  const formData = new FormData();
  const countryLabel = selectedCountry ? selectedCountry.label : '';
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
    progress: progress, 
    country: countryLabel, 
    projectsize: projectSize, 
    extend_to: date3, 
    status:status, 
    projectlang: projectLang,
    company:company,
  };
  // Append project data as JSON
  formData.append('project', new Blob([JSON.stringify(projectData)], { type: 'application/json' }));

  // Append the project photo file
  if (selectedFile) {
    formData.append('imageFile', selectedFile, selectedFile.name);
   }

  // // Append the project logo file
   if (logoFile) {
    formData.append('projectLogo', logoFile, logoFile.name);
   }


  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/AddProject`, {
      method: 'POST',
      headers: {
        
        Authorization: `Bearer ${usertoken.payload.token}`,
       //  'Content-Type': 'multipart/form-data', Explicitly set the Content-Type

      },
      body: formData,
    });

    if (response.status === 200) {
      // Request was successful
      setShowSuccessMessage(true);
    } else {
      // Handle error responses
      console.error('Server error:', response.statusText);
    }
  } catch (error) {
    console.error('Error occurred:', error.message);
  }
};

  return (
    <DatePickerWrapper>
      <div>
        <Typography variant='h6' sx={{ fontWeight: 600, marginTop: '50px' }}>
          {t('Projects_details')}
        </Typography>
        <Typography variant='body2' sx={{ marginBottom: '20px' }}>
          {t('Add_all_project_details')}
        </Typography>
        <Card>
          <Divider sx={{ margin: 0 }} />
          <form >
            <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={6}>
                <TextField
  fullWidth
  label={t('Projects_Name')}
  placeholder={t('Projects_Name')}
  value={projectName} 
  onChange={(e) => setProjectName(e.target.value)}
  required
  error={formSubmitted && !projectName}  
  helperText={formSubmitted && !projectName ? 'Please enter the project name' : ''}/> 
               </Grid>
                <Grid item xs={12} sm={6}>
                <CountrySelect onSelectCountry={handleCountrySelection} required  />
                </Grid>
                <Grid item xs={12}>
                  <Alert style={customStyle} onClose={() => setShow(false)} dismissible>
                    <Alert.Heading style={{ fontSize: '1rem' }}>
                      {' '}
                      <AlertOutline /> {t('You_must_add_a_project_name')}
                    </Alert.Heading>
                    <p> {t('Go_and_type_in_the_project_name_in_the_correct_feild')}</p>
                  </Alert>
                </Grid>

                <Grid item xs={12}>
                        <TextField
              fullWidth
              label={t('Projects_description')}
              placeholder={t('The_names_John_Deo')}
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
  error={formSubmitted && !description}  
  helperText={formSubmitted && !description ? 'Please enter the project description' : ''}/> 
          
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label={t('Projects_Owner')} placeholder={t('Owner')}  value={owner}
  onChange={(e) => setOwner(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label={t('Projects_Manager')} placeholder={t('Manager')}  value={projectsManager} 
  onChange={(e) => setProjectsManager(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label={t('Projects_Website')} placeholder={t('www.website.com')} value={projectwebsite} 
  onChange={(e) => setProjectwebsite(e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label={t('Projects_Size')} placeholder={t('1200_Km²')}   onChange={(e) => setProjectSize(e.target.value)}
 />
                </Grid>

                <Grid item xs={12} sm={4}>

                  <FormControl  fullWidth>
                  <InputLabel  >{t('Departement')} </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={personName}
          onChange={handleChangedepartement}
          input={<OutlinedInput id="select-multiple-chip" label="Departement" />}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {names.map((name) => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, personName, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
                  
                </Grid>
                                        <Grid item xs={12} sm={4}>
                                        <FormControl sx={{ width: '50%' }}>
                            <InputLabel id='form-layouts-separator-select-label'>{t(' LOD ')}</InputLabel>
                                                <Select
                          label={t('Detail_level')}
                          value={lod}
                          onChange={(e) => setLod(e.target.value)}
                          id='form-layouts-separator-select'
                          labelId='form-layouts-separator-select-label'
                        >
                              <MenuItem value='LOD-50'>{t('LOD-50')}</MenuItem>
                              <MenuItem value='LOD-100'>{t('LOD-100')}</MenuItem>
                              <MenuItem value='LOD-150'>{t('LOD-150')}</MenuItem>

                              <MenuItem value='LOD-200'>{t('LOD-200')}</MenuItem>
                              <MenuItem value='LOD-250'>{t('LOD-250')}</MenuItem>

                              <MenuItem value='LOD-300'>{t('LOD-300')}</MenuItem>
                              <MenuItem value='LOD-350'>{t('LOD-350')}</MenuItem>

                              <MenuItem value='LOD-400'>{t('LOD-400')}</MenuItem>
                              <MenuItem value='LOD-450'>{t('LOD-450')}</MenuItem>

                              <MenuItem value='LOD-500'>{t('LOD-500')}</MenuItem>


                            </Select>
                            </FormControl>
                            <FormControl sx={{ width: '50%' }}>
                            <InputLabel id='form-layouts-separator-select-label'>{t(' LOI')}</InputLabel>

                            <Select
                          label={t('Detail_level')}
                          value={loi}
                          onChange={(e) => setLoi(e.target.value)}
                          id='form-layouts-separator-select'
                          labelId='form-layouts-separator-select-label'
                        >
                          
                              <MenuItem value='LOI-50'>{t('LOI-50')}</MenuItem>
                              <MenuItem value='LOI-100'>{t('LOI-100')}</MenuItem>
                              <MenuItem value='LOI-150'>{t('LOI-150')}</MenuItem>

                              <MenuItem value='LOI-200'>{t('LOI-200')}</MenuItem>
                              <MenuItem value='LOI-250'>{t('LOI-250')}</MenuItem>

                              <MenuItem value='LOI-300'>{t('LOI-300')}</MenuItem>
                              <MenuItem value='LOI-350'>{t('LOI-350')}</MenuItem>

                              <MenuItem value='LOI-400'>{t('LOI-400')}</MenuItem>
                              <MenuItem value='LOI-450'>{t('LOI-450')}</MenuItem>

                              <MenuItem value='LOI-500'>{t('LOI-500')}</MenuItem>

                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={4}>
      <FormLabel id='demo-row-radio-buttons-group-label'>{t('Project_main_language')}</FormLabel>
      <RadioGroup
        row
        aria-labelledby='demo-row-radio-buttons-group-label'
        name='row-radio-buttons-group'
        value={language}
        onChange={handleLanguageChange }
      >
        
        <FormControlLabel value='French' control={<Radio />} label={t('French')} />
        <FormControlLabel value='English' control={<Radio />} label={t('English')} />
        <FormControlLabel value='Arabic' control={<Radio />} label={t('Arabic')} />
        <FormControlLabel value='other' control={<Radio />} label={t('Other')} />
           {/* Render the additional TextField for "Other" option */}
      {language === 'other' && (
        <TextField
        sx={{ width: '40%' }}
          label={t('Write here  ')}
          value={otherLanguage}
          onChange={handleOtherLanguageChange}
        />
      )}
      </RadioGroup>
      </Grid>

   

                <Grid item xs={12} sm={3}>
                  <DatePicker
                    selected={date}
                    showYearDropdown
                    showMonthDropdown
                    placeholderText='MM-DD-YYYY'
                    customInput={<CustomInput />}
                    id='form-layouts-separator-date'
                    onChange={(date) => setDate(date)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <DatePicker
                    selected={date2}
                    showYearDropdown
                    showMonthDropdown
                    placeholderText='MM-DD-YYYY'
                    customInput={<CustomInput2 />}
                    id='form-layouts-separator-date'
                    onChange={(date2) => setDate2(date2)}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField fullWidth label={t('Estimated_time')} placeholder={t('21_working_Days')}  
                  value={estimatedDuration}
                  onChange={(e) => SetEstimatedDuration(e.target.value)}/>
                  
                
                </Grid>
                <Grid item xs={12} sm={3}>
                  <DatePicker
                    selected={date3}
                    showYearDropdown
                    showMonthDropdown
                    placeholderText='MM-DD-YYYY'
                    customInput={<CustomInput3 />}
                    id='form-layouts-separator-date'
                    onChange={(date3) => setDate3(date3)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label={t('Company')} placeholder={t('Company_name_here')} 
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}/>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField fullWidth label={t('Client')} placeholder={t('Joe')}  value={client}
    onChange={(e) => setClient(e.target.value)}/>
                </Grid>

                <Grid item xs={12} sm={6}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Display the current image or a placeholder */}
      <Img alt={t('Project_photo')} src={imageUrl} sx={{ marginRight: '30px' }} />

      <Grid container direction='column' alignItems='center'>
        <Grid item>
          {/* File input for uploading a new image */}
          <TextField 
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
            id="imageInput"
            required
            error={formSubmitted && !handleImageChange}  
            helperText={formSubmitted && !handleImageChange ? 'Please Upload the Image' : ''}/> 
          <label htmlFor="imageInput">
            <Button variant='contained' sx={{ marginRight: '20px' }} component="span">
              {t('Upload_Project_photo')}
            </Button>
          </label>
        
          {/* Button to reset the image */}
          <Button variant='outlined' color='error' onClick={handleResetimg}>
            {t('Reset')}
          </Button>
        </Grid>
        <Grid item>
          <Typography variant='body2' className='m-3'>
            {t('Allowed_JPG_GIF_or_PNG_Max_size_of_800K')}
          </Typography>
          {formSubmitted && !imgError && (
          <Typography variant='body2' color='error'>
            Please upload a Photo.
          </Typography>
        )}
        </Grid>
      </Grid>
    </CardContent>
                </Grid>
                <Grid item xs={12} sm={6}>
                <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Display the current logo image or a placeholder */}
      <Img alt={t('Project_Logo')} src={logoUrl} sx={{ marginRight: '30px' }} />

      <Grid container direction='column' alignItems='center'>
        <Grid item>
          {/* File input for uploading a new logo */}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
            id="logoInput"
          
            
            /> 
          <label htmlFor="logoInput">
            <Button variant='contained' sx={{ marginRight: '20px' }} component="span" >
              {t('Upload_Logo')}
            </Button>
          </label>
      
          {/* Button to reset the logo */}
          <Button variant='outlined' color='error' onClick={handleReset}>
            {t('Reset')}
          </Button>

          <Typography variant='body2' className='m-3'>
            {t('Allowed_JPG_GIF_or_PNG_Max_size_of_800K')}
          </Typography>
          {formSubmitted &&!logoFileError && (
          <Typography variant='body2' color='error'>
            Please upload a logo file.
          </Typography>
        )}
        </Grid>
      </Grid>
    </CardContent>

                </Grid>

                <Grid item xs={12} sm={4}>
  <FormControl fullWidth>
    <InputLabel id='form-layouts-separator-select-label'>{t('Status')}</InputLabel>
    <Select
      label={t('Status')}
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      id='form-layouts-separator-select'
      labelId='form-layouts-separator-select-label'
    >
      <MenuItem value='Active'>{t('Active')}</MenuItem>
      <MenuItem value='Pending_level'>{t('Pending_level')}</MenuItem>
      <MenuItem value='Inactive'>{t('Inactive')}</MenuItem>
    </Select>
  </FormControl>
</Grid>

                <Grid item xs={12} sm={3}>
                  <Typography variant='h5' sx={{ fontWeight: 600, marginTop: '10px', marginLeft: '30px' }}>
                    {t('Projects_progess')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                <Slider
                  aria-label='Temperature'
                  value={progress}
                  onChange={(e, value) => setProgress(value)}
                  getAriaValueText={valuetext}
                  color='primary'
                  sx={{ width: '120%' }} // Set the width as needed
                />    {progress}%

                </Grid>
              </Grid>
            </CardContent>
            <Divider sx={{ margin: 0 }} />
            <CardActions>
            <Button size='large'  sx={{ mr: 2 }} variant='contained' onClick={handleFormSubmit}>
                {t('Save_Changes')}
              </Button>
              <Button size='large' color='secondary' variant='outlined' >
                {t('Cancel')}
              </Button>
              
            </CardActions>
            {showSuccessMessage && (
  <CardContent>
    <Grid item xs={12}>
      <Alert severity="success" onClose={() => setShowSuccessMessage(false)} dismissible>
          {t('Project successfully added')}
      </Alert>
    </Grid>
  </CardContent>
)}

          </form>
        </Card>
        
      </div>
    </DatePickerWrapper>  
  );
};

export default Insert;
