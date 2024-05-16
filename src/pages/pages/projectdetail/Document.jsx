import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';
import DownloadIcon from '@mui/icons-material/Download';
const UploadDoc = ({ project }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const usertoken = useSelector(loginSuccess);
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation();
    const router = useRouter();

    const year = 2021;

    const [projects, setProjects] = useState([]);

    const handleDownload = async (file) => {
        try {
            const { url, name } = file;
            const decodedContent = atob(url);
            const arrayBuffer = new Uint8Array(decodedContent.length);
            for (let i = 0; i < decodedContent.length; i++) {
                arrayBuffer[i] = decodedContent.charCodeAt(i);
            }
            const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.download = name;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const clearAllFiles = () => {
        setUploadedFiles([]);
    };

    const navigateToAddFile = () => {
        router.push({
            pathname: '/pages/addproject/addproject/Document',
            query: {
                id: project.id,
            },
        });
    };

    // const idproject = id.id;

    useEffect(() => {
        setUploadedFiles(project.documents );
        setProjects(project);
        // const fetchFiles = async () => {
        //     setLoading(true);
        //     try {
        //         const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${idproject}`, {
        //             method: 'GET',
        //             headers: {
        //                 Authorization: `Bearer ${usertoken.payload.token}`,
        //             },
        //         });
        //         const data = await response.json();
        //         setUploadedFiles(data.documents || []);
        //         setProjects(data);
        //         setLoading(false);
        //     } catch (error) {
        //         console.error('Error fetching files:', error);
        //         setLoading(false);
        //     }
        // };

        // fetchFiles();
    }, [ usertoken,projects,project]);

    return (
        <>
            {loading && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 9999,
                    }}
                >
                    <CircularProgress size={70} />
                    <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                        Loading...
                    </Typography>
                </div>
            )}

            {projects && (
                projects.userRoleInProject == 'Collaborator' || projects.userRoleInProject == 'Guest' ? (
                    <Card style={{ marginTop: '10px', width: '100%', backgroundColor: 'transparent', border: 'none', boxShadow: '0px 0px 0px 0px rgba(0,0,0,0)' }}>
                    <Box style={{ marginTop: '20px', padding: '15px'}}>
                        {projects.documents && projects.documents.length > 0 ? (
                                <Box mb={2}>
                                    <Grid container spacing={2}>
                                    {projects.documents.map(({ documentName, content }, index) => (
                                                <Grid key={index} item xs={12} sm={6} md={4} lg={4}>
                                                <Card style={{ borderRadius: '10px', height: '100%', width: '100%', overflowY: 'auto',padding:'10px'  }}>
                                                    <CardContent style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
                                                        <Typography variant="body1" style={{ fontSize: '12px' }}>{documentName}</Typography>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                                            <Button onClick={() => handleDownload({ url: content, name: documentName })} variant="contained" color="primary">
                                                                <DownloadIcon/>
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            ) : (
                                <Typography variant="body2"> {t('uploaded_yet')}</Typography>
                            )}
                        </Box>
                    </Card>
                ) : (
                    <div>
{projects && projects.documents && projects.documents.length > 0 ? (
    <Card style={{ marginTop: '10px', width: '100%', backgroundColor: 'transparent', border: 'none', boxShadow: '0px 0px 0px 0px rgba(0,0,0,0)' }}>
    <Box style={{ marginTop: '20px', padding: '15px'}}>
                                    <Button variant="contained" color="primary" style={{ margin: '10px' }} onClick={navigateToAddFile}>
                                        {t('Upload Files')}
                                    </Button>
                                    <Box mb={2} >
                                        <Grid container spacing={2}>
                                        {projects && projects.documents.map(({ documentName, content }, index) => (
                                                <Grid key={index} item xs={12} sm={6} md={4} lg={4}>
                                                    <Card style={{ borderRadius: '10px', height: '100%', width: '100%', overflowY: 'auto',padding:'10px'  }}>
                                                        <CardContent style={{ display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
                                                            <Typography variant="body2" style={{ fontSize: '12px' }}>{documentName}</Typography>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between',margin:2,marginTop:10 }}>
                                                                <Button onClick={() => handleDownload({ url: content, name: documentName })} variant="contained" color="primary" size="small">
                                                                <DownloadIcon/>
                                                                </Button>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Box>
                                </Box>
                            </Card>
                        ) : (
                            <Button onClick={navigateToAddFile}  sx={{  padding: '30px' }}>
                                {t('Upload Files')}
                            </Button>
                        )}
                    </div>
                )
            )}
        </>
    );
};

export default UploadDoc;
