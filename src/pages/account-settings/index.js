// ** React Imports
import React, { useEffect, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import MuiTab from '@mui/material/Tab'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import InformationOutline from 'mdi-material-ui/InformationOutline'

// ** Demo Tabs Imports
import TabInfo from 'src/views/account-settings/TabInfo'
import TabAccount from 'src/views/account-settings/TabAccount'
import TabSecurity from 'src/views/account-settings/TabSecurity'
import CircularProgress from '@mui/material/CircularProgress';
 
import Typography from '@mui/material/Typography'

// ** Third Party Styles Imports
import 'react-datepicker/dist/react-datepicker.css'
import Profile from './profile'
import { loginSuccess } from '../../features/reducers/authReducer'
import { useSelector } from 'react-redux';
const Tab = styled(MuiTab)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    minWidth: 100
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 67
  }
}))

const TabName = styled('span')(({ theme }) => ({
  lineHeight: 1.71,
  fontSize: '0.875rem',
  marginLeft: theme.spacing(2.4),
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

const AccountSettings = () => {
  const [value, setValue] = useState('account');
  const [updateCounter, setUpdateCounter] = useState(0);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [userData, setUserData] = useState(null);
  const usertoken = useSelector(loginSuccess);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoadingProfile(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil`, {
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });
      const data = await response.json();
      setUserData(data);
      setLoadingProfile(false);

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingProfile(false);
    }
  };



  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleProfileUpdate = () => {
    setLoadingProfile(true);
    setUpdateCounter((prevCounter) => prevCounter + 1);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {loadingProfile && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress size={70} />
          <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
            Searching for Profile
          </Typography>
        </div>
      )}
<Profile
        key={updateCounter}
        loading={loadingProfile}
        user={userData}
        onLoaded={() => setLoadingProfile(false)}
      />      <Card sx={{ flex: 1, marginLeft: 2 }}>
        <TabContext value={value}>
          <TabList
            onChange={handleChange}
            aria-label='account-settings tabs'
            sx={{ borderBottom: theme => `1px solid ${theme.palette.divider}` }}
          >
            <Tab
              value='account'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountOutline />
                  <TabName>Account</TabName>
                </Box>
              }
            />
            <Tab
              value='security'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LockOpenOutline />
                  <TabName>Security</TabName>
                </Box>
              }
            />
            <Tab
              value='info'
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <InformationOutline />
                  <TabName>Info</TabName>
                </Box>
              }
            />
          </TabList>
          <TabPanel sx={{ p: 0 }} value='account'>
            <TabAccount onUpdate={handleProfileUpdate} />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='security'>
            <TabSecurity />
          </TabPanel>
          <TabPanel sx={{ p: 0 }} value='info'>
            <TabInfo />
          </TabPanel>
        </TabContext>
      </Card>
    </Box>
     )
}

export default AccountSettings
