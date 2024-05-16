// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Alert from '@mui/material/Alert'
import Select from '@mui/material/Select'
import { styled } from '@mui/material/styles'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import AlertTitle from '@mui/material/AlertTitle'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import Button from '@mui/material/Button'
import { loginSuccess } from '../../features/reducers/authReducer'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { persistor,store } from '../../features/store';
import { logout } from '../../features/reducers/authReducer';

// ** Icons Imports
import Close from 'mdi-material-ui/Close'
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
const ImgStyled = styled('img')(({ theme }) => ({
  width: 120,
  height: 120,
  marginRight: theme.spacing(6.25),
  borderRadius: theme.shape.borderRadius
}))

const ButtonStyled = styled(Button)(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    textAlign: 'center'
  }
}))

const ResetButtonStyled = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(4.5),
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    marginLeft: 0,
    textAlign: 'center',
    marginTop: theme.spacing(4)
  }
}))

const TabAccount =({onUpdate}) => {
  // ** State
  const [openAlert, setOpenAlert] = useState(true);
  const [imgSrc, setImgSrc] = useState('/images/avatars/1.png');
  const router = useRouter();

  const [values, setValues] = useState({
    first_name: '',
    last_name: '',
    email: '',
    company: '',
   
  });
  const newProfileInfo = {
    first_name: values.first_name,
    last_name: values.last_name,
    email: values.email,
    company: values.company,
  }
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });

  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setValues({ ...values, image: file });
    const reader = new FileReader();
    reader.onload = () => setImgSrc(reader.result);
    reader.readAsDataURL(file);
  };

 

  const  user  = useSelector(loginSuccess);     

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('first_name', values.first_name);
      formData.append('last_name', values.last_name);
      // formData.append('email', values.email);
      formData.append('company', values.company);
      if (values.image) {
        formData.append('image', values.image);
      }
      for (const pair of formData.entries()) {
      }
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.payload.token}`,
        },
      });
  
      if (userResponse.ok) {
        const userData = await userResponse.json();
  
        const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil/updateInfo`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${user.payload.token}`,
          },
          body: formData,
        });
  
        if (updateResponse.ok) {
          const updateData = await updateResponse.json();
          setValues({
            first_name: '',
            last_name: '',
            email: '',
            company: '',

          });
          setImgSrc('/images/avatars/1.png'); 

          
          onUpdate ();
          Swal.fire({
            icon: 'success',
            title: 'Amazing!',
            text: 'Your profile has been changed successfully.',
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            if (values.email !== userData.email && values.email.trim() !== '') {
              handleLogout();
            }
          }, 1700);
        } else {
          // Handle update errors
          console.error('Update failed:', updateResponse.statusText);
        }
      } else {
        // Handle user data retrieval errors
        console.error('Failed to fetch user data:', userResponse.statusText);
      }
    } catch (error) {
      console.error('Update Profil failed:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong while updating your profile!',
      });
  
    }
  };
  
  
  const handleLogout = async () => {
    store.dispatch({ type: 'LOGOUT' });
    router.push('/pages/login'); 
    try {
    
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.payload.token}`,
        },
       
      });
  
      if (response.ok) {
       
       } else {
        console.error('Logout failed:', response.body);
      }
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };







  const onChange = file => {
    const reader = new FileReader()
    const { files } = file.target
    if (files && files.length !== 0) {
      reader.onload = () => setImgSrc(reader.result)
      reader.readAsDataURL(files[0])
    }
  }

  return (
    <CardContent>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={7}>
          <Grid item xs={12} sx={{ marginTop: 4.8, marginBottom: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ImgStyled src={imgSrc} alt='Profile Pic' />
              <Box>
                <ButtonStyled component='label' variant='contained' htmlFor='account-settings-upload-image'>
                  Upload New Photo
                  <input
                    hidden
                    type='file'
                    onChange={handleFileChange}
                    accept='image/png, image/jpeg'
                    id='account-settings-upload-image'
                  />
                </ButtonStyled>
                <ResetButtonStyled color='error' variant='outlined' onClick={() => setImgSrc('/images/avatars/1.png')}>
                  Reset
                </ResetButtonStyled>
                <Typography variant='body2' sx={{ marginTop: 5 }}>
                  Allowed PNG or JPEG. Max size of 800K.
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='first name' placeholder='johnDoe'    id="first_name"
            
              value={values.first_name}
              onChange={handleChange('first_name')} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='last name' placeholder='John Doe'   id="last_name"
            
            value={values.last_name}
            onChange={handleChange('last_name')} />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="email"
              label="Email"
              value={values.email}
              onChange={handleChange('email')}
              type='email'
             
              placeholder='johnDoe@example.com'
            />
          </Grid> */}
     
       
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label='company' placeholder='ABC Pvt. Ltd.'  id="company"
            
            value={values.company}
            onChange={handleChange('company')} />
          </Grid>

        

          <Grid item xs={12}>
            <Button type='submit' variant='contained' sx={{ marginRight: 3.5 }} >
              Save Changes
            </Button>
            <Button type='reset' variant='outlined' color='secondary'>
              Reset
            </Button>
          </Grid>
        </Grid>
      </form>
    </CardContent>
  )
}

export default TabAccount
