import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'

// MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Snackbar from '@mui/material/Snackbar'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CloseIcon from 'mdi-material-ui/Close'
import Menu from 'mdi-material-ui/Menu'
import { useMediaQuery } from '@mui/system'

// Components
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/Lang'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'

const AppBarContent = props => {
  // ** Props
  const { hidden, toggleNavVisibility, sendDataToParent } = props

  const hiddenSm = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const router = useRouter()

  const userRole = useSelector(state => state.Role)
  const cr = useSelector(state => state.Cr)
  const notyours = userRole === 'Subscriber' && cr === 'Newcomer'

  // Define allowed paths for showing Snackbar
  const allowedPaths = ['/pages/userinterface']

  // Effect to show Snackbar only once when logged in
  useEffect(() => {
    const isSnackbarShown = sessionStorage.getItem('snackbarShown')

    if (sendDataToParent && allowedPaths.includes(router.pathname) && !isSnackbarShown) {
      setSnackbarOpen(true)
      sessionStorage.setItem('snackbarShown', 'true') // Set flag so it doesn't show again
    }
  }, [sendDataToParent, userRole, router.pathname])

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

  const handleLogout = () => {
    localStorage.removeItem('token') // Adjust this key to match the token storage key
    sessionStorage.removeItem('snackbarShown') // Clear flag when logging out
    router.push("/pages/login") // Adjust this route to match your login page route
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'right', justifyContent: 'space-between' }}>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        <ThemeProvider theme={theme}>
          {!notyours && (
            <>
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
              />
            </>
          )}
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
      </Box>

      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        <NotificationDropdown />
        <LanguageDropdown />
        <UserDropdown sendDataToParent={sendDataToParent} />
      </Box>
    </Box>
  )
}

export default AppBarContent
