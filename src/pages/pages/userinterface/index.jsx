import React, { useState, useEffect } from 'react'
import Card1 from './card1.jsx'
import Card2 from './card2.jsx'
import Card3 from './card3.jsx'
import Card4 from './card4.jsx'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import { loginSuccess } from '../../../features/reducers/authReducer.js'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { Typography } from '@mui/material'
import WeeklyOverview from './WeeklyOverview.js'
import withAuth from '../../../features/reducers/withAuth'

import PieProject from './PieProject.js'
import Meets from './PieMeets.js'

import FirstLoginModal from './FirstLoginModal'
import StepperModal from './StepperModal'
import { Grid } from '@mui/material'

import { ThemeProvider, createTheme } from '@mui/material/styles'
const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920
    }
  }
})
const User = () => {
  const user = useSelector(loginSuccess)
  const isAuthenticated = useSelector(state => state.isAuthenticated)
  const router = useRouter()
  const [showStepperModal, setShowStepperModal] = useState(false)

  const [showFirstLoginModal, setShowFirstLoginModal] = useState(true)
  const [HasSubscriber, setHasSubscriber] = useState(false)

  const [userData, setUserData] = useState('')

  const userrole = useSelector(state => state.Role)
  const cr = useSelector(state => state.Cr)

  useEffect(() => {
    if (user.payload.token == null && !isAuthenticated) {
      router.push('/pages/login')
    }
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil`, {
          headers: {
            Authorization: `Bearer ${user.payload.token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
        } else {
          console.error('Error fetching user data:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    fetchData()
    const base64Url = user?.payload?.token?.split('.')[1]
    if (base64Url) {
      try {
        const base64 = base64Url.replace('-', '+').replace('_', '/')
        const decodedToken = JSON.parse(window.atob(base64))
        console.log(decodedToken)
      } catch (error) {
        console.error('Error decoding token:', error.message)
      }
    }
    const hasSubscriber = userrole === 'Subscriber' && cr === 'Newcomer'
    if (hasSubscriber) {
      setHasSubscriber(true)
    }
  }, [isAuthenticated, user.payload.token, router, userrole, cr])

  if (!isAuthenticated && !user.payload.token) {
    return null
  }

  const handleFirstLoginModalClose = () => {
    setShowFirstLoginModal(false)
  }

  const handleStartJourney = () => {
    setShowFirstLoginModal(false)
    setShowStepperModal(true)
  }

  const handleStepperModalClose = () => {
    setShowStepperModal(false)
  }
  console.log('HasSubscriber', HasSubscriber)
  return (
    <ThemeProvider theme={theme}>
      {HasSubscriber ? (
        <>
          <FirstLoginModal
            name={userData.first_name}
            isOpen={showFirstLoginModal}
            onClose={handleFirstLoginModalClose}
            onStartJourney={handleStartJourney}
          />{' '}
          <StepperModal isOpen={showStepperModal} onClose={handleStepperModalClose} />
        </>
      ) : (
        <>
          <div>
            <Typography
              variant='h3'
              sx={{
                fontSize: '48px',
                fontFamily: 'Arial',
                marginBottom: '20px',
                '&::first-letter': {
                  color: 'secondary.main',
                }
              }}
            >
              Dashboard
            </Typography>

            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', magrin: '200px' }}>
              <Card1 number={30} /* percentage={5}*/ />
              <Card2 number={5} /*percentage={9.3}*/ />
              <Card3 number={20} /* percentage={2.5}*/ />
              <Card4 number={15} /*percentage={3.6}*/ />
            </div>
            <WeeklyOverview />
            <Grid container spacing={2} style={{ marginTop: '20px' }}>
              <Grid item xs={12} md={6}>
                <PieProject />
              </Grid>
              <Grid item xs={12} md={6}>
                <Meets />
              </Grid>
            </Grid>
          </div>
        </>
      )}
    </ThemeProvider>
  )
}

export default withAuth(User)
