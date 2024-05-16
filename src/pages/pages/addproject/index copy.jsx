
///
import React, { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Magnify from 'mdi-material-ui/Magnify';
import Plus from 'mdi-material-ui/Plus';
import Paperclip from 'mdi-material-ui/Paperclip';
import SwapVertical from 'mdi-material-ui/SwapVertical';
import Projects from './ViewPorject/Viewprojects';
import Typography from '@mui/material/Typography';
import New from './addproject';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useRouter } from 'next/router';
import Insert from './addproject/insertproject';
import { useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for loading indicator
import BlankLayout from 'src/@core/layouts/BlankLayout'

const Index = () => {
  const [activeTab, setActiveTab] = useState('Projects');
  const [loading, setLoading] = useState(true); // State variable for loading indicator
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  const handleTabSelect = (selectedTab) => {
    setActiveTab(selectedTab);
    // Perform additional actions as needed when a tab is clicked
  };
  useEffect(() => {
    const checkAuthentication = async () => {
      if (usertoken.payload.token == null && isAuthenticated === false) {
        router.push('/pages/login');
      }

      const fetchData = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/profil`, {
            headers: {
              Authorization: `Bearer ${usertoken.payload.token}`,
            },
          });
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false); // Set loading to false when data is fetched (or an error occurs)
        }
      };

      fetchData();
    };

    checkAuthentication();
  }, []); // Empty dependency array
  const defaultTabStyles = {
    border: 0,
    color: theme.palette.text.primary,
    marginBottom: '-1px',
    cursor: 'pointer',
  };

  const activeTabStyles = {
    ...defaultTabStyles,
    border: 0,
    borderBottom: '2px solid',
    color: theme.palette.text.primary,
  };
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const usertoken = useSelector(loginSuccess);
  const [userData, setUserData] = useState(null);
  if (!isAuthenticated && usertoken.payload.token === null) {

    return null;
  }
  const handleGoToInsertTab = () => {
    setActiveTab('Addproject');
  };

  return (
    <div className="content-wrapper">
      <div>
        <Typography variant="h4" color="primary" className="text-center" style={{ marginBottom: '-100px' }}>
          {t('Browse')}
        </Typography>
        <img src="/ourimg/bg-FAQ.png" alt="Background Image" className="img-fluid" width={'100%'} style={{ height: '150px' }} />
      </div>

      <div className="content-container">
        {loading ? ( // Display loading indicator while fetching user data
          <div >
          </div>
        ) : (
          userData && userData.role === 'User' ? (
            <div className="d-flex justify-content-center align-items-center">
              {activeTab === 'Projects' && <Projects />}
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-center align-items-center ">
                <Tabs
                  defaultActiveKey="Projects"
                  id="uncontrolled-tab-example"
                  className="mb-3 mt-2 border-0"
                  onSelect={handleTabSelect}
                  activeKey={activeTab}
                >
                  <Tab
                    eventKey="Projects"
                    title={
                      <span style={activeTab === 'Projects' ? activeTabStyles : defaultTabStyles}>
                        <Magnify /> {t('Projects')}
                      </span>
                    }
                  ></Tab>
                  <Tab
                    eventKey="Addproject"
                    title={
                      <span style={activeTab === 'Addproject' ? activeTabStyles : defaultTabStyles}>
                        <Plus /> {t('Add')}
                      </span>
                    }
                  ></Tab>
                 
                </Tabs>
              </div>

              {activeTab === 'Projects' && <Projects onGoToInsertTab={handleGoToInsertTab} />}
              {activeTab === 'Addproject' && <Insert />}
            
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Index;
