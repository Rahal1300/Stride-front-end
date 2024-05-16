import React, { useState, useEffect } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Magnify from 'mdi-material-ui/Magnify';
import Plus from 'mdi-material-ui/Plus';
import Projects from './ViewPorject/Viewprojects';
import Typography from '@mui/material/Typography';
import New from './addproject';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useRouter } from 'next/router';
import Insert from './addproject/insertproject';
import { useTheme } from '@mui/material/styles';

const Index = () => {
  const [activeTab, setActiveTab] = useState('Projects');
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const usertoken = useSelector(loginSuccess);
  const [userData, setUserData] = useState(null);
  const [numProjects, setNumProjects] = useState(0);
  const [numTeam, setnumTeam] = useState(0);

  useEffect(() => {
    const checkAuthentication = async () => {
      if (!usertoken.payload.token && !isAuthenticated) {
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

          if (data && (data.role === 'Admin' || data.role === 'TeamManager')) {
            setNumProjects(data.projects.length);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      };
      const fetchTeam = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/with-users-and-roles`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${usertoken.payload.token}`,
            },
          });
  
          const data = await response.json();
          setnumTeam(data.length);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error('Error fetching team data:', error);
        }
      };
      fetchData();
      fetchTeam();
    };

    checkAuthentication();

  }, [activeTab, numProjects, router]);

  const handleTabSelect = (selectedTab) => {
    setActiveTab(selectedTab);
    
    // if (activeTab === 'Addproject' && numTeam === 0) {
    //   console.log('numteam in handle ',numTeam);
    //   router.push('/pages/Team');
    // }
    
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
        {loading ? (
          <div>
            
          </div>
        ) : (
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
                title={<span><Magnify /> {t('Projects')}</span>}
              ></Tab>
              {(userData && (userData.role === 'Admin' || userData.role === 'TeamManager')) && (
                <Tab
                  eventKey="Addproject"
                  title={<span><Plus /> {t('Add')}</span>}
                ></Tab>
              )}
            </Tabs>
          </div>
        )}

        {activeTab === 'Projects' && <Projects />}
        {activeTab === 'Addproject'  &&<Insert numProjects={numProjects} />}
      </div>
    </div>
  );
};

export default Index;
