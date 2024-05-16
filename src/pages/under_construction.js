// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import { useRouter } from 'next/router';

// ** Styled Components
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw'
  }
}))

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10)
  },
  [theme.breakpoints.down('md')]: {
    height: 400
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(13)
  }
}))


const UnderConstruction = () => {
    const router = useRouter();

const goBack = () => {
  router.back();
};
  return (
    <Box className='content-center'>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h1'>Under Construction</Typography>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            This page is currently under construction! 🚧 👨🏻‍💻
          </Typography>
          <Typography variant='body2'>We are working hard to bring you an amazing experience. Please check back later!</Typography>
        </BoxWrapper>
        <Img height='487' alt='under-construction' src='/images/pages/under-construction.png' />
        <Button onClick={goBack} variant='contained' sx={{ px: 5.5 }}>
          Back
        </Button>
      </Box>
      <FooterIllustrations />
    </Box>
  )
}
UnderConstruction.getLayout = page => <BlankLayout>{page}</BlankLayout>

export default UnderConstruction
