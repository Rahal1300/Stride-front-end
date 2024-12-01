// ** React Imports
import { forwardRef, useState,useEffect  } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import InputLabel from '@mui/material/InputLabel'
import RadioGroup from '@mui/material/RadioGroup'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import FormControlLabel from '@mui/material/FormControlLabel'
import { loginSuccess } from '../../features/reducers/authReducer'
import { useSelector } from 'react-redux';
// ** Third Party Imports
import DatePicker from 'react-datepicker'
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
// ** Styled Components
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

const CustomInput = forwardRef((props, ref) => {
  return <TextField inputRef={ref} label='Birth Date' fullWidth {...props} />
})

const TabInfo = () => {
  // ** State
  const [date, setDate] = useState(null)
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [gender, setGender] = useState('male'); // Default value can be set based on your requirements
  const [selectedLanguages, setSelectedLanguages] = useState(['English']); // Default value can be set based on your requirements
  const [bio, setBio] = useState(null)
  const [number, setNumber] = useState(null)
  const [userData, setUserData] = useState(null)
  const [userData2, setUserData2] = useState(null)
  const [bioError, setBioError] = useState(null);
  const [numberError, setNumberError] = useState(null);
  const [dateError, setDateError] = useState(null);
  const [countryError, setCountryError] = useState(null);

   
  
    const  usertoken  = useSelector(loginSuccess);  
    const handleSubmit = async (e) => {
      if (!validateInputs()) {
        // If validation fails, return early
        return;
      }
      const formData = new FormData();

      formData.append('birthDate',date);

      formData.append('Bio', bio);
      formData.append('Lang', selectedLanguages.join(','));
      formData.append('Gender', gender?gender:'');
      formData.append('phone_number', number?number:'');
      formData.append('Country', selectedCountry ? selectedCountry.label : '');

      e.preventDefault();
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil/updateBioinfo`, {
          method: 'PUT',
      
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
          },
          body: formData,
        });
    
        if (response.ok ) {
          const data = await response.json();
        
          Swal.fire({
            icon: 'success',
            title: 'Amazing!',
            text: 'Your profile has been changed successfully.',
            showConfirmButton: false,
            timer: 1500,
          });        } 
          else {
          // Handle password change errors
          console.error('Failed:', response.statusText);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong while updating your profile. !',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong while updating your profile !',
        });
        console.error('Info change Failed:', error.message);
      }
    };

    useEffect(() => {
      // Fetch user data from the server when the component mounts
      const fetchData = async () => {
        try {
             const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil`, {
            headers: {
              Authorization: `Bearer ${usertoken.payload.token}`,
            },
          });
          const data2 = await response.json();
         
  
          setUserData2(data2);
    
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      
  
      fetchData();
    }, []);
    if (!userData2) {
      return <div> </div>;
    }

    const validateInputs = () => {
      let isValid = true;
  
      // Validate Bio
      if (!bio) {
        setBioError('Bio cannot be empty');
        isValid = false;
      } else {
        setBioError(null);
      }
  
      if (!number) {
        setNumberError('Phone number cannot be empty');
        isValid = false;
      } else {
        setNumberError(null);
      }
  
      if (!date) {
        setDateError('Birth date cannot be empty');
        isValid = false;
      } else {
        setDateError(null);
      }
      if (!selectedCountry) {
        setCountryError('Please select a country');
        isValid = false;
      } else {
        setCountryError(null);
      }
  
      return isValid;
    };
  return (
    <CardContent>
      <form>
        <Grid container spacing={6}>
          <Grid item xs={12} sx={{ marginTop: 4.8 }}>
            <TextField
              fullWidth
              multiline
              label='Bio'
              minRows={2}
              onChange={(e) => setBio(e.target.value)}
              placeholder='Bio'
              defaultValue={userData2.bio || 'The name’s John Deo. I am a tireless seeker of knowledge, occasional purveyor of wisdom and also, coincidentally, a graphic designer. Algolia helps businesses across industries quickly create relevant 😎, scalable 😀, and lightning 😍 fast search and discovery experiences.'}
              />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePickerWrapper>
              <DatePicker
                selected={date}
                showYearDropdown
                    showMonthDropdown
                    placeholderText='MM-DD-YYYY'
                customInput={<CustomInput />}
                onChange={date => setDate(date)}
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type='number' label='Phone' placeholder='(123) 456-7890'               onChange={(e) => setNumber(e.target.value)}
/>
          </Grid>
          <Grid item xs={12} sm={6}>


          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <FormLabel sx={{ fontSize: '1rem' }}>Gender</FormLabel>
              <RadioGroup row defaultValue='male' aria-label='gender' name='account-settings-info-radio'             onChange={(e) => setGender(e.target.value)}>

                <FormControlLabel value='male' label='Male' control={<Radio />} />
                <FormControlLabel value='female' label='Female' control={<Radio />} />
                <FormControlLabel value='other' label='Other' control={<Radio />} />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel id='form-layouts-separator-multiple-select-label'>Languages</InputLabel>
              <Select
            multiple
            value={selectedLanguages} 
            onChange={(e) => setSelectedLanguages(e.target.value)} // Update the state when the value changes
            id='account-settings-multiple-select'
            labelId='account-settings-multiple-select-label'
            input={<OutlinedInput label='Languages' id='select-multiple-language' />}
          >
            <MenuItem value='English'>English</MenuItem>
            <MenuItem value='French'>French</MenuItem>
            <MenuItem value='Spanish'>Spanish</MenuItem>
            <MenuItem value='Portuguese'>Portuguese</MenuItem>
            <MenuItem value='Italian'>Italian</MenuItem>
            <MenuItem value='German'>German</MenuItem>
            <MenuItem value='Arabic'>Arabic</MenuItem>
          </Select>
            </FormControl>
          </Grid>
      
          <Grid item xs={12}>
            <Button variant='contained' onClick={handleSubmit} sx={{ marginRight: 3.5 }} >
              Save Changes
            </Button>
            <Button type='reset' variant='outlined' color='secondary' onClick={() => setDate(null)}>
              Reset
            </Button>
          </Grid>
     
        </Grid>
        {bioError && <div style={{ color: 'red' }}>{bioError}</div>}
        {numberError && <div style={{ color: 'red' }}>{numberError}</div>}
        {dateError && <div style={{ color: 'red' }}>{dateError}</div>}
        {countryError && <div style={{ color: 'red' }}>{countryError}</div>}
      </form>
    </CardContent>
  )
}

export default TabInfo
