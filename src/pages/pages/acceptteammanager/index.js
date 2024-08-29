/* eslint-disable react-hooks/rules-of-hooks */
import { useState, Fragment } from 'react'
import Link from 'next/link'
import axios from 'axios';
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
import themeConfig from 'src/configs/themeConfig'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import FooterIllustrationsV1 from 'src/views/pages/auth/FooterIllustration'
import Image from 'next/image';
import CircularProgress from '@mui/material/CircularProgress';
import bg from "../../../../public/images/icons/test.png";
import bg2 from "../../../../public/images/icons/Shape.png";
import { useRouter } from 'next/router';
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

const acceptregisterPage = () => {

  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    termsAccepted:false,

  });
  const [checkboxError, setCheckboxError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const theme = useTheme()
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, termsAccepted: e.target.checked });
  };


const { uniquecode } = router.query;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setRegistrationError(null);
    setRegistrationSuccess(false);
    setLoading(true);
    if (!formData.termsAccepted) {
      setCheckboxError(true); // Set error if the checkbox is not checked
      setLoading(false);
      return;
    }
    setCheckboxError(false);


    if (formData.userName && formData.password) {
      const config = { headers: { "Content-Type": "application/json" } };
      axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/Invitations/acceptTeamManager?uniquecode=${uniquecode}`, formData, config)

        .then((response) => {
          setRegistrationSuccess(true);
          setFormData({
            userName: '',
            password: '',
          });
          const timer = setTimeout(() => {
            router.push('/pages/login');
          }, 1800);

          // Cleanup the timer if the component unmounts before the timer finishes
          return () => clearTimeout(timer);
        }, [router])
        .catch((error) => {
          setRegistrationError('Registration failed. Please try again.');
          setLoading(false);

        })
        .finally(() => {
        });
    } else {
      setRegistrationError('Fields are required.');
      setLoading(false);
    }
  };
console.log(formData);

  return (
    <Box className='content-center' sx={{
      backgroundImage: `
      url('/images/icons/test.png'),
      url('/images/icons/shape.png')
      `,
      backgroundSize: 'cover, contain',
      backgroundPosition: 'center',
    }}>
       <Image src={bg} layout="fill" objectFit="cover" objectPosition="center" />

<Image src={bg2} layout="fill" objectFit="container" objectPosition="center" />
      <Card sx={{ zIndex: 1,borderRadius:'20px' }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
        <Box sx={{ textAlign: 'center', mb: 8 ,ml:27}}>
        <img src={`/images/Stride.png`} alt="Logo" width='200px' height='50px'/>
</Box>
        <Box sx={{ mb: 2,mt:-5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>  <Typography
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
              <Typography htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', color:'gray' }}>
                Username :
              </Typography>
              <input
                id="username"
                type="text"
                name="userName"
                value={formData.userName}
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
            <Box sx={{ display: 'flex', alignItems: 'center',mb:checkboxError ? 2 : 4 }}>
              <Checkbox
                checked={formData.termsAccepted}
                onChange={handleCheckboxChange}
                inputProps={{ 'aria-label': 'Accept terms and conditions' }}
                sx={{
                  color: 'gray',
                  '&.Mui-checked': {
                    color: 'gray',
                  },'&:hover': {
                    background: 'none',
                  },
                }}                />
              <Typography variant='body2' sx={{ color: '#202224' }}>
                I accept the <LinkStyled sx={{ color: '#202224' }}>terms and conditions</LinkStyled>.
              </Typography>
            </Box>
            {checkboxError && (
  <Typography variant='body2' color='error' sx={{ textAlign: 'center', mb: 2 }}>
    You must accept the terms and conditions to proceed.
  </Typography>
)}
            <Button
  fullWidth
  size='large'
  type='submit'
  sx={{
    marginBottom: 7,
    color: 'white',
    background: '#4880FF',
    '&:hover': {
      background: '#4880FF',
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
                  <LinkStyled sx={{color:'#5A8CFF',textDecoration: 'underline',fontFamily:'Arial',fontSize:'18'}}>Login</LinkStyled>
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
acceptregisterPage.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default acceptregisterPage
