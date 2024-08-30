// ** React Imports
import { useState,useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {loginSuccess,logout,logoutGoogle,SetRole,Cr } from '../../../features/reducers/authReducer';

// ** Next Imports
import Link from 'next/link';
import { useRouter } from 'next/router';

// ** MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled, useTheme } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import MuiFormControlLabel from '@mui/material/FormControlLabel';
import CircularProgress from '@mui/material/CircularProgress';

import FormHelperText from '@mui/material/FormHelperText'
import Google from 'mdi-material-ui/Google';
import Github from 'mdi-material-ui/Github';
import Twitter from 'mdi-material-ui/Twitter';
import Facebook from 'mdi-material-ui/Facebook';
import EyeOutline from 'mdi-material-ui/EyeOutline';
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline';

// ** Configs
import themeConfig from 'src/configs/themeConfig';


import BlankLayout from 'src/@core/layouts/BlankLayout';
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration';
import DOMPurify from 'dompurify';
import Image from 'next/image';
import bg from "../../../../public/images/icons/test.png";
import bg2 from "../../../../public/images/icons/Shape.png";

const Card = styled(MuiCard)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' },
}));

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main,
}));

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
}));


const LoginPage = () => {
  // ** State
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth);
  const [values, setValues] = useState({
    email: '',
    password: '',
    showPassword: false,
  });

  // ** Hook
  const theme = useTheme();
  const router = useRouter();

  const handleChange = (prop) => (event) => {
    const sanitizedValue = DOMPurify.sanitize(event.target.value);
    setValues({ ...values, [prop]: sanitizedValue });
  };


  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

   useEffect(() => {
   dispatch(logout());
   dispatch(logoutGoogle());
 }, []);
 const handleForgotPasswordClick = (e) => {
  e.preventDefault();
  router.push('/pages/password-reset'); // Adjust the path if your page is located elsewhere
};

const handleSubmit = async (e) => {

  e.preventDefault();
  try {
  setIsLoading(true);

  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/auth/authenticate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({  email: values.email,
    password: values.password, }),

  });


  const data = await response.json();
  if (!data) return;

  if (data.message && data.message.toLowerCase().includes('banned')) {
    setError('Your account has been banned. Please contact support for assistance.');
  } else {
    dispatch(loginSuccess(data.token));



    const base64Url = data.token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    const decodedToken = JSON.parse(window.atob(base64));
    dispatch(SetRole(decodedToken.role));
    dispatch(Cr(decodedToken.cr));


     if (decodedToken.cr === 'LeadsManager') {
       router.push('/pages/DashboardLead');
    } else {
       router.push('/pages/userinterface');
     }
  }
} catch (error) {
  console.error('Error parsing JSON:', error);
  setError('Login failed. Please check your email and password.');
} finally {
  setIsLoading(false);
}
};
const [error, setError] = useState(null); // State to hold login error

const decodeJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};
const MaskImg = styled('img')(() => ({
  bottom: 0,
  zIndex: -1,
  width: '100%',
  position: 'absolute'
}))
   return (

    <Box
    className="content-center"
   sx={{
      backgroundImage: `
       url('/images/icons/test.png'),
         url('/images/icons/shape.png')
      `,
      backgroundSize: 'cover, contain',
      backgroundPosition: 'center',

   }}

  >
  <Image src={bg} layout="fill" objectFit="cover" objectPosition="center" />

    <Image src={bg2} layout="fill" objectFit="container" objectPosition="center" />




    <FooterIllustrationsV1 />
    <Card sx={{ zIndex: 1 ,borderRadius:'20px'}}>
      <CardContent sx={{ padding: (theme) => `${theme.spacing(12, 9, 7)} !important` }}>
        <Box sx={{ textAlign: 'center', mb: 8 ,ml:27}}>
        <img src={`/images/Stride.png`} alt="Logo" width='200px' height='55px'/>
</Box>
        <Typography variant="h6" sx={{ textAlign: 'center', mb: 8,mt:-5 ,fontWeight: 600, textTransform: 'uppercase' }}>

          Login to Account
        </Typography>
        <Box sx={{ mb: 6, textAlign: 'center', marginTop: '-8px' }}>
          {error ? (
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 2, color: 'error.main' }}>
              {error}
            </Typography>
          ) : (
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
              Please enter your email and password to continue
            </Typography>
          )}
        </Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 ,  }}>
            <CircularProgress sx={{color:'#4880FF'}} />
          </Box>
        ) : (
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <Typography htmlFor="email"   sx={{color:'gray'}}>
            Email address :            </Typography>
            <input
              id="email"
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              placeholder="esteban_schiller@gmail.com"
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '0.3rem',
                border: '1px solid #ccc',
                background:'#F1F4F9',
                color:'Black'
              }}
            />
          </div>     <Box sx={{ position: 'absolute', top: '53%', right: '42%', transform: 'translateY(-50%)' }}>
          <LinkStyled onClick={handleForgotPasswordClick} sx={{ color: 'gray' }}>
      Forgot Password?
    </LinkStyled>
</Box>
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
  <Typography htmlFor="password"                 sx={{color:'gray'}}
>
    Password :
  </Typography>
  <input
    id="password"
    type={values.showPassword ? 'text' : 'password'}
    value={values.password}
    onChange={handleChange('password')}
    style={{
      width: '100%',
      padding: '0.5rem',
      borderRadius: '0.3rem',
      border: '1px solid #ccc',
      fontSize: '20px',
      background:'#F1F4F9',
      color:'#A6A6A6'

    }}
  />
  <IconButton
    onClick={handleClickShowPassword}
    onMouseDown={handleMouseDownPassword}
    aria-label="toggle password visibility"
    style={{
      position: 'absolute',
      right: '5px',
      top: '70%',
      transform: 'translateY(-50%)',
    }}
  >
    {values.showPassword ? <EyeOutline  /> : <EyeOutline  />}
  </IconButton>
</div>




          <Box
            sx={{
              mb: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
            }}
          >

          </Box>
          <Button
  fullWidth
  size="large"
  sx={{
    mb: 7,
    background: '#4880FF',
    color: '#FFFFFF',
    fontSize: '14px',
    '&:hover': {
      background: '#4880FF', // You can set the hover background color to the same as the default background color to remove the hover effect
    },
  }}
  onClick={handleSubmit}
>
  Login
</Button>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2,color:'black' }}>
            Don’t have an account?               </Typography>
            <Typography variant="body2">
              <Link passHref href="/pages/register">
                <LinkStyled sx={{color:'#5A8CFF',fontFamily:'Arial',fontSize:'18',textDecoration: 'underline'}}>Create an account</LinkStyled>
              </Link>
            </Typography>
          </Box>
        </form>
        )}
      </CardContent>
    </Card>
  </Box>


);
};


LoginPage.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default LoginPage;
