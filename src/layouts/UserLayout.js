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

  return (
    <>
      {usertoken.payload.token ? (
        <VerticalLayout
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
            />
          )}
          sx={{ height: 'calc(190vh - 150px)' }} 
        >
          {children}
        </VerticalLayout>
      ) : (
        <VerticalLayout
          hidden={hidden}
          settings={settings}
          saveSettings={saveSettings}
         
          sx={{ height: 'calc(190vh - 150px)' }} 
        >{children}        </VerticalLayout>

      )}
    </>
  );
};

export default UserLayout;