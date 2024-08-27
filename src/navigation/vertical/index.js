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
  const userrole = useSelector(state => state.Role);
  const  cr  = useSelector(state => state.Cr);

  const base64Url =  usertoken.payload.token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const decodedToken = JSON.parse(window.atob(base64));
  const Role=decodedToken.role;

  const isUserRoleUserfree = Role === 'User' &&  cr === 'Newcomer';
  const HasSubscriber = Role === 'Subscriber' &&  cr === 'Newcomer';

  const isUserRoleUser = Role === 'User' &&  cr === 'Employee';
  const isUserRoleTeamManager = Role === 'User' &&  cr === 'TeamManager';
  const isUserRoleAdmin = Role === 'Admin';
  const isUserRoleTeamLead = Role === 'User' &&  cr === 'TeamLead';



////////////////////////////////////////////////


  const TeamManagerandOwner = userrole === 'Subscriber' &&  cr === 'TeamManager';
  const LeadsManagerandOwner = userrole === 'Subscriber' &&  cr === 'LeadsManager';

  const HasSubscriberNewcomer = userrole === 'Subscriber' &&  cr === 'Newcomer';
  const Owner= userrole === 'Subscriber' &&  (cr === 'Owner'||cr === 'Viewer');
  const Leader= userrole === 'Subscriber' &&  cr === 'Owner';
  const Manager= userrole === 'Subscriber' &&  cr === 'Owner';




  const LeadsUser= userrole === 'User' &&  cr === 'LeadsManager';
  const Employee= userrole === 'User' &&  cr === 'Employee';

  const TeamManagerUser= userrole === 'User' &&  cr === 'TeamManager';

  const Free= userrole === 'User' &&  cr === 'Free';
  return [

    {
      title: t('Dashboard') ,
      path: '/pages/DashboardLead',



      ...(Free && { hidden: true}),


      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: true}),

      ...(Leader && { hidden: false}),

      ...(Manager && { hidden: true}),
      ...(TeamManagerandOwner && { hidden: true}),
      ...(LeadsManagerandOwner && { hidden: false}),
      ...(LeadsUser && { hidden: false}),
      ...(TeamManagerUser && { hidden: true}),
      ...(Employee && { hidden: true}),




    },

    {
      title: t('Dashboard') ,
      path: '/pages/userinterface',

      ...(Free && { hidden: false}),

      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: false}),
      ...(Leader && { hidden: true}),
      ...(Manager && { hidden: false}),
      ...(TeamManagerandOwner && { hidden: false}),

      ...(LeadsManagerandOwner && { hidden: true}),
      ...(LeadsUser && { hidden: true}),
      ...(TeamManagerUser && { hidden: false}),
      ...(Employee && { hidden: false}),

    },
    {
      title: t('Leads') ,
      path: '/pages/Leads',

      ...(Free && { hidden: true}),

      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: true}),
      ...(Leader && { hidden: false}),
      ...(Manager && { hidden: true}),
      ...(TeamManagerandOwner && { hidden: true}),

      ...(LeadsManagerandOwner && { hidden: false}),
      ...(LeadsUser && { hidden: false}),
      ...(TeamManagerUser && { hidden: true}),
      ...(Employee && { hidden: true}),

    },
    {
      title: t('Projects'),
      path: '/pages/projectList',

      ...(TeamManagerUser && { hidden: false}),


      ...(Free && { hidden: true}),

      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: false}),

      ...(Leader && { hidden: false}),
      ...(Manager && { hidden: false}),
      ...(TeamManagerandOwner && { hidden: false}),
      ...(LeadsManagerandOwner && { hidden: true}),
      ...(LeadsUser && { hidden: true}),
      ...(Employee && { hidden: false}),

    },
    // {
    //   title: t('Meeting'),
    //   path: '/pages/meeting',
    //   ...(isUserRoleUser && { hidden: true }),
    //   ...(isUserRoleTeamManager && { hidden: true }),
    //   ...(isUserRoleAdmin && { hidden: true }),
    //   ...(isUserRoleTeamLead && { hidden: true }),

    // },
    {
      title: t('Meeting'),
      path: '/pages/meet',
      ...(TeamManagerUser && { hidden: false}),

      ...(LeadsUser && { hidden: true}),

      ...(Free && { hidden: true}),

      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: false}),
      ...(Manager && { hidden: false}),

      ...(TeamManagerandOwner && { hidden: false}),
      ...(LeadsManagerandOwner && { hidden: false}),
      ...(Employee && { hidden: false}),

    },

    {
      title: t('File Manager'),
      path: '/pages/FileManager',
 
      ...(LeadsUser && { hidden: true}),

      ...(Free && { hidden: true}),
      ...(TeamManagerUser && { hidden: false}),

      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: false}),
      ...(Leader && { hidden: false}),
      ...(Manager && { hidden: false}),
      ...(TeamManagerandOwner && { hidden: false}),
      ...(LeadsManagerandOwner && { hidden: true}),

      ...(Employee && { hidden: false}),

    },


   /* {
      title: t('Team'),
      path: '/pages/Team',
      ...(TeamManagerUser && { hidden: false}),


      ...(LeadsUser && { hidden: true}),

      ...(LeadsManagerandOwner && { hidden: true}),

      ...(Free && { hidden: true}),

      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: false}),

      ...(Leader && { hidden: false}),
      ...(Manager && { hidden: false}),
      ...(TeamManagerandOwner && { hidden: false}),
      ...(Employee && { hidden: false}),

    },   */
     {
      title: t('Users'),
      path: '/pages/user',

      ...(TeamManagerUser && { hidden: false}),

      ...(LeadsManagerandOwner && { hidden: false}),

      ...(LeadsUser && { hidden: true}),

      ...(Free && { hidden: true}),

      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: false}),
      ...(Leader && { hidden: false}),
      ...(Manager && { hidden: false}),
      ...(TeamManagerandOwner && { hidden: false}),
      ...(Employee && { hidden: true}),


    },
    /*{
      title: t('Messages'),
      path: '/under_construction',

      ...(TeamManagerUser && { hidden: false}),

      ...(LeadsManagerandOwner && { hidden: true}),

      ...(LeadsUser && { hidden: false}),

      ...(Free && { hidden: true}),

      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: false}),
      ...(Leader && { hidden: false}),
      ...(Manager && { hidden: false}),
      ...(TeamManagerandOwner && { hidden: false}),
      ...(Employee && { hidden: false}),


    }*/,


    {
      sectionTitle: t('Pages'),
      ...(TeamManagerUser && { hidden: false}),

      ...(LeadsManagerandOwner && { hidden: false}),

      ...(Free && { hidden: false}),
      ...(LeadsUser && { hidden: false}),

      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: false}),
      ...(Leader && { hidden: false}),
      ...(Manager && { hidden: false}),
      ...(TeamManagerandOwner && { hidden: false}),
      ...(Employee && { hidden: false}),


    },
    {
      title: t('Profile'),
      path: '/pages/Profile',

      ...(TeamManagerUser && { hidden: false}),

      ...(LeadsManagerandOwner && { hidden: false}),
      ...(LeadsUser && { hidden: false}),

      ...(Free && { hidden: false}),

      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: false}),
      ...(Leader && { hidden: false}),
      ...(Manager && { hidden: false}),
      ...(TeamManagerandOwner && { hidden: false}),

      ...(Employee && { hidden: false}),

    },
    {
      title: t('Notifications'),
      path: '/pages/notification',

      ...(TeamManagerUser && { hidden: false}),

      ...(LeadsManagerandOwner && { hidden: false}),

      ...(LeadsUser && { hidden: false}),

      ...(Free && { hidden: false}),

      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: false}),

      ...(Leader && { hidden: false}),
      ...(Manager && { hidden: false}),
      ...(TeamManagerandOwner && { hidden: false}),
      ...(Employee && { hidden: false}),

    },


     {
      title: t('Pricing'),
      path: '/pages/pricing',
      ...(TeamManagerUser && { hidden: true}),

      ...(TeamManagerandOwner && { hidden: false}),

      ...(LeadsManagerandOwner && { hidden: false}),
      ...(LeadsUser && { hidden: true}),

      ...(Employee && { hidden: true}),


      ...(Free && { hidden: false}),

      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: false}),
      ...(Leader && { hidden: false}),
      ...(Manager && { hidden: false}),


    },

    {
      title: t('Support'),
      path: '/pages/help',
      ...(TeamManagerUser && { hidden: false}),

      ...(LeadsManagerandOwner && { hidden: false}),

      ...(TeamManagerandOwner && { hidden: false}),
      ...(LeadsUser && { hidden: false}),

      ...(Free && { hidden: false}),

      ...(HasSubscriberNewcomer && { hidden: true }),
      ...(Owner && { hidden: false}),
      ...(Leader && { hidden: false}),
      ...(Manager && { hidden: false}),
      ...(Employee && { hidden: false}),


    },
    ].filter(item => !item.hidden);


}

export default navigation
