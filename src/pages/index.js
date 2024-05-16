import Grid from '@mui/material/Grid'
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'
import BlankLayout from 'src/@core/layouts/BlankLayout'
import User from './pages/userinterface/'
import LoginPage from './pages/login'
import  { useEffect } from 'react';
import { loginSuccess } from '../features/reducers/authReducer'
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
const Dashboard = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const user = useSelector(loginSuccess);
  const router = useRouter();
  const checkTokenExpiration = (token) => {
    try {
      const decodedToken = jwt.decode(token);
      const expirationTimestamp = decodedToken.exp;
      if (expirationTimestamp) {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const timeLeftInSeconds = expirationTimestamp - currentTimestamp; 
        if (timeLeftInSeconds <= 0) {
          console.log('Token has expired');
        } else {
          console.log('Token is still valid');
          const days = Math.floor(timeLeftInSeconds / 86400);
          const hours = Math.floor((timeLeftInSeconds % 86400) / 3600);
          const minutes = Math.floor((timeLeftInSeconds % 3600) / 60);
          const seconds = timeLeftInSeconds % 60;
          console.log(`Time left: ${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      } else {
        console.log('Token does not contain an expiration claim');
      }
    } catch (error) {
      console.error('Error decoding the token:', error);
    }
  }

  useEffect(() => {
    const yourToken = user.payload.token;
    checkTokenExpiration(yourToken);

    if ( user.payload.token==null || isAuthenticated==false) {
      router.push('/pages/login');
    } else {

      router.push('/pages/userinterface');
    }
  }, [isAuthenticated, user.payload.token, router]);

  return <></>; 
};
Dashboard.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;

export default Dashboard;
