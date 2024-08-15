import { useRouter } from 'next/router';

import { useEffect,useState } from 'react';
import { loginSuccess } from './authReducer';
import {  useSelector } from 'react-redux';

 

const withAuth = (WrappedComponent) => {

return (props) => {
    const usertoken = useSelector(loginSuccess);

    const router = useRouter();
    const isAuthenticated = useSelector((state) => state.isAuthenticated);



     useEffect(() => {

      if (usertoken.payload.token == null && isAuthenticated === false) {
       router.push('/pages/login');
     }
     
   
 }, [isAuthenticated]);
   if (!isAuthenticated && usertoken.payload.token === null) {
    return null;
  }
 

   
    return <WrappedComponent {...props} />;

};

};

 

export default withAuth;