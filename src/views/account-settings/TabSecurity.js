// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import { loginSuccess } from '../../features/reducers/authReducer'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/reducers/authReducer';
import TextField from '@mui/material/TextField'


// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import KeyOutline from 'mdi-material-ui/KeyOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
const TabSecurity = () => {
  // ** States
  const  user  = useSelector(loginSuccess);     
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    email: '', // Add email state
    CurrentPassword: '',
    NewPassword: '',
    showNewPassword: false,
    ConfirmationPassword: '',
    showCurrentPassword: false,
    showConfirmNewPassword: false
  })
  const [changePassword, setChangePassword] = useState(false) // State to track whether user wants to change password

  // Handle Current Password
  const handleCurrentPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowCurrentPassword = () => {
    setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
  }

  const handleMouseDownCurrentPassword = event => {
    event.preventDefault()
  }

  // Handle New Password
  const handleNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowNewPassword = () => {
    setValues({ ...values, showNewPassword: !values.showNewPassword })
  }

  const handleMouseDownNewPassword = event => {
    event.preventDefault()
  }

  const handleConfirmNewPasswordChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowConfirmNewPassword = () => {
    setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
  }

  const handleMouseDownConfirmNewPassword = event => {
    event.preventDefault()
  }
  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value })
  }
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!changePassword){
      try {
      const formData = new FormData();

      formData.append('email', values.email);

      const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil/updateInfo`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user.payload.token}`,
        },
        body: formData
      })

      if (updateResponse.ok) {
        setTimeout(() => {
          if ( values.email.trim() !== '') {
            handleLogout()
          }
        }, 1700)
      }
    } catch (error) {
      console.error('Update Info Failed:', error.message)
    }
  }else{
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil/ChangePassword`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.payload.token}`,
          },
          body: JSON.stringify({
            currentPassword: values.CurrentPassword,
            newPassword: values.NewPassword,
            confirmationPassword: values.ConfirmationPassword,
          }),
        });
         if (response.ok ) {
      
          const contentType = response.headers.get('content-type');
          const hasContent = contentType && contentType.indexOf('application/json') !== -1;
      
          if (hasContent) {
            const data = await response.json();
          } 
          Swal.fire({
            icon: 'success',
            title: 'Amazing!',
            text: 'Your Password  has been changed successfully.',
            showConfirmButton: false,
            timer: 1500,
          }); 
          handleLogout();
    
        } else {
             Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong while updating your Password!',
          });
          console.error('Failed:', response.statusText);
        }
      } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong while updating your Password!',
          });
        console.error('Password Change Failed:', error.message);
      }
    }
    };
    
  const handleLogout = async () => {
    try {
    
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.payload.token}`,
        },
       
      });
  
      if (response.ok) {
        dispatch(logout());
  
        
        window.location.href = '/pages/login'; 
      } else {
        console.error('Logout failed:', response.body);
      }
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
    <CardContent sx={{ paddingBottom: 0 }}>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Grid container spacing={5}>
            <Grid item xs={12} sx={{ marginTop: 4.75 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor='email'>Email</InputLabel>
                <OutlinedInput
                  fullWidth
                  id='email'
                  label='Email'
                  value={values.email}
                  onChange={handleChange('email')}
                  type='email'
                  placeholder='johnDoe@example.com'
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ marginTop: 4.75 }}>
              <FormControl fullWidth>
                <InputLabel htmlFor='account-settings-current-password'>Current Password</InputLabel>
                <OutlinedInput
                  label='Current Password'
                  required
                  value={values.CurrentPassword}
                  id='account-settings-current-password'
                  type={values.showCurrentPassword ? 'text' : 'password'}
                  onChange={handleCurrentPasswordChange('CurrentPassword')}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton
                        edge='end'
                        aria-label='toggle password visibility'
                        onClick={handleClickShowCurrentPassword}
                        onMouseDown={handleMouseDownCurrentPassword}
                      >
                        {values.showCurrentPassword ? <EyeOutline /> : <EyeOffOutline />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>

            {changePassword && (
              <>
                <Grid item xs={12} sx={{ marginTop: 4.75 }}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='account-settings-new-password'>New Password</InputLabel>
                    <OutlinedInput
                      label='New Password'
                      value={values.NewPassword}
                      required
                      id='account-settings-new-password'
                      type={values.showNewPassword ? 'text' : 'password'}
                      onChange={handleNewPasswordChange('NewPassword')}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onClick={handleClickShowNewPassword}
                            aria-label='toggle password visibility'
                            onMouseDown={handleMouseDownNewPassword}
                          >
                            {values.showNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='account-settings-confirm-new-password'>Confirm New Password</InputLabel>
                    <OutlinedInput
                      label='Confirm New Password'
                      value={values.ConfirmationPassword}
                      required
                      id='account-settings-confirm-new-password'
                      type={values.showConfirmNewPassword ? 'text' : 'password'}
                      onChange={handleConfirmNewPasswordChange('ConfirmationPassword')}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            aria-label='toggle password visibility'
                            onClick={handleClickShowConfirmNewPassword}
                            onMouseDown={handleMouseDownConfirmNewPassword}
                          >
                            {values.showConfirmNewPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
              </>
            )}

            {/* Button to toggle changePassword state */}
            <Grid item xs={12}>
              <Button
                variant='outlined'
                color='primary'
                onClick={() => setChangePassword(!changePassword)}
              >
                {changePassword ? 'Hide Change Password' : 'Change Password'}
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid
          item
          sm={6}
          xs={12}
          sx={{ display: 'flex', marginTop: [7.5, 2.5], alignItems: 'center', justifyContent: 'center' }}
        >
          <img width={183} alt='avatar' height={256} src='/images/pages/pose-m-1.png' />
        </Grid>
      </Grid>
    </CardContent>

    <Divider sx={{ margin: 0 }} />
      <CardContent>
        <Box sx={{ mt: 1.75, display: 'flex', alignItems: 'center' }}>
          <KeyOutline sx={{ marginRight: 3 }} />
          <Typography variant='h6'>Two-factor authentication</Typography>
        </Box>

        <Box sx={{ mt: 5.75, display: 'flex', justifyContent: 'center' }}>
          <Box
            sx={{
              maxWidth: 368,
              display: 'flex',
              textAlign: 'center',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <Avatar
              variant='rounded'
              sx={{ width: 48, height: 48, color: 'common.white', backgroundColor: 'primary.main' }}
            >
              <LockOpenOutline sx={{ fontSize: '1.75rem' }} />
            </Avatar>
            <Typography sx={{ fontWeight: 600, marginTop: 3.5, marginBottom: 3.5 }}>
              Two factor authentication is not enabled yet.
            </Typography>
            <Typography variant='body2'>
              Two-factor authentication adds an additional layer of security to your account by requiring more than just
              a password to log in. Learn more.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 11 }}>
        <Button type='submit' variant='contained' sx={{ marginRight: 3.5 }}>
            Save Changes
          </Button>
          <Button
            type='reset'
            variant='outlined'
            color='secondary'
            onClick={() => setValues({ ...values, currentPassword: '', newPassword: '', confirmNewPassword: '' })}
          >
            Reset
          </Button>
        </Box>
      </CardContent>
    </form>
  )
}

export default TabSecurity
