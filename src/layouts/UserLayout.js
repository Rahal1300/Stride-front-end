// ** MUI Imports
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import React, { useState,useEffect } from 'react';

// ** Layout Imports
// !Do not remove this Layout import
import VerticalLayout from 'src/@core/layouts/VerticalLayout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'

// ** Component Import
import VerticalAppBarContent from './components/vertical/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'

import { useTranslation } from 'react-i18next';
import { loginSuccess } from '../features/reducers/authReducer'
import BlankLayout from 'src/@core/layouts/BlankLayout'

import { useSelector } from 'react-redux';
//





import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
const UserLayout = ({ children }) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings()
  const { t } = useTranslation(); // Hook to access translations
  const  usertoken  = useSelector(loginSuccess);  
  const [hasProject, setHasProject] = useState();


  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  // const Hasaproject = async () => {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil/has_projects`, {
  //       method: 'GET',
  //       headers: {
  //         Authorization: `Bearer ${usertoken.payload.token}`,
  //       },
  //     });

  //     const data = await response.json();

  //     setHasProject(data);
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  // useEffect(() => {
  //   Hasaproject();
  // }, []);
  // const UpgradeToProImg = () => {
  //   return hasProject ? null : (
  //     <Box sx={{ mx: 'auto' }}>
  //       <a
  //         target='_blank'
  //         rel='noreferrer'
  //         href='#'
  //       >
  //         <img width={290} alt={t('upgradeToPremiumAlt')} src={`/images/misc/upgrade-banner-${settings.mode}.png`} />
  //       </a>
  //     </Box>
  //   );
  // };
  const [isChecked, setIsChecked] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [dataFromChild, setDataFromChild] = useState('')
  const [childDataKey, setChildDataKey] = useState(0); // State variable for key

  const handleSwitchChange = () => {
    setIsChecked(!isChecked);
    setSnackbarOpen(true); // Open snackbar when role changes
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
 
  const handleDataFromChild = (data) => {
    setDataFromChild(data)
    setChildDataKey(childDataKey + 1);  }
  useEffect(() => {
   
    console.log('Data from UserDropdown here: ', dataFromChild)
  
  }, [dataFromChild]); 
  return (
    <>
    
      {usertoken.payload.token ? (<>
  
        <VerticalLayout
        key={childDataKey}
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
          verticalNavItems={VerticalNavItems()} // Navigation Items
          verticalAppBarContent={(props) => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
              sendDataToParent={handleDataFromChild}
            />
          )}
          sx={{ height: 'calc(190vh - 150px)' }} 
        >
          {children}
        </VerticalLayout></>
      ) : (
        <VerticalLayout
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
         
          sx={{ height: 'calc(190vh - 150px)' }} 
        >{children}        </VerticalLayout>

      )}
            {/* <Box sx={{ display: 'flex', justifyContent: 'right', alignItems: 'right', position: 'fixed', top: 0, width: '100%'}}>
        <Snackbar
               open={snackbarOpen}
               autoHideDuration={3000}
               onClose={handleCloseSnackbar}
               anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
             >
                       <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                 Role successfully changed to {isChecked ? 'Manager' : 'Leader'}
               </Alert>
             </Snackbar>
             <Stack direction="row" spacing={2} alignItems="center">
               {/*  <Alert direction="row" spacing={2} alignItems="center"  severity="info">
                
                <Typography variant="subtitle1">
                   Current Role: {isChecked ? 'Manager' : 'Leader'}
                 </Typography>
             
               </Alert>   
               
               <Typography variant="body2">Lead </Typography>
                <FormControlLabel
      control={<Switch checked={isChecked} onChange={handleSwitchChange} size="small" />}
      label={<Typography variant="body2">Manager </Typography>}
      style={{ fontSize: '0.8rem' }} // Adjust label font size here
    />
             </Stack>
           </Box> */}
    </>
  );
};

export default UserLayout;