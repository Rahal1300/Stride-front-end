import React from 'react';

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import ListProjects from './list';
import { useSelector } from 'react-redux';
import  { useEffect } from 'react';
import { useRouter } from 'next/router'
import withAuth from '../../../features/reducers/withAuth';
const FAQPage = () => {

    const isAuthenticated = useSelector((state) => state.isAuthenticated);
    const router = useRouter();
  
    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/pages/login');
  
      }
    }, [isAuthenticated]);
  return (
    <div className="content-wrapper">
      <div className="position-relative">
        <img src="/ourimg/bg-FAQ.png" alt="Background Image" className="img-fluid" width={'100%'}/>

        <div className="position-absolute top-50 start-50 translate-middle text-center">
          <div>
            <h2 className="mb-3 mb-md-4" style={{ color: '#8C11D4'}}>Here you can search for your project</h2>

            
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1"> <img src="/ourimg/search.png" alt="Search Icon"  className='border-0'  /></InputGroup.Text>
              <Form.Control
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </div>
        </div>
      </div>
      <div>
      </div>
      <ListProjects/>
    </div>
  );
};

export default withAuth(FAQPage);
