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

  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;
  
  //   // Check if the file name matches the required template filename
  //   if (file.name !== 'Leads.xlsx') {
  //     setSnackbarMessage('Please select the template file named Leads.xlsx');
  //     setSnackbarOpen(true);
  //     setSnackbarColor('red'); // Set red color for error
  //     return;
  //   }
  
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const data = new Uint8Array(e.target.result);
  //     const workbook = XLSX.read(data, { type: 'array' });
  //     const firstSheetName = workbook.SheetNames[0];
  //     const worksheet = workbook.Sheets[firstSheetName];
  //     const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  //     // Check if excelData has more than one row
  //     if (excelData.length <= 1) {
  //       setSnackbarMessage('The Excel file does not contain data');
  //       setSnackbarColor('red'); // Set red color for error
  //       setSnackbarOpen(true);
  //       inputRef.current.value = null; // Reset input value

  //       return;
  //     }
  //     console.log('Excel Data:', excelData);
  //     // Check for invalid email addresses
  //     const invalidEmails = excelData.slice(1).filter((row, index) => {
  //       const email = row[0];
  //       const isValid = /\S+@\S+\.\S+/.test(email); // Regular expression for email validation
  //       if (!isValid) {
  //         console.log(`Invalid email found at line ${index + 2}: ${email}`);
  //       }
  //       return !isValid;
  //     });
  
  //     if (invalidEmails.length > 0) {
  //       setSnackbarMessage(`The Excel file contains invalid email addresses: ${invalidEmails.join(', ')}`);
  //       setSnackbarColor('red'); // Set red color for error
  //       setSnackbarOpen(true);
  //       inputRef.current.value = null; // Reset input value


  //       return;
  //     }
  
  //     // If everything is correct, proceed with further processing
  //     setSnackbarMessage('Import done, creating invitations for your users, Please Wait');
  //     setSnackbarColor('green'); // Set green color for success
  //     setSnackbarOpen(true);
  //     inputRef.current.value = null; // Reset input value

  //   };
  //   reader.readAsArrayBuffer(file);

  // };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
      // Define arrays of required sources and error messages
      const requiredSources = ['Pub', 'Action', 'Fair', 'Direct', 'Referral'];
      let errors = [];
      let hasErrors = false;

      if (file.name !== 'Leads.xlsx') {
        setSnackbarMessage('Please select the template file named Leads.xlsx');
        setSnackbarOpen(true);
       setSnackbarColor('red'); 
             return;
           }
      // Loop through each row of the Excel data starting from index 1
      for (let i = 1; i < excelData.length; i++) {
        const row = excelData[i];
        const firstName = row[0];
        const lastName = row[1];
        const email = row[3];
        const phoneNumber = row[4];
        const source = row[5];
  
// Check if first and last name contain numbers
if (/\d/.test(firstName) || /\d/.test(lastName)) {
  setSnackbarMessage('First and last name should not contain numbers');
  setSnackbarOpen(true);
  setSnackbarColor('red');
  hasErrors = true;
  break;
}

  
        // Check if email is valid
        if (!/\S+@\S+\.\S+/.test(email)) {
          setSnackbarMessage('Invalid email address');
          setSnackbarOpen(true);
         setSnackbarColor('red'); 
         inputRef.current.value = null;
         hasErrors = true;
         break;
        }
  
        // Check if phone number is valid
    // Check if phone number contains only numeric characters
if (!/^\d+$/.test(phoneNumber)) {
  setSnackbarMessage(`Row ${i + 1}: Phone number should contain only numeric characters.`);
  setSnackbarOpen(true);
  setSnackbarColor('red');
  inputRef.current.value = null;
  hasErrors = true;
  break;
}

  
        // Check if source is one of the required sources
        if (!requiredSources.includes(source)) {
          setSnackbarMessage(`Row ${i + 1}: Source must be one of the following: ${requiredSources.join(', ')}.`);
          setSnackbarOpen(true);
         setSnackbarColor('red'); 
         inputRef.current.value = null;
         hasErrors = true;
         break;
        }
      }
  
      // If there are errors, log them
      if (errors.length > 0) {
        errors.forEach(error => console.error(error));
        inputRef.current.value = null;
        return;
      }

      if (!hasErrors) {
        setSnackbarMessage('Import done, creating invitations for your Leads, Please Wait');
        setSnackbarColor('green'); // Set green color for success
        setSnackbarOpen(true);
      }
   
      console.log('Excel Data:', excelData);
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
