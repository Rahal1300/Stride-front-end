import React from 'react';
import { useTranslation } from 'react-i18next';
import Acco from './acco';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { useSelector } from 'react-redux';
import  { useEffect } from 'react';
import { useRouter } from 'next/router'
import { loginSuccess } from '../../../features/reducers/authReducer'
import SupportTicket from './SupportTicket';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

const FAQPage = () => {
  const { t } = useTranslation(); 
  const user = useSelector(loginSuccess);

  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const router = useRouter();
   useEffect(() => {
     if (user.payload.token == null && isAuthenticated === false) {
       router.push('/pages/login');
     }
   }, [isAuthenticated]);
   if (!isAuthenticated && user.payload.token === null) {
     return null;
   }
  return (
    <>
  <Grid container alignItems="center" justifyContent="space-between" spacing={2} sx={{margin: 8 }}>
    <Grid item xs={12} sm={6}>
      <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
      Support   
        </Typography>
    </Grid>
  
  </Grid>
        <Acco></Acco> 
        <SupportTicket/>
     

    </>
  );
};

export default FAQPage;
