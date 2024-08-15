import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import * as XLSX from 'xlsx';
import MuiSnackbarContent from '@mui/material/SnackbarContent';
import { loginSuccess } from '../../../features/reducers/authReducer';
import { useSelector } from 'react-redux';
const ImportExcelButton = () => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('');
  const usertoken = useSelector(loginSuccess);
  const [excelData, setExcelData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const fileExtension = file.name.split('.').pop();
    if (fileExtension !== 'xlsx') {
      setSnackbarMessage('Please select a file with the .xlsx extension');
      setSnackbarOpen(true);
      setSnackbarColor('red');
      inputRef.current.value = '';
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      if (excelData.length <= 1) {
        setSnackbarMessage('The Excel file does not contain data');
        setSnackbarColor('red'); 
        setSnackbarOpen(true);
        inputRef.current.value = null; 

        return;
      }
      const invalidEmails = excelData.slice(1).filter((row, index) => {
        const email = row[0];
        const isValid = /\S+@\S+\.\S+/.test(email); 
        if (!isValid) {
          console.log(`Invalid email found at line ${index + 2}: ${email}`);
        }
        return !isValid;
      });
  
       if (invalidEmails.length > 0) {
         setSnackbarMessage(`The Excel file contains invalid email addresses: ${invalidEmails.join(', ')}`);
         setSnackbarColor('red'); 
         setSnackbarOpen(true);
        inputRef.current.value = null; 


        return;
       }
  
      setSnackbarMessage('Import done, creating invitations for your users, Please Wait');
      setSnackbarColor('green'); 
      setSnackbarOpen(true);
      inputRef.current.value = null; 
      API(excelData);

    };
    reader.readAsArrayBuffer(file);

  };
  
  
  const API = async (excelData) => {

    const recipientEmails = excelData.slice(1).map(row => row[0]);

    const requestData = {
      recipientEmails: recipientEmails,
    }; 

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/Invitations/sendall`, {
        method: 'POST',
        headers: {
          
          Authorization: `Bearer ${usertoken.payload.token}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(requestData), 
      });
      console.log(requestData);
      if (response.ok) {
        setSnackbarMessage('Importing successfully , Invite sent to users from Excel');
        setSnackbarColor('green');
        setSnackbarOpen(true);
        inputRef.current.value = null;

      } else {
        const errorMessage = await response.text();
        console.error('Error response from API:', errorMessage);
        setSnackbarMessage(`Error : ${errorMessage}`);
        setSnackbarColor('red');
        setSnackbarOpen(true);

      }
    } catch (error) {
      console.error('Error sending data to the API:', error.message);
        }
  };

  const handleButtonClick = () => {
    inputRef.current.click(); 
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={inputRef}
        style={{ display: 'none' }} 
        onChange={handleFileUpload}
      />
      <Button
        type="button" 
        onClick={handleButtonClick}
        sx={{
          color: 'white',
          height: '44px',
          textTransform: 'none',
          background: '#6226EF',
          '&:hover': {
            background: '#6226EF',
          },
          width: '100%', 
        }}
      >
        {loading ? 'Importing...' : '+ Import'}
      </Button>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={3000} 
  onClose={handleSnackbarClose}
  anchorOrigin={{
    vertical: 'top',
    horizontal: 'center',
  }}

>
  <MuiSnackbarContent
    message={snackbarMessage}
    sx={{
      backgroundColor: snackbarColor,
      color: 'white', 
    }}
  />
</Snackbar>


    </>
  );
};

export default ImportExcelButton;
