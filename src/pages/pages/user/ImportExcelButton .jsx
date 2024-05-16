import React, { useState, useRef } from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import * as XLSX from 'xlsx';
import MuiSnackbarContent from '@mui/material/SnackbarContent';
const ImportExcelButton = () => {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarColor, setSnackbarColor] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Check if the file name matches the required template filename
    if (file.name !== 'templateUsers.xlsx') {
      setSnackbarMessage('Please select the template file named templateUsers.xlsx');
      setSnackbarOpen(true);
      setSnackbarColor('red'); // Set red color for error
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Check if excelData has more than one row
      if (excelData.length <= 1) {
        setSnackbarMessage('The Excel file does not contain data');
        setSnackbarColor('red'); // Set red color for error
        setSnackbarOpen(true);
        inputRef.current.value = null; // Reset input value

        return;
      }
      console.log('Excel Data:', excelData);
      // Check for invalid email addresses
      const invalidEmails = excelData.slice(1).filter((row, index) => {
        const email = row[0];
        const isValid = /\S+@\S+\.\S+/.test(email); // Regular expression for email validation
        if (!isValid) {
          console.log(`Invalid email found at line ${index + 2}: ${email}`);
        }
        return !isValid;
      });
  
      if (invalidEmails.length > 0) {
        setSnackbarMessage(`The Excel file contains invalid email addresses: ${invalidEmails.join(', ')}`);
        setSnackbarColor('red'); // Set red color for error
        setSnackbarOpen(true);
        inputRef.current.value = null; // Reset input value


        return;
      }
  
      // If everything is correct, proceed with further processing
      setSnackbarMessage('Import done, creating invitations for your users, Please Wait');
      setSnackbarColor('green'); // Set green color for success
      setSnackbarOpen(true);
      inputRef.current.value = null; // Reset input value

    };
    reader.readAsArrayBuffer(file);

  };
  
  
  

  const handleButtonClick = () => {
    inputRef.current.click(); // Trigger file selection dialog
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
        style={{ display: 'none' }} // Hide the input element
        onChange={handleFileUpload}
      />
      <Button
        type="button" // Ensure it's not treated as form submission
        onClick={handleButtonClick}
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
        {loading ? 'Importing...' : '+ Import'}
      </Button>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={3000} // Adjust as needed
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
      color: 'white', // Change text color if needed
    }}
  />
</Snackbar>


    </>
  );
};

export default ImportExcelButton;
