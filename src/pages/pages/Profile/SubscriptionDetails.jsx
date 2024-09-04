import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CustomizedProgressBars from './loading';

const SubscriptionDetails = () => {
  const usertoken = useSelector(loginSuccess);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Payment/current_Subscription`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch subscription data');
        }

        const data = await response.json();
       
        setSubscription(data);
      } catch (error) {
        console.error('Error fetching subscription data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptionData();
  }, [usertoken]);

  if (isLoading) {
    return <CustomizedProgressBars />;
  }

  return (
    <Card sx={{ padding: 2, marginTop: 5 }}>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
          Subscription Details
        </Typography>
        {subscription ? (
          <>
        
            {subscription.type && (
              <>
                <Typography variant="body2" gutterBottom>
                  <strong>Type:</strong> {subscription.type}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Start Date:</strong> {new Date(subscription.startDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>End Date:</strong> {new Date(subscription.endDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <strong>Active:</strong> {subscription.active? 'Yes' : 'No'}
                </Typography>
              </>
            )}
          </>
        ) : (
          <Typography variant="body1">No subscription data available.</Typography>
        )}
      </Box>
    </Card>
  );
};

export default SubscriptionDetails;
