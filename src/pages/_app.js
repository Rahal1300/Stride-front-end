// ** import { AuthProvider } from './AuthContext';
import React from 'react';
import { store }  from '../features/store'
import { Provider } from 'react-redux'
// ** Next Imports
import Head from 'next/head'
import { Router } from 'next/router'

// ** Loader Import
import NProgress from 'nprogress'

// ** Emotion Imports
import { CacheProvider } from '@emotion/react'

// ** Config Imports
import themeConfig from 'src/configs/themeConfig'

// ** Component Imports
import UserLayout from 'src/layouts/UserLayout'
import ThemeComponent from 'src/@core/theme/ThemeComponent'

// ** Contexts
import { SettingsConsumer, SettingsProvider } from 'src/@core/context/settingsContext'

// ** Utils Imports
import { createEmotionCache } from 'src/@core/utils/create-emotion-cache'

// ** React Perfect Scrollbar Style remvoe for now no need to scroll in the vertical Layout  ,remove // to get the scroll css 
// import 'react-perfect-scrollbar/dist/css/styles.css'

// ** Global css styles
import '../../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import i18n from '../../i18n.js'; 
import { I18nextProvider } from 'react-i18next';




import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51OckN7ALPzOLdjH3X3tiG0pEk0jDj91ZyAWSyrA8yp24Ozlcsm5wkHtWx2S8swyuP2eGVLxH0vHPiXvBzw9iGR7u00jbHjGb13");
import { GoogleOAuthProvider } from '@react-oauth/google';






const clientSideEmotionCache = createEmotionCache()

// ** Pace Loader
if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}
// ** Configure JSS & ClassName
const App = props => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Variables
  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)

  return (
<GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_KEY} >

    <Elements stripe={stripePromise}>

    <I18nextProvider i18n={i18n}>
    <CacheProvider value={emotionCache}>

      <Head>
        <title>{`${themeConfig.templateName} `}</title>
        <meta
          name='description'
          content={`${themeConfig.templateName} `}
        />

        <meta name='keywords' content='VIBROM' />
        <meta name='viewport' content='initial-scale=1, width=device-width' />
      </Head>

      <SettingsProvider>
        <SettingsConsumer>
          {({ settings }) => {
            return   <Provider store={store}>
 <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>    </Provider>

          }}
        </SettingsConsumer>
      </SettingsProvider>

    </CacheProvider>
    </I18nextProvider>

    </Elements>
    </GoogleOAuthProvider>
  )
}

export default App
