// ** Icon imports
import React, { useState, useEffect } from 'react';

import HomeOutline from 'mdi-material-ui/HomeOutline'
import Divider from '@mui/material/Divider'
import Help from 'mdi-material-ui/Help'
import Logout from 'mdi-material-ui/Logout'
import CogOutline from 'mdi-material-ui/CogOutline'
import BellOutline from 'mdi-material-ui/BellOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import FolderMultipleOutline from 'mdi-material-ui/FolderMultipleOutline'
import AccountSupervisorOutline from 'mdi-material-ui/AccountSupervisorOutline'
import ShoppingOutline from 'mdi-material-ui/ShoppingOutline'
import CalendarBlank from 'mdi-material-ui/CalendarBlank'
import Replay from 'mdi-material-ui/Replay'
import CommentMultipleOutline from 'mdi-material-ui/CommentMultipleOutline'
import { useTranslation } from 'react-i18next';
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import { useDispatch, useSelector } from 'react-redux'
import {loginSuccess } from '../../features/reducers/authReducer';
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const navigation = () => {
  const { t } = useTranslation();
  const usertoken = useSelector(loginSuccess);
  const [userData, setUserData] = useState(null);

  
 useEffect(() => {
    const checkAuthentication = async () => {

  
      const fetchData = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil`, {
            headers: {
              Authorization: `Bearer ${usertoken.payload.token}`,
            },
          });
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
  
      fetchData();
    };
    checkAuthentication();
  }, []);
  
 
  const base64Url =  usertoken.payload.token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const decodedToken = JSON.parse(window.atob(base64));
console.log(decodedToken);
  const Role=decodedToken.role;

  const cr=decodedToken.cr;
  
  const isUserRoleUser = Role === 'User' &&  cr === 'Employee';
  const isUserRoleTeamManager = Role === 'User' &&  cr === 'TeamManager';
  const isUserRoleAdmin = Role === 'Admin';
  const isUserRoleTeamLead = Role === 'User' &&  cr === 'TeamLead';

  return [
   
    {
      title: t('Dashboard') ,
      path: '/pages/DashboardLead',
      ...(isUserRoleUser && { hidden: true }),
      ...(isUserRoleTeamManager && { hidden: true }),
      ...(isUserRoleAdmin && { hidden: true }),
      ...(isUserRoleTeamLead && { hidden: false }),

      
    },
    
    {
      title: t('Dashboard') ,
      path: '/pages/userinterface',
      ...(isUserRoleUser && { hidden: false }),
      ...(isUserRoleTeamManager && { hidden: false }),
      ...(isUserRoleAdmin && { hidden: false }),
      ...(isUserRoleTeamLead && { hidden: true }),

      
    },
    {
      title: t('Leads') ,
      path: '/pages/Leads',
      ...(isUserRoleUser && { hidden: true }),
      ...(isUserRoleTeamManager && { hidden: true }),
      ...(isUserRoleAdmin && { hidden: true }),
      ...(isUserRoleTeamLead && { hidden: false }),

      
    },
    {
      title: t('Projects'),
      path: '/pages/projectList',
      ...(isUserRoleUser && { hidden: false }),
      ...(isUserRoleTeamManager && { hidden: false }),
      ...(isUserRoleAdmin && { hidden: false }),
      ...(isUserRoleTeamLead && { hidden: true }),

    },
    {
      title: t('Meeting'),
      path: '/pages/meeting',
      ...(isUserRoleUser && { hidden: true }),
      ...(isUserRoleTeamManager && { hidden: false }),
      ...(isUserRoleAdmin && { hidden: false }),
      ...(isUserRoleTeamLead && { hidden: true }),

    },
   

    {
      title: t('File Manager'),
      path: '/pages/Files',
      ...(isUserRoleUser && { hidden: true }),
      ...(isUserRoleTeamManager && { hidden: true }),
      ...(isUserRoleAdmin && { hidden: false }),
      ...(isUserRoleTeamLead && { hidden: true }),

    },
 

    {
      title: t('Team'),
      path: '/pages/Team',
      ...(isUserRoleUser && { hidden: true }),
      ...(isUserRoleTeamManager && { hidden: false }),
      ...(isUserRoleAdmin && { hidden: false }),
      ...(isUserRoleTeamLead && { hidden: true }),

    },   
     {
      title: t('Users'),
      path: '/pages/user',
      ...(isUserRoleUser && { hidden: true }),
      ...(isUserRoleTeamManager && { hidden: true }),
      ...(isUserRoleAdmin && { hidden: false }),
      ...(isUserRoleTeamLead && { hidden: true }),

    },
    {
      title: t('Messenges'),
      path: '/under_construction',
      ...(isUserRoleUser && { hidden: true }),
      ...(isUserRoleTeamManager && { hidden: false }),
      ...(isUserRoleAdmin && { hidden: true }),
    },
     {
      title: t('Profile'),
      path: '/pages/Profile'
    },
    {
      title: t('Calendar'),
      path: '/pages/calendar',
      ...(isUserRoleTeamLead && { hidden: true }),

    },
    {
      sectionTitle: t('Pages')
    },
    {
      title: t('Notifications'),
      path: '/pages/notification',
      ...(isUserRoleTeamLead && { hidden: true }),

    },


     {
      title: t('Pricing'),
      path: '/pages/pricing',
      ...(isUserRoleTeamLead && { hidden: true }),

    },

    {
      title: t('Support'),
      path: '/pages/help',
    },
    ].filter(item => !item.hidden);

  
}

export default navigation
