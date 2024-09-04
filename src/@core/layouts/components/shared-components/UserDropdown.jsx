// ** React Imports
import { useEffect,useState, Fragment } from 'react'

// ** Next Import
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux';
import store from '../../../../features/store';

import { logout } from '../../../../features/reducers/authReducer';
// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import CogOutline from 'mdi-material-ui/CogOutline'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import { useTranslation } from 'react-i18next';
import { loginSuccess,Cr,SetRole } from '../../../../features/reducers/authReducer'
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined';
import { useSelector } from 'react-redux';
// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = ({sendDataToParent}) => {
  const { t } = useTranslation(); // Hook to access translations

  const  user  = useSelector(loginSuccess);
  const userrole = useSelector(state => state.Role);
   const  cr  = useSelector(state => state.Cr);
const [isChecked, setIsChecked] = useState('');
const [anchorEl, setAnchorEl] = useState(null)
  const [userData, setUserData] = useState(null);
  const dispatch = useDispatch();
  // ** Hooks
  const router = useRouter()

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      router.push(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }


useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil`, {
        headers: {
          Authorization: `Bearer ${user.payload.token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);

      } else {
        console.error('Error fetching user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };
  fetchData();
  if (cr === 'LeadsManager') {
    setIsChecked(true);
  } ;
  if (cr === 'TeamManager') {
    setIsChecked(false);
  }
}, [user.payload.token,cr]);

  const handleLogout = () => {

    router.push("/pages/login")
  };


  const handleBackToOwner = () => {
    dispatch(Cr('Owner'))
    router.push('/pages/userinterface')
  }
  const handleSwitchChange = () => {
    const newIsChecked = !isChecked;
    setIsChecked(newIsChecked);
    sendDataToParent(newIsChecked);

    if (newIsChecked) {
      dispatch(SetRole('Subscriber'));
      dispatch(Cr('LeadsManager'));
      router.push("/pages/DashboardLead")

    } else {
      dispatch(SetRole('Subscriber'));
      dispatch(Cr('TeamManager'));
      router.push("/pages/userinterface")

    }
  };
  return (

    <Fragment>
   <Box sx={{ display: 'flex', alignItems: 'center', marginRight: 2 }}onClick={handleDropdownOpen} >
  <Badge
    overlap='circular'
    badgeContent={<BadgeContentSpan />}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    onClick={handleDropdownOpen}
  >
    <Avatar
      alt='John Doe'
      sx={{ width: 44, height: 44 }}
      src={userData && userData.image ? `data:image/png;base64,${userData.image}` : '/images/avatars/1.png'}
      onClick={handleDropdownOpen}
    />
  </Badge>
</Box>
<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginRight: 2,ml:2 }} onClick={handleDropdownOpen}>
  <Typography variant='body2' sx={{
    fontSize: '14px',
    lineHeight: '19.1px',
    color: '#404040',
    fontFamily: 'Arial',
    fontWeight: 700,
    width: '61px',
    height: '19px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    marginBottom: 1,
  }} onClick={handleDropdownOpen}>
    {userData?.first_name} {userData?.last_name}
  </Typography>

  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    <Typography variant='body2' sx={{
      fontSize: '12px',
      lineHeight: '16.37px',
      color: '#565656',
      fontFamily: 'Arial',
      fontWeight: 600,
      width: '61px',
      height: '16px',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
      marginRight: 15, // Add some space between text and icon
    }} onClick={handleDropdownOpen}>
      {cr} ({userrole})
    </Typography>
    <ArrowDropDownCircleOutlinedIcon style={{ color: 'gray' }} onClick={handleDropdownOpen} />
  </Box>
</Box>





      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, marginTop: 4, borderRadius: 2 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >


        {/* <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              <Avatar alt='John Doe'   src={userData &&userData.image ? `data:image/png;base64,${userData.image}` : '/images/avatars/1.png'}
 sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{userData?.first_name } {userData?.last_name }</Typography>
              <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
              {userData?.role }

              </Typography>
            </Box>
          </Box>
        </Box> */}
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/Profile')} key="profile">
          <Box sx={styles}>
          <img src="/images/icons/manage.png" style={{ marginRight: 5 }}/>                   {t('Manage Profile')}

          </Box>
        </MenuItem>        <Divider />

        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/pricing')} key="pricing">
          <Box sx={styles}>
            <img src="/images/icons/plan.png"style={{ marginRight: 5 }}/>
                                      {t('My Plan')}
                                      <Divider />

          </Box>
        </MenuItem>

        <Divider />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/help')} key="help">
          <Box sx={styles}>
          <img src="/images/icons/GroupTeam.png" style={{ marginRight: 5,width:20 }}/>                                          {t('Support')}

          </Box>
        </MenuItem>
        <>
          {userrole == 'Subscriber' && cr !== 'Viewer' &&  (
            <>
              <Divider />
              <MenuItem sx={{ p: 0 }} onClick={handleSwitchChange} key="switch">
                <Box sx={styles}>
                  <img src="/images/icons/support.png" style={{ marginRight: 5 }} />
                  {isChecked ? 'Act as Manager' : 'Act as Leader'}
                </Box>
              </MenuItem>
            </>
          )}
          {cr !== 'Viewer' && cr !== 'Owner' && userrole == 'Subscriber'&& (
            <>
              <Divider />
              <MenuItem sx={{ p: 0 }} onClick={handleBackToOwner} key="back-to-owner">
                <Box sx={styles}>
                  <img src="/images/icons/back.png" style={{ marginRight: 5,width:15 }} />
                  {'Back to Owner'}
                </Box>
              </MenuItem>
            </>
          )}
        </>

        <Divider />
        <MenuItem sx={{ py: 2 }} onClick={() => handleLogout()} key="Logout">
          <img src="/images/icons/logout.png" style={{ marginRight: 5 }}/>
                                  {t('Log out')}

        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown
