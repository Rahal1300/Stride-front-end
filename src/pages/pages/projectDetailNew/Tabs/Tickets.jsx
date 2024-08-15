import React, { useState ,useEffect} from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TicketForm from './TicketForm'; 
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux';
import { loginSuccess } from 'src/features/reducers/authReducer';


import BlankLayout from 'src/@core/layouts/BlankLayout'


import FooterIllustrations from 'src/views/pages/misc/FooterIllustrations'
import { useRouter } from 'next/router';


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


function Tickets() {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const usertoken = useSelector(loginSuccess);
  const router = useRouter();
  const [data,setData] = useState([]);
  const { id } = router.query;

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/project/${id}`, {
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
          setData(data);
          setSnackbarMessage('Project posts');
         // setMembersList(data);
        setLoading(false);
        }

      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
   

    fetchData();
  }, [usertoken]);


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Divider sx={{   
        borderColor: 'gray',
        borderWidth: '1px',width:'80%',marginBottom:'20px'
      }} />
      {/* <Button
  variant="contained"
  onClick={handleOpen}
  sx={{
 
   
    backgroundColor: '#E2EAF8',
    opacity: 0.7,

    color: '#202224',
 
    borderRadius: '10%',
  }}
>
  Create a ticket
</Button> */}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-ticket-modal-title"
        aria-describedby="create-ticket-modal-description"
      >
        <TicketForm onClose={handleClose} />
      </Modal>
      <Box sx={{ p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <BoxWrapper>
          <Typography variant='h1'>Under Construction</Typography>
          <Typography variant='h5' sx={{ mb: 1, fontSize: '1.5rem !important' }}>
            This page is currently under construction! 🚧 👨🏻‍💻 
          </Typography>
          <p>{data.length}</p>
          <Typography variant='body2'>We are working hard to bring you an amazing experience. Please check back later!</Typography>
        </BoxWrapper>
        <Img height='487' alt='under-construction' src='/images/pages/under-construction.png' />
       
      </Box>    </Box>
  );
}

export default Tickets;
