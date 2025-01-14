import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, Button, Menu, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box, Grid } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { loginSuccess } from '../../../features/reducers/authReducer';
import CustomizedProgressBars from './loading';
import Snackbar from '@mui/material/Snackbar';
//import ImportExcelButton from './ImportExcelButton';
import TableLeads from './table';
import withAuth from '../../../features/reducers/withAuth';

const PageLeads = () => {
    const router = useRouter();
    const [dateAnchorEl, setDateAnchorEl] = useState(null);
    const [typeAnchorEl, setTypeAnchorEl] = useState(null);
    const [statusAnchorEl, setStatusAnchorEl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [Company, setCompany] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const usertoken = useSelector(loginSuccess);
    const [templateUrl, setTemplateUrl] = useState('/assets/Leads.xlsx');
    const [leads, setLeads] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); // Add state for search query

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => 
            lead.first_name.toLowerCase().includes(searchQuery.toLowerCase()) // Adjust 'name' to the appropriate field
        );
    }, [leads, searchQuery]);

    const handleDateOpen = (event) => {
        setDateAnchorEl(event.currentTarget);
    };

    const handleDateClose = () => {
        setDateAnchorEl(null);
    };

    const handleTypeOpen = (event) => {
        setTypeAnchorEl(event.currentTarget);
    };

    const handleTypeClose = () => {
        setTypeAnchorEl(null);
    };

    const handleStatusOpen = (event) => {
        setStatusAnchorEl(event.currentTarget);
    };

    const handleStatusClose = () => {
        setStatusAnchorEl(null);
    };

    const SendAdduser = () => {
        router.push('/pages/AddLeads');
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const handleDownloadTemplate = () => {
        const link = document.createElement('a');
        link.href = templateUrl;
        link.download = 'Leads.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/leads`, {
                    headers: {
                        Authorization: `Bearer ${usertoken.payload.token}`,
                    },
                });
                const data = await response.json();

                if (!response.ok) {
                    setSnackbarMessage('Something went wrong !!');
                    setSnackbarOpen(true);
                }
                if (!data || data.length === 0) {
                    setSnackbarMessage("Oops, you don't have any Leads yet");
                    setSnackbarOpen(true);
                }
                if (response.ok) {
                    setLeads(data);
                    setLoading(false);
                }
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [usertoken]);

    return (
        <div>
            {loading ? (<CustomizedProgressBars />) : (
                <>
                    <Box sx={{ marginTop: 2 }}>
                        <Grid container alignItems="center" justifyContent="space-between" spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h3" component="div" sx={{ fontWeight: 700 }}>
                                    Leads
                                </Typography>
                            </Grid>
                            <Grid item xs={12} container alignItems="center" spacing={2}>
                                <Grid item xs={6} sm={6}>
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery} // Bind input value to searchQuery
                                        onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
                                        style={{
                                            width: '50%', // Adjusted width
                                            height: '44px',
                                            border: '1px solid #ccc',
                                            borderRadius: '20px',
                                            padding: '0 10px 0 40px',
                                            backgroundImage: `url('/images/icons/search.png')`,
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: '10px ',
                                            backgroundSize: '20px',
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                    {/*<ImportExcelButton />*/}
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                    <Button
                                        type="submit"
                                        onClick={handleDownloadTemplate}
                                        sx={{
                                            color: 'white',
                                            height: '44px',
                                            textTransform: 'none',
                                            background: '#6226EF',
                                            '&:hover': {
                                                background: '#6226EF',
                                            },
                                            width: '100%', // Make the button take up full width
                                        }}
                                    >
                                        + Download Template
                                    </Button>
                                </Grid>
                                <Grid item xs={6} sm={2}>
                                    <Button
                                        type="submit"
                                        sx={{
                                            color: 'white',
                                            height: '44px',
                                            textTransform: 'none',
                                            background: '#6226EF',
                                            '&:hover': {
                                                background: '#6226EF',
                                            },
                                            width: '100%', // Make the button take up full width
                                        }}
                                        onClick={SendAdduser}
                                    >
                                        + Add new
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>

                    <TableContainer style={{ borderRadius: 10, border: '0.6px solid #D5D5D5', width: '94.2%', marginTop: 100, marginLeft: 42 }}>
                        <Table size="small" aria-label="filter options" style={{ borderCollapse: 'collapse', backgroundColor: '#FFFFFF', width: '100%', borderRadius: 10, border: '0.6px solid #D5D5D5' }}>
                            <TableBody>
                                <TableRow>
                                    <TableCell style={{ width: '5%' }}>
                                        <Image src="/images/icons/filter.png" width={20} height={20} alt="Filter Icon" />
                                    </TableCell>
                                    <TableCell style={{ width: '19%', borderRight: '1px solid #CCCCCC', borderLeft: '1px solid #CCCCCC' }}>
                                        <Button
                                            onClick={handleDateOpen}
                                            style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
                                        >
                                            Filter By
                                        </Button>
                                        <Menu anchorEl={dateAnchorEl} open={Boolean(dateAnchorEl)} onClose={handleDateClose}>
                                            <MenuItem onClick={handleDateClose}>Option 1</MenuItem>
                                            <MenuItem onClick={handleDateClose}>Option 2</MenuItem>
                                            <MenuItem onClick={handleDateClose}>Option 3</MenuItem>
                                        </Menu>
                                    </TableCell>
                                    <TableCell style={{ width: '19%', borderRight: '1px solid #CCCCCC', borderLeft: '1px solid #CCCCCC' }}>
                                        <Button
                                            onClick={handleDateOpen}
                                            style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
                                        >
                                            Date
                                        </Button>
                                        <Image src="/images/icons/path.png" width={12} height={7} alt="Filter Icon" />
                                        <Menu anchorEl={typeAnchorEl} open={Boolean(typeAnchorEl)} onClose={handleTypeClose}>
                                            <MenuItem onClick={handleTypeClose}>Option 1</MenuItem>
                                            <MenuItem onClick={handleTypeClose}>Option 2</MenuItem>
                                            <MenuItem onClick={handleTypeClose}>Option 3</MenuItem>
                                        </Menu>
                                    </TableCell>
                                    <TableCell style={{ width: '19%' }}>
                                        <Button
                                            onClick={handleStatusOpen}
                                            sx={{}}
                                            style={{ backgroundColor: '#FFFFFF', color: '#202224', textTransform: 'none', fontSize: '14px' }}
                                        >
                                            Status
                                        </Button>
                                        <Image src="/images/icons/path.png" width={12} height={7} alt="Filter Icon" />
                                        <Menu anchorEl={statusAnchorEl} open={Boolean(statusAnchorEl)} onClose={handleStatusClose}>
                                            <MenuItem onClick={() => handleStatusSelect('ACTIVE')}>Active</MenuItem>
                                            <MenuItem onClick={() => handleStatusSelect('Suspended')}>Suspended</MenuItem>
                                            <MenuItem onClick={() => handleStatusSelect('Out')}>Out</MenuItem>
                                        </Menu>
                                    </TableCell>
                                    <TableCell style={{ width: '19%' }}>
                                        <Button
                                            style={{ backgroundColor: '#FFFFFF', color: '#EA0234', textTransform: 'none' }}
                                        >
                                            <Image src="/images/icons/replay.png" width={18} height={18} alt="Reset Icon" />
                                            Reset Filter
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ margin: 10 }}>
                        <TableLeads leads={filteredLeads} /> {/* Use filtered leads here */}
                    </Box>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        message={snackbarMessage}
                    />
                </>
            )}
        </div>
    );
};

export default withAuth(PageLeads);