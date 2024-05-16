import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Insert from './insertproject';
import Collaborators from './listCollaborators';
import CheckCircle from 'mdi-material-ui/CheckCircle';
import Meeting from './meeting';
import Uploaddoc from './Document';
import { loginSuccess } from '../../../../features/reducers/authReducer'
import { useSelector } from 'react-redux';

const MyComponent = ({ activeTab }) => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const { t } = useTranslation(); // Hook to access translations
  const  usertoken  = useSelector(loginSuccess);  
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const handleLineClick = (index) => {
    setCurrentColorIndex(index);
  };
  // const base64Url = usertoken.payload.token.split('.')[1];
  // const base64 = base64Url.replace('-', '+').replace('_', '/');
  // const user = JSON.parse(window.atob(base64));
  
  
  const [formData, setFormData] = useState({
    name: '',
    // Add more fields as needed
  });
  

  return (
    <Container>

     <Insert/>
    </Container>
  );
};

export default MyComponent;
