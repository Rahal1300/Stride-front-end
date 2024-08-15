import React, { useState, useEffect } from 'react';
import { Card, CardContent, Button, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box ,Grid  } from '@mui/material';
// Adjust the path according to your project structure
import Image from 'next/image';
import { MarginRounded } from '@mui/icons-material';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';

import ProjectCard from './ProjectCards';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import CustomizedProgressBars from './loading';
import TableProject from './Table';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import withAuth from '../../../features/reducers/withAuth';
import NoProjectsMessage from './NoProjectsMessage';
const createData = (ID, name, Description, Start, End,Progress,STATUS) => {
  return { ID, name, Description, Start, End,Progress,STATUS }
}



const applyFilters = (data, filters) => {
  let filteredData = [...data];

  if (filters && filters.status) {
    filteredData = filteredData.filter(row => row.status === filters.status);
  }
  if (filters && filters.date && filters.date.start && filters.date.end) {
    const startDate = new Date(filters.date.start);
    const endDate = new Date(filters.date.end);
    filteredData = filteredData.filter(row => {
      const projectStartDate = new Date(row.startDate);
      return projectStartDate >= startDate;
    });

    filteredData = filteredData.filter(row => {
      const projectEndDate = new Date(row.enddate);
      return projectEndDate <= endDate;
    });
  }
  if (filters && filters.progress) {
    const { min, max } = filters.progress;
    filteredData = filteredData.filter(row => {
      const progressValue = parseFloat(row.progress);

      return progressValue >= min && progressValue <= max;
    });
  }
  filteredData = filteredData.map(project => ({
    id: project.id,
    projectName: project.projectName,
    description: project.description,
    startDate: project.startDate,
    enddate: project.enddate,
    progress: project.progress,
    status:project.status,
    image:project.image,
    owner:project.owner,
    projectUsersAndRoles:project.projectUsersAndRoles,

  }));
  return filteredData;

};



const FilterCard = () => {
    const router = useRouter();
    const [dateAnchorEl, setDateAnchorEl] = useState(null);
    const [typeAnchorEl, setTypeAnchorEl] = useState(null);
    const [statusAnchorEl, setStatusAnchorEl] = useState(null);
    const [icon1Path, setIcon1Path] = useState("/images/icons/orderlist.png");
    const [icon2Color, setIcon2Color] = useState("#6226EF");
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(6); 
    const usertoken = useSelector(loginSuccess);
    const [showTable, setShowTable] = useState(false); 
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [filters, setFilters] = useState({
      id:null,
      status: null,
      progress: null,   
    date: null, 
    });
    const [decodedToken, setDecodedToken] = useState(null);

    const [progressAnchorEl, setProgressAnchorEl] = useState(null);
    const [selectedProgress, setSelectedProgress] = useState(null);

    const userrole = useSelector(state => state.Role); 
  const  cr  = useSelector(state => state.Cr); 
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/all`, {
            headers: {
              Authorization: `Bearer ${usertoken.payload.token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Failed to fetch data');
            setLoading(false);

          }
          const data = await response.json();
          console.log(data);
          setProjects(data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
    

      
     
      fetchData();
    }, [usertoken]);
    const Owner = userrole === 'Subscriber' && cr === 'Owner';
    const TeamManagerandOwner = userrole === 'Subscriber' &&  cr === 'TeamManager';
    const Manager= userrole === 'User' &&  cr === 'TeamManager';

    const handleClickIcon1 = () => {
      setIcon1Path("/images/icons/orderlistC.png");
      setIcon2Color("#979797");
      setShowTable(true); 
    };
  
    const handleClickIcon2 = () => {
      setIcon1Path("/images/icons/orderlist.png");
   
      setIcon2Color("#6226EF");
      setShowTable(false);
    };
  
    const handleDateOpen = (event) => {
      setDateAnchorEl(event.currentTarget);
    };
  
    const handleDateClose = () => {
      setDateAnchorEl(null);
    };
  

    const handleProgressOpen = (event) => {
      setProgressAnchorEl(event.currentTarget);
    };
  
    const handleProgressClose = () => {
      setProgressAnchorEl(null);
    };
    const handleDateSelect = (dateOption) => {
      let dateFilterStart, dateFilterEnd;
      const currentDate = new Date();
      const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); 

      switch (dateOption) {
        
        case 'This Year':
          const currentYear = today.getFullYear();
          dateFilterStart = `${currentYear}-01-01`; 
          dateFilterEnd = `${currentYear}-12-31`; 

          break;
        
        case 'This Week':
          const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
          dateFilterStart = firstDayOfWeek.toISOString().split('T')[0];
          const lastDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
          dateFilterEnd = lastDayOfWeek.toISOString().split('T')[0];          break;
        case 'This Month':
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          dateFilterStart = firstDayOfMonth.toISOString().split('T')[0];
          const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          dateFilterEnd = lastDayOfMonth.toISOString().split('T')[0];
          break;
        default:
          dateFilterStart = null;
          dateFilterEnd = null;
      }
    
    setFilters({
        ...filters,
        status: null, 
        progress: null, 
        date: { start: dateFilterStart, end: dateFilterEnd }
      });

      setDateAnchorEl(null); 
    };
    
    const handleProgressSelect = (progress) => {
  
      setSelectedProgress(progress);
      setProgressAnchorEl(null);
    
      // Define the progress ranges
      let minProgress, maxProgress;
    
      switch (progress) {
        case '0-25%':
          minProgress = 0;
          maxProgress = 25;
          break;
        case '25-50%':
          minProgress = 25;
          maxProgress = 50;
          break;
        case '50-75%':
          minProgress = 50;
          maxProgress = 75;
          break;
        case '75-100%':
          minProgress = 75;
          maxProgress = 100;
          break;
        default:
          minProgress = 0;
          maxProgress = 100;
      }
    
      setFilters({
        ...filters,
        status: null,
        date: null,

        progress: { min: minProgress, max: maxProgress }
      });
    };
    
    

    
    const handleStatusOpen = (event) => {
      setStatusAnchorEl(event.currentTarget);
    };
  
    const handleStatusClose = () => {
      setStatusAnchorEl(null);
    };
    const handleResetFilters = () => {
      setFilters({
        status: null,
        progress: null,
        date: null,


      });
    };
  
    const handleView = () => {
      router.push('/pages/CreateProject');
    };
    
    const handleStatusSelect = (status) => {
      setFilters({
        ...filters,
        progress: null,
        date: null,
        status
      });
 
      setStatusAnchorEl(null); 
    };
  
    const filteredProjects = selectedStatus ? projects.filter(project => project.status === selectedStatus) : projects;
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    
    return (
      <div>
  <Box sx={{ marginTop: 2 }}>
    <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
      <Grid item xs={12} sm={6}>
        <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
          Projects 
        </Typography>
      </Grid>
      <Grid item xs={12} sm={6} container spacing={2} alignItems="center">
        <Grid item xs={12} sm={7}>
    
        </Grid>
        <Grid item xs={6} sm={2}>
          <Box
            display="flex"
            alignItems="center"
            border="0.6px solid #D5D5D5"
            bgcolor="#FAFBFD"
            borderRadius="16px"
            padding="2px 9px"
            justifyContent="space-between"
          >
          
            <Image src={icon1Path} width={24} height={24} alt="Icon 1" onClick={handleClickIcon1} />
            <GridViewRoundedIcon onClick={handleClickIcon2} width={24} height={24} style={{ color: icon2Color }} />
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
  {Owner || Manager || TeamManagerandOwner ? (
    <Button
      type="submit"
      onClick={handleView}
      sx={{
        color: 'white',
        height: '44px',
        textTransform: 'none',
        background: '#6226EF',
        '&:hover': {
          background: '#6226EF',
        },
      }}
    >
      + Add new project
    </Button>
  ) : null}
</Grid>

      </Grid>
    </Grid>
  </Box>
  
  
        <TableContainer  style={{ borderRadius: 10,border: '0.6px  #D5D5D5 ', maxWidth: 818,marginTop:100, marginLeft:77}}>
          <Table size="small" aria-label="filter options" style={{ borderCollapse: 'collapse', backgroundColor: '#FFFFFF', maxWidth: 818, borderRadius: 10, border: '0.6px solid #D5D5D5'}}>
            <TableBody style={{width:5000}}>
              <TableRow>
                <TableCell style={{height:20}} >
             
                    <Image src="/images/icons/filter.png" width={20} height={20} alt="Filter Icon" />
             
                </TableCell>
                <TableCell style={{ borderRight: '1px solid #CCCCCC', borderLeft: '1px solid #CCCCCC' }}>
                  <Button
                    style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
                  >
                    Filter By
                  </Button>
              
                </TableCell>
                <TableCell style={{ borderRight: '1px solid #CCCCCC', borderLeft: '1px solid #CCCCCC' }}>
                  <Button
                    onClick={handleDateOpen}
                    style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
                  >
                    Date
                  <Image src="/images/icons/path.png" width={12} height={7} alt="Filter Icon" />
                  </Button>

                  <Menu anchorEl={dateAnchorEl} open={Boolean(dateAnchorEl)} onClose={handleDateClose}>
                    <MenuItem onClick={() => handleDateSelect('This Week')}>This Week</MenuItem>
                    <MenuItem onClick={() => handleDateSelect('This Month')}>This Month</MenuItem>
                    <MenuItem  onClick={() => handleDateSelect('This Year')}>This Year</MenuItem>

                  </Menu>
  
                  <Button
                onClick={handleProgressOpen}
                style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
                  >
                   Progress
                  </Button>
                  <Image src="/images/icons/path.png" width={12} height={7} alt="Filter Icon" />
  
                  <Menu anchorEl={progressAnchorEl} open={Boolean(progressAnchorEl)} onClose={handleProgressClose}>
                    <MenuItem onClick={() => handleProgressSelect('0-25%')}>0%-25%</MenuItem>
                    <MenuItem onClick={() => handleProgressSelect('25-50%')}>25%-50%</MenuItem>
                    <MenuItem onClick={() => handleProgressSelect('50-75%')}>50%-75%</MenuItem>
                    <MenuItem onClick={() => handleProgressSelect('75-100%')}>75%-100%</MenuItem>

              </Menu>
                </TableCell>
                <TableCell >
                  <Button
                    onClick={handleStatusOpen}
                    sx={{}}
  
                    style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
                  >
                     Status
                  </Button>
                  <Image src="/images/icons/path.png" width={12} height={7} alt="Filter Icon" />
  
                  <Menu anchorEl={statusAnchorEl} open={Boolean(statusAnchorEl)} onClose={handleStatusClose}>
    <MenuItem onClick={() => handleStatusSelect('ACTIVE')}>Active
</MenuItem>
    {/* <MenuItem onClick={() => handleStatusSelect('In Progress')}>In Progress</MenuItem>
    <MenuItem onClick={() => handleStatusSelect('Canceled')}>Canceled</MenuItem>
    <MenuItem onClick={() => handleStatusSelect('On Hold')}>On Hold</MenuItem> */}

  </Menu>                
  </TableCell>
                {/* Reset Filter button */}
                <TableCell >
                  <Button
                    style={{ backgroundColor: '#FFFFFF', color: '#EA0234', textTransform: 'none' }} onClick={handleResetFilters}
                  >
                    <Image src="/images/icons/replay.png" width={18} height={18} alt="Reset Icon"    />
                    Reset Filter
                  </Button>
  
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>   
        <Box sx={{margin :10}}>
          {error && <p>Error: {error}</p>}
      
          {!loading && !error && (
            <Box sx={{ margin: 10 }}>
          {projects.length === 0 ? (
            <NoProjectsMessage handleView={handleView} />
          ) : (
                    <Grid container spacing={2}>
                    {applyFilters(currentProjects, filters).map((project, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          {!showTable ? <ProjectCard project={project} /> : null}
                        </Grid>
                      ))}
                      {showTable && <TableProject project={projects} rows={applyFilters(projects, filters)} />}
                    </Grid>
              )}
                      {!showTable && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                <Typography variant="body2">
                  Showing {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, projects.length)} of {projects.length}
                </Typography>
                <Box sx={{ marginTop: 20, height: '30px' }}>
                  <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} sx={{ color: '#202224', backgroundColor: 'white' }}>
                    <ArrowBackIosNewRoundedIcon />
                  </Button>
                  <Button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastProject >= projects.length} sx={{ color: '#202224', backgroundColor: 'white' }}>
                    <ArrowForwardIosRoundedIcon />
                  </Button>
                </Box>
              </Box>
)}
</Box>
)}

        </Box>
      </div>
    );
  };
  
  export default withAuth(FilterCard);
