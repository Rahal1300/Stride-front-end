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
const createData = (ID, name, Description, Start, End,Progress,STATUS) => {
  return { ID, name, Description, Start, End,Progress,STATUS }
}

const rows = [
  createData(
    '00001',
    'Christine Brooks',
    '089 Kutch Green Apt. 448',
    '2024-05-06',
    '2024-05-09',
    '95%',
    'Completed'
  ),
  createData(
    '00002',
    'Rosie Pearson',
    '979 Immanuel Ferry Suite 526',
    '2024-05-15',
    '2024-05-31',
    '66%',
    'In Progress'
  ),
  createData(
    '00003',
    'Darrell Caldwell',
    '8587 Frida Ports',
    '2019-11-23',
    '2019-11-23',
    '75%',
    'Canceled'
  ),
  createData(
    '00004',
    'Gilbert Johnston',
    '768 Destiny Lake Suite 600',
    '2019-02-05',
    '2019-02-05',
    '100%',
    'Completed'
  ),
  createData(
    '00005',
    'Alan Cain',
    '042 Mylene Throughway',
    '2019-07-29',
    '2019-07-29',
    '42%',
    'In Progress'
  ),
  createData(
    '00006',
    'Alfred Murray',
    '543 Weimann Mountain',
    '2019-08-15',
    '2019-08-15',
    '100%',
    'Completed'
  ),
  createData(
    '00007',
    'Maggie Sullivan',
    'New Scottieberg',
    '2019-12-21',
    '2019-12-21',
    '64%',
    'In Progress'
  ),
  createData(
    '00008',
    'Rosie Todd',
    'New Jon',
    '2019-04-30',
    '2019-04-30',
    '20%',
    'On Hold'
  ),
  createData(
    '00009',
    'Dollie Hines',
    '124 Lyla Forge Suite 975',
    '2019-01-09',
    '2019-01-09',
    '40%',
    'On Hold'
  ),
];

const applyFilters = (data, filters) => {
  let filteredData = [...data];

  // Apply status filter if filters exist and status is defined
  if (filters && filters.status) {
    filteredData = filteredData.filter(row => row.STATUS === filters.status);
  }
  if (filters && filters.date && filters.date.start && filters.date.end) {
    const startDate = new Date(filters.date.start);
    const endDate = new Date(filters.date.end);

    // Filter projects that started on or after the start date
    filteredData = filteredData.filter(row => {
      const projectStartDate = new Date(row.Start);
      return projectStartDate >= startDate;
    });

    // Filter projects that ended on or before the end date
    filteredData = filteredData.filter(row => {
      const projectEndDate = new Date(row.End);
      return projectEndDate <= endDate;
    });
  }
  // Apply progress filter if filters exist and progress is defined
  if (filters && filters.progress) {
    const { min, max } = filters.progress;
    filteredData = filteredData.filter(row => {
      const progressValue = parseFloat(row.Progress);

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
  }));
  return filteredData;
};



const FilterCard = () => {
    const router = useRouter();
    const [dateAnchorEl, setDateAnchorEl] = useState(null);
    const [typeAnchorEl, setTypeAnchorEl] = useState(null);
    const [statusAnchorEl, setStatusAnchorEl] = useState(null);
    const [icon1Path, setIcon1Path] = useState("/images/icons/orderlistC.png");
    const [icon2Color, setIcon2Color] = useState("#979797");
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(6); // Number of projects to display per page
    const usertoken = useSelector(loginSuccess);
    const [showTable, setShowTable] = useState(true); // State to toggle between table and project card view
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [filters, setFilters] = useState({
      status: null,
      progress: null,   
    date: null, 
    });
    const [decodedToken, setDecodedToken] = useState(null);

    const [progressAnchorEl, setProgressAnchorEl] = useState(null);
    const [selectedProgress, setSelectedProgress] = useState(null);
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
          }
          const data = await response.json();
          console.log("projects:",data);
          if (!data || data.length === 0) {
            throw new Error('Empty response received');
            setLoading(false);

          }
          setProjects(data);
          console.log("Project list ",data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      };
    

        if (usertoken) {
          const base64Url = usertoken.payload.token.split('.')[1];
          const base64 = base64Url.replace('-', '+').replace('_', '/');
          const decodedToken = JSON.parse(window.atob(base64));
          setDecodedToken(decodedToken);
        }
     
      fetchData();
    }, [usertoken]);
    const isAdmin = decodedToken && decodedToken.role === 'Admin';
    const isTeamManager = decodedToken && decodedToken.cr === 'TeamManager';
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
      const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Set time to 00:00:00
      // Define the date filter based on the selected option
      switch (dateOption) {
        
        case 'This Year':
          const currentYear = today.getFullYear();
          dateFilterStart = `${currentYear}-01-01`; // Start date is the first day of the current year
          dateFilterEnd = `${currentYear}-12-31`; // End date is the last day of the current year
          console.log("dateOption",dateOption);
          console.log("dateFilterStart",dateFilterStart);
          break;
        
        case 'This Week':
          const firstDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
          dateFilterStart = firstDayOfWeek.toISOString().split('T')[0];
          // Calculate the end date of the week (Saturday)
          const lastDayOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
          dateFilterEnd = lastDayOfWeek.toISOString().split('T')[0];          break;
        case 'This Month':
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          dateFilterStart = firstDayOfMonth.toISOString().split('T')[0];
          // Calculate the end date of the month
          const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          dateFilterEnd = lastDayOfMonth.toISOString().split('T')[0];
          break;
        default:
          dateFilterStart = null;
          dateFilterEnd = null;
      }
    
    setFilters({
        ...filters,
        status: null, // Reset status filter
        progress: null, // Reset progress filter
        date: { start: dateFilterStart, end: dateFilterEnd }
      });
    
      setDateAnchorEl(null); // Close the date filter menu after selecting
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
          // Default case for other scenarios
          minProgress = 0;
          maxProgress = 100;
      }
    
      // Update the filters state with the selected progress range
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


        // Reset other filter criteria as needed
      });
    };
  
    const handleView = () => {
      router.push('/pages/CreateProject');
    };
    
    // Modify the handleStatusSelect function to update the selected status
    const handleStatusSelect = (status) => {
      setFilters({
        ...filters,
        progress: null,
        date: null,
        // Reset progress filter
        status
      });
      console.log("status",status);
      console.log("setFilters",filters);

      setStatusAnchorEl(null); // Close the status filter menu after selecting
    };
  
    const filteredProjects = selectedStatus ? projects.filter(project => project.status === selectedStatus) : projects;
    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  
    // Change page
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
          <input
            type="text"
            placeholder="Search Projects"
            style={{
              width: '100%',
              height: '44px',
              border: '1px solid #ccc',
              borderRadius: '20px',
              padding: '0 10px 0 40px',
              backgroundImage: `url('/images/icons/search.png')`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '10px center',
              backgroundSize: '20px',
            }}
          />
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
  {isAdmin || isTeamManager ? (
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
  
  
  
        <TableContainer style={{ borderRadius: 10, border: '0.6px  #D5D5D5 ', maxWidth: 818,marginTop:100 }}>
          <Table size="small" aria-label="filter options" style={{ borderCollapse: 'collapse', backgroundColor: '#FFFFFF', maxWidth: 818, borderRadius: 10, border: '0.6px solid #D5D5D5' }}>
            <TableBody>
              <TableRow>
                <TableCell >
             
                    <Image src="/images/icons/filter.png" width={20} height={20} alt="Filter Icon" />
             
                </TableCell>
                {/* Filter By label with icon */}
                <TableCell style={{ borderRight: '1px solid #CCCCCC', borderLeft: '1px solid #CCCCCC' }}>
                  <Button
                    style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
                  >
                    Filter By
                  </Button>
              
                </TableCell>
                {/* Date filter dropdown */}
                <TableCell style={{ borderRight: '1px solid #CCCCCC', borderLeft: '1px solid #CCCCCC' }}>
                  <Button
                    onClick={handleDateOpen}
                    style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
                  >
                    Date
                  </Button>
                  <Image src="/images/icons/path.png" width={12} height={7} alt="Filter Icon" />
  
                  <Menu anchorEl={dateAnchorEl} open={Boolean(dateAnchorEl)} onClose={handleDateClose}>
                    {/* Add date options here */}
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
                {/* Order Status filter dropdown */}
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
    {/* Add order status options here */}
    <MenuItem onClick={() => handleStatusSelect('Completed')}>Completed</MenuItem>
    <MenuItem onClick={() => handleStatusSelect('In Progress')}>In Progress</MenuItem>
    <MenuItem onClick={() => handleStatusSelect('Canceled')}>Canceled</MenuItem>
    <MenuItem onClick={() => handleStatusSelect('On Hold')}>On Hold</MenuItem>

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

          <Grid container spacing={2} >
          {currentProjects.map((project, index) => (
  <Grid item xs={12} sm={6} md={4} key={index}>

    {!showTable ? <ProjectCard project={project} /> : null}   

  </Grid>
))}
{showTable && <TableProject rows={applyFilters(projects, filters)} />}


          </Grid>)}
          { !loading && !error && !showTable && (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
  <Typography variant="body2">
    Showing {indexOfFirstProject + 1}-{Math.min(indexOfLastProject, projects.length)} of {projects.length}
  </Typography>
  <Box sx={{  marginTop: 20 ,height:'30px' }}>
    <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} sx={{color:'#202224',backgroundColor:'white'}}>
      <ArrowBackIosNewRoundedIcon/>
    </Button>
    <Button onClick={() => paginate(currentPage + 1)} disabled={indexOfLastProject >= projects.length} sx={{color:'#202224' ,backgroundColor:'white',}}>
    <ArrowForwardIosRoundedIcon/>
    </Button>
  </Box>
</Box>

)}

        </Box>
      </div>
    );
  };
  
  export default withAuth(FilterCard);
