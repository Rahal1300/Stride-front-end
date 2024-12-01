import React, {useState, useEffect } from 'react';
import Card1 from './card1.jsx';
import Card2 from './card2.jsx';
import Card3 from './card3.jsx';
import Card4 from './card4.jsx';
import { loginSuccess } from '../../../features/reducers/authReducer.js';
import { useSelector } from 'react-redux';
import WeeklyOverview from './WeeklyOverview.js';
import withAuth from '../../../features/reducers/withAuth';
const Lead = () => {
  const Usertoken = useSelector(loginSuccess);
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const userrole = useSelector(state => state.Role); 
  const  cr  = useSelector(state => state.Cr); 
 

  return (
    <>
      <div style={{ }}>
        <h1 style={{ fontFamily: 'Arial', marginBottom: '20px',color:'#202224',fontFamily:'Arial' }}>Dashboard</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', magrin: '200px' }}>
          <Card1 number={20} percentage={5} />
          <Card2 number={20} percentage={9.3}/>
          <Card3 number={20} percentage={2.5}/>
          <Card4 number={20} percentage={3.6}/>
        </div>
        <WeeklyOverview/>
      </div>


    </>
    
  );
};

export default withAuth(Lead);
