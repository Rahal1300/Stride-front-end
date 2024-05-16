import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CheckboxBlankCircleOutline from 'mdi-material-ui/CheckboxBlankCircleOutline';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import React, { useState } from 'react';
import PlanItem from './component/PlanItem';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { loginSuccess } from '../../../features/reducers/authReducer'

import logo from'../../../../public/images/pages/TreeM.png';
import logo1 from'../../../../public/images/pages/Tree1.png';
import logo3 from '../../../../public/images/pages/Tree3.png';
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { Divider } from '@mui/material';



const Plan = () => {
  const [isAnnual, setIsAnnual] = useState(false); // Default is monthly

    const isAuthenticated = useSelector((state) => state.isAuthenticated);
    const router = useRouter();
    const user = useSelector(loginSuccess);
    useEffect(() => {
       if (user.payload.token == null && isAuthenticated === false) {
         router.push('/pages/login');
       }
    }, [isAuthenticated]);
    const handleUpgrade = (title, price) => {
      // Use router.push to navigate to the upgrade page with query parameters
      router.push({
        pathname: '/pages/Payment', // Assuming your upgrade page is named 'upgrade.js'
        query: { title, price }, // Pass title and price as query parameters
      });
    };
 

    
  
    // Use BlankLayout if not authenticated
     if (!isAuthenticated && user.payload.token === null) {
      
       return null;
     }



  const handleSwitchChange = () => {
    setIsAnnual((prevIsAnnual) => !prevIsAnnual);
  };

  const getPrice = (price) => {
    return isAnnual ? price * 12 : price;
  };

  return (
<>
<Typography sx={{fontSize:'32px',marginRight:'auto'}}>Pricing</Typography>

    <Container className="mt-5">
        <Grid container justifyContent="space-around" className="mt-5"  >
          <Grid item md={3} className="mb-4">
          <Card style={{  height: '100%',borderRadius:'15px'}}>
          

              <CardContent>
                <Typography  className="text-center" sx={{color:'black',fontSize:'28px'}}>
                  Basic 
                </Typography>
                <Typography variant="body2" className="text-center mb-3">
                Monthly Charge
                                </Typography>
           
                <PlanItem
            price={getPrice(14.99)}
              />

<Divider 
      sx={{
        borderColor: 'gray',
        borderWidth: '1px'
      }}
    />

          <Typography variant="body2"className="mb-3" sx={{color:'black',fontSize:'18px',fontWeight:'500'}}>5 Projects</Typography>
          <Typography variant="body2"className="mb-3" sx={{color:'black',fontSize:'18px'}}>Disk Size Limit 5 GB</Typography>
          <Typography variant="body2"className="mb-3" sx={{color:'black',fontSize:'18px'}}>5 User Connection</Typography>
          <Typography variant="body2"className="mb-3" sx={{color: 'rgba(33, 33, 33, 0.4)',fontSize:'18px',fontWeight:'200'}}>Regular Meeting</Typography>
          <Typography variant="body2"className="mb-3" sx={{color: 'rgba(33, 33, 33, 0.4)',fontSize:'18px',fontWeight:'200'}}>Virtual Meeting</Typography>
          <Typography variant="body2"className="mb-3" sx={{color: 'rgba(33, 33, 33, 0.4)',fontSize:'18px',fontWeight:'200'}}>Plugins Intregation</Typography>
          <Typography variant="body2"className="mb-3" sx={{color: 'rgba(33, 33, 33, 0.4)',fontSize:'18px',fontWeight:'200'}}>Custom Content Management</Typography>
          <Divider 
      sx={{
        borderColor: 'gray',
        borderWidth: '1px'
      }}
    />
                          <div className="d-flex justify-content-center mt-5">
  
                          <Button
  fullWidth
  size="large"
  sx={{
    border: '2px solid',
    color: '#6226EF',
    borderRadius:'40px',
    marginTop: 5 ,'&:hover': {
      color: 'white',
      background:'#6226EF'
    },
    }}
    onClick={() => handleUpgrade('Basic', getPrice(14.99))}
    >                

Get Started</Button>


                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3} className="mb-4">
       <Card style={{  height: '100%',borderRadius:'15px'}}>
              <CardContent>
              <Typography  className="text-center" sx={{color:'black',fontSize:'28px'}}>
                  Standard 
                </Typography>
                <Typography variant="body2" className="text-center mb-3">
                Monthly Charge
                                </Typography>
           
                <PlanItem
            price={getPrice(49.99)}
              />

<Divider 
      sx={{
        borderColor: 'gray',
        borderWidth: '1px'
      }}
    />

          <Typography variant="body2"className="mb-3" sx={{color:'black',fontSize:'18px',fontWeight:'500'}}>10 Projects</Typography>
          <Typography variant="body2"className="mb-3" sx={{color:'black',fontSize:'18px',fontWeight:'500'}}>Disk Size Limit 10 GB</Typography>
          <Typography variant="body2"className="mb-3"sx={{color:'black',fontSize:'18px',fontWeight:'500'}}>10 User Connection</Typography>
          <Typography variant="body2"className="mb-3" sx={{color:'black',fontSize:'18px',fontWeight:'500'}}>Regular Meeting</Typography>
          <Typography variant="body2"className="mb-3" sx={{color:'black',fontSize:'18px',fontWeight:'500'}}> 01 Virtual Meeting</Typography>
          <Typography variant="body2"className="mb-3" sx={{color: 'rgba(33, 33, 33, 0.4)',fontSize:'18px',fontWeight:'200'}}>Plugins Intregation</Typography>
          <Typography variant="body2"className="mb-3" sx={{color: 'rgba(33, 33, 33, 0.4)',fontSize:'18px',fontWeight:'200'}}>Custom Content Management</Typography>
          <Divider 
      sx={{
        borderColor: 'gray',
        borderWidth: '1px'
      }}
    />
                          <div className="d-flex justify-content-center mt-5">
                          <Button
  fullWidth
  size="large"
  sx={{
    border: '2px solid',
    color: '#6226EF',
    borderRadius:'40px',
    marginTop: 5 ,'&:hover': {
      color: 'white',
      background:'#6226EF'
    },
    }}
    onClick={() => handleUpgrade('Standard', getPrice(49.99))}

> 

Get Started</Button>


                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3} className="mb-4">
       <Card style={{  height: '100%',borderRadius:'15px'}}>
          

              <CardContent>
              <Typography  className="text-center" sx={{color:'black',fontSize:'28px'}}>
                  Premium 
                </Typography>
                <Typography variant="body2" className="text-center mb-3">
                Monthly Charge
                                </Typography>
           
                <PlanItem
            price={getPrice(89.99)}
              />





<Divider 
      sx={{
        borderColor: 'gray',
        borderWidth: '1px'
      }}
    />

          <Typography variant="body2"className="mb-3"sx={{color:'black',fontSize:'18px',fontWeight:'500'}}>Unlimited Projects</Typography>
          <Typography variant="body2"className="mb-3"sx={{color:'black',fontSize:'18px',fontWeight:'500'}}>Disk Size Limit 50 GB</Typography>
          <Typography variant="body2"className="mb-3"sx={{color:'black',fontSize:'18px',fontWeight:'500'}}>50 User Connection</Typography>
          <Typography variant="body2"className="mb-3"sx={{color:'black',fontSize:'18px',fontWeight:'500'}}>Regular Meeting</Typography>
          <Typography variant="body2"className="mb-3"sx={{color:'black',fontSize:'18px',fontWeight:'500'}}>05 Virtual Meeting</Typography>
          <Typography variant="body2"className="mb-3"sx={{color:'black',fontSize:'18px',fontWeight:'500'}}>Plugins Intregation</Typography>
          <Typography variant="body2"className="mb-3"sx={{color:'black',fontSize:'18px',fontWeight:'500'}}>Premium Support</Typography>
          <Divider 
      sx={{
        borderColor: 'gray',
        borderWidth: '1px'
      }}
    />
                          <div className="d-flex justify-content-center mt-5">
                          <Button
  fullWidth
  size="large"
  sx={{
    border: '2px solid',
    color: '#6226EF',
    borderRadius:'40px',
    marginTop: 5 ,'&:hover': {
      color: 'white',
      background:'#6226EF'
    },
    }}
    onClick={() => handleUpgrade('Premium', getPrice(89.99))}

>                 

Get Started</Button>


                </div>
              </CardContent>
            </Card>
          </Grid>

        </Grid>
  
    </Container>
    </>
  );
};

export default Plan;
