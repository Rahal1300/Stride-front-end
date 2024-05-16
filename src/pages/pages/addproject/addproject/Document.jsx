import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';  // Import the Close icon
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Close from 'mdi-material-ui/Close'
import { loginSuccess } from '../../../../features/reducers/authReducer'
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';

const Uploaddoc = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false); // Add loading state

  const handleFileChange = (event) => {
    
    const allowedFileTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
  
    const newFiles = Array.from(event.target.files).filter((file) => allowedFileTypes.includes(file.type)).map((file) => ({
      file,
      uploadTime: new Date(),
    }));
  
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };
  

  const usertoken = useSelector(loginSuccess);

  const handleDownload = async (file,index) => {
    setLoading(true);

    const formData = new FormData();
  
    // Create a new File object with a modified name
    const labeledFile = new File([file], file.name);
  
    // Append the labeled file to formData
    formData.append('files', labeledFile);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id}/uploaddocuments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
        body: formData,
      });
      if (response.ok) {
        const data = await response.text();
        // Optionally, you can reset the uploadedFiles state after a successful upload.
        removeFile(index)
      } else {
        setLoading(false);

        console.error('Error uploading documents:', response.statusText);
      }
    } catch (error) {
      console.error('Error uploading documents:', error.message);
    }
  };
  

  const removeFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const clearAllFiles = () => {
    setUploadedFiles([]);
  };

  const handleBackToUploadDoc = () => {
    router.push({
      pathname: '/pages/projectdetail/',
      query: {
        id: id,
      },
    });
  };

const handleUploadAll = async () => {
  setLoading(true);

 const formData = new FormData();

 const allFiles = uploadedFiles.map(({ file }) => file);
 if (Array.isArray(allFiles)) {
  allFiles.forEach(function(file) {
    formData.append('documents', file);
  });
} else {
  formData.append('documents', allFiles);
}

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/projects/${id}/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${usertoken.payload.token}`,

      },
      body: formData,
    });

    if (response.ok) {
      setLoading(false);

      const data = await response.text();
      setUploadedFiles([]);
    } else {
      setLoading(false);

      console.error('Error uploading documentsin :', response.statusText);
    }
  } catch (error) {
    console.error('Error uploading documents :', error.message);
  }
};
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
          Uploading Files
        </Typography>
      </div>
    )}
    <Box  >  <Button
    variant="contained"
    color="primary"
    onClick={handleBackToUploadDoc}
    style={{ marginTop: '20px' }}
  >
    {t('Back')}
  </Button>
    <Box style={{ marginTop: '50px' }}>
       
      <Card style={{ padding: '20px', height: '400px', marginBottom: '20px' }}>
        <Box style={{ border: '2px dashed #aaa', padding: '20px', height: '100%' }}>
          <Box mb={2} display="flex" alignItems="center" justifyContent="center" flexDirection="column" style={{ paddingTop: '80px' }}>
            <Typography variant="h6" gutterBottom>
              {t('addFilesTitle')} 
            </Typography>
            <img src="/images/ourimg/path.png" />
            <label htmlFor="file-input">
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                multiple
                style={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                component="span"
                style={{ border: 'none', color: "#8610CB", fontWeight: 'bold' }}

              >
                {t('uploadButton')}
              </Button>
              {t('orDragAndDrop')}
              <Typography variant="body2" gutterBottom>
                {t('uploadFileType')}
              </Typography>
            </label>
          </Box>
        </Box>
        
      </Card>

      <Button
        variant="contained"
        color="primary"
        onClick={handleUploadAll}
        disabled={uploadedFiles.length === 0}
        style={{ marginTop: '20px' }}
      >
        {t('Upload_All')}
      </Button>
      {uploadedFiles.length > 0 ? (
        <Box mb={2}>
          <Grid container spacing={2}>
            {uploadedFiles.map(({ file, uploadTime }, index) => (
              <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                <Card style={{ borderRadius: '10px' }}>     <IconButton
                      color="primary"
                      onClick={() => removeFile(index)}
                    >
                        <Close />
                    </IconButton>
                  <CardContent >
             
                    <Typography variant="body2">{t('uploadedOnLabel')} {uploadTime.toLocaleString()}</Typography>
                    <Typography variant="h6"> {file.name}</Typography>
                   
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleDownload(file,index)}
                      style={{ marginTop: '10px', border: 'none', boxShadow: 'none' }}
                      
                    >
                      {t('uploadButton')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleDownload(file)}
                      style={{ marginTop: '10px', border: 'none', boxShadow: 'none' }}
                    >
                      {t('Access')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <Typography variant="body2">   {t('uploaded_yet')}</Typography>
      )}

      <Button variant="contained" color="primary" onClick={clearAllFiles} disabled={uploadedFiles.length === 0}>
        {t('Clear_All')}
      </Button>
    </Box></Box>
    </>
  );
};

export default Uploaddoc;
