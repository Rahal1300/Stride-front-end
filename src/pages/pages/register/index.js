// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Imports
import Link from 'next/link'
import axios from 'axios';

// ** MUI Components
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import MuiCard from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiFormControlLabel from '@mui/material/FormControlLabel'

// ** Icons Imports
import Google from 'mdi-material-ui/Google'
import Github from 'mdi-material-ui/Github'
import Twitter from 'mdi-material-ui/Twitter'
import Facebook from 'mdi-material-ui/Facebook'
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'

import CircularProgress from '@mui/material/CircularProgress';


// ** Styled Components
const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  marginTop: theme.spacing(1.5),
  marginBottom: theme.spacing(4),
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const RegisterPage = () => {
  // ** States
  
  const [formData, setFormData] = useState({
    first_name: '',
    email: '',
    password: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // ** Hook
  const theme = useTheme()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, termsAccepted: e.target.checked });
  };

  const isValidEmail = (email) => {
    // Regular expression for email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  


  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setRegistrationError(null);
    setRegistrationSuccess(false);
    setLoading(true);
    if (!isValidEmail(formData.email)) {
      setRegistrationError('Please enter a valid email address.');
      setLoading(false);
      return;
    }
    if (formData.first_name && formData.password && formData.email) {
      const config = { headers: { "Content-Type": "application/json" } };
      axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/register`, formData, config)
        .then((response) => {
          setRegistrationSuccess(true);
          setFormData({
            first_name: '',
            email: '',
            password: '',
          });
        })
        .catch((error) => {
          setRegistrationError('Registration failed. Please try again.');
          console.error('Registration failed:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setRegistrationError('Fields are required.');
      setLoading(false);
    }
  };
  

  return (
    <Box className='content-center' sx={{
      backgroundImage: `
      url('/images/icons/test.png'),
      url('/images/icons/shape.png')
      `,
      backgroundSize: 'cover, contain',
      backgroundPosition: 'center',
    }}>
      <Card sx={{ zIndex: 1,borderRadius:'20px' }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
        <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <Typography
    variant='h6'
    sx={{
      ml: 3,
      lineHeight: 1,
      fontWeight: 600,
      textTransform: 'uppercase',
      fontSize: '1.5rem !important',fontSize:'32px'
    }}
  >
    Create an Account
  </Typography>
</Box>
<Box sx={{ mb: 2 }}>
  <Typography variant='body2' sx={{  fontSize: '14px',display: 'flex', alignItems: 'center', justifyContent: 'center',color:'#202224' }}>
    Create an account to continue
  </Typography>
</Box>


          <form noValidate autoComplete='off' onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
              <Typography htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color:'gray' }}>
                Email address :
              </Typography>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="esteban_schiller@gmail.com"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.3rem',
                  border: '1px solid #ccc',
                  fontSize: '18px', 
                  background:'#F1F4F9',
                  color:'#A6A6A6',
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <Typography htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', color:'gray' }}>
                Username :
              </Typography>
              <input
                id="username"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Username"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.3rem',
                  border: '1px solid #ccc',
                  fontSize: '18px', 
                  background:'#F1F4F9',
                  color:'#A6A6A6',
                }}
              />
            </div>

         

            <div style={{ marginBottom: '1rem' }}>
              <Typography htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color:'gray' }}>
                Password :
              </Typography>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder=""
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '0.3rem',
                  border: '1px solid #ccc',
                  fontSize: '20px', 
                  background:'#F1F4F9',
                  color:'#A6A6A6',
                }}
              />
            </div>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={formData.termsAccepted}
                onChange={handleCheckboxChange}
                inputProps={{ 'aria-label': 'Accept terms and conditions' }}
                sx={{
                  color: 'gray', // Default color
                  '&.Mui-checked': {
                    color: 'gray', // Color when checked
                  },'&:hover': {
                    background: 'none', // You can set the hover background color to the same as the default background color to remove the hover effect
                  },
                }}                />
              <Typography variant='body2' sx={{ color: '#202224' }}>
                I accept the <LinkStyled sx={{ color: '#202224' }}>terms and conditions</LinkStyled>.
              </Typography>
            </Box>
            <Button
  fullWidth
  size='large'
  type='submit'
  sx={{
    marginBottom: 7,
    color: 'white',
    background: '#4880FF',
    '&:hover': {
      background: '#4880FF', // You can set the hover background color to the same as the default background color to remove the hover effect
    },
  }}
>
  Sign up
</Button>

            <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
              <Typography variant='body2' sx={{ marginRight: 2 }}>
              Already have an account?   
              </Typography>
              <Typography variant='body2'>
                <Link passHref href='/pages/login'>
                  <LinkStyled sx={{color:'#5A8CFF',textDecoration: 'underline',fontFamily:'Nunito Sans',fontSize:'18'}}>Login</LinkStyled>
                </Link>
              </Typography>
            </Box>


            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 3, color:'#5A8CFF' }} />}
            {registrationSuccess && (
              <Typography variant='body2'  sx={{ textAlign: 'center', my: 2,color:'#5A8CFF' }}>
                Registration successful! Verification email has been sent.
              </Typography>
            )}

            {/* Display registration error message */}
            {registrationError && (
              <Typography variant='body2' color='error' sx={{ textAlign: 'center', my: 2,color:'red' }}>
                {registrationError}
              </Typography>
            )}
            </Box>
          </form>
        </CardContent>
      </Card>
      <FooterIllustrationsV1 />
    </Box>
  )
}
RegisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default RegisterPage
