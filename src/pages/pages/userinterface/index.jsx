import React, {useState, useEffect } from 'react';
import Card1 from './card1.jsx';
import Card2 from './card2.jsx';
import Card3 from './card3.jsx';
import Card4 from './card4.jsx';
import BlankLayout from 'src/@core/layouts/BlankLayout';
import { loginSuccess } from '../../../features/reducers/authReducer.js';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import WeeklyOverview from './WeeklyOverview.js';
import withAuth from '../../../features/reducers/withAuth';
const User = () => {
  const user = useSelector(loginSuccess);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (user.payload.token == null && !isAuthenticated) {
      router.push('/pages/login');
    }
  }, [isAuthenticated, user.payload.token, router]);

  if (!isAuthenticated && !user.payload.token) {
    return null;
  }

  return (
    <>
      <div style={{ }}>
        <h1 style={{ fontSize: '48px', fontWeight: '600', fontFamily: 'Nunito Sans', marginBottom: '20px',color:'#202224',fontFamily:'Nunito Sans' }}>Dashboard</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', magrin: '200px' }}>
          <Card1 number={30} percentage={5} />
          <Card2 number={5} percentage={9.3}/>
          <Card3 number={20} percentage={2.5}/>
          <Card4 number={15} percentage={3.6}/>
        </div>
        <WeeklyOverview/>
      </div>


    </>
    
  );
};

export default withAuth(User);
