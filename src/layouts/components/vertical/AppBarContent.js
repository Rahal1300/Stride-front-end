// ** MUI Imports
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import InputAdornment from '@mui/material/InputAdornment'
import React, { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import Snackbar from '@mui/material/Snackbar'
import { useSelector } from 'react-redux'

// ** Icons Imports
import Menu from 'mdi-material-ui/Menu'
import Magnify from 'mdi-material-ui/Magnify'
import CloseIcon from 'mdi-material-ui/Close'

// ** Components
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import LanguageDropdown  from 'src/@core/layouts/components/shared-components/Lang'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility, sendDataToParent } = props

  const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const [dataFromChild, setDataFromChild] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const userRole = useSelector(state => state.Role)
  const cr = useSelector(state => state.Cr)
const notyours=  userRole === 'Subscriber' && cr === 'Newcomer'

  // Effect to show Snackbar whenever sendDataToParent changes
  useEffect(() => {
    if (sendDataToParent ) {
      setSnackbarOpen(true)
    }
  }, [sendDataToParent, userRole])
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }
    setSnackbarOpen(false)
  }
  const getDisplayRole = () => {
    switch (cr) {
      case 'TeamManager':
        return 'Team Manager'
      case 'LeadsManager':
        return 'Lead Manager'
      default:
        return cr // fallback to the actual cr value if not specified
    }
  }
  const theme = createTheme({
    components: {
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            backgroundColor: '#64B5F6', // Change this to the color you desire
          },
        },
      },
    },
  })
  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'right', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
      <ThemeProvider theme={theme}>
       {!notyours ? ( <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen && userRole === 'Subscriber'}
        autoHideDuration={6000}
      
        onClose={handleSnackbarClose}
        message={`You are a subscriber but currently acting as ${getDisplayRole()}.`}
                action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      /> </> )  : (null)}
      
      
      </ThemeProvider>

            {hidden ? (
          <IconButton
            color='inherit'
            onClick={toggleNavVisibility}
            sx={{ ml: -2.75, ...(hiddenSm ? {} : { mr: 3.5 }) }}
          >
            <Menu />
          </IconButton>
        ) : null}
        {/* <TextField
          size='small'
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify fontSize='small' />
              </InputAdornment>
            )
          }}
        /> */}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>

        {/* <ModeToggler settings={settings} saveSettings={saveSettings} /> */}
        <NotificationDropdown />
        <LanguageDropdown/>

        <UserDropdown sendDataToParent={sendDataToParent} />
      </Box>
    </Box>
  )
}

export default AppBarContent
