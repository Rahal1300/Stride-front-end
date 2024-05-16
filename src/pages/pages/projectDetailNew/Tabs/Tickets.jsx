import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TicketForm from './TicketForm'; // Assuming you have a component for the ticket form

function Tickets() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Divider sx={{   
        borderColor: 'gray',
        borderWidth: '1px',width:'80%',marginBottom:'20px'
      }} />
      <Button
  variant="contained"
  onClick={handleOpen}
  sx={{
 
   
    backgroundColor: '#E2EAF8',
    opacity: 0.7,

    color: '#202224',
 
    borderRadius: '10%',
  }}
>
  Create a ticket
</Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-ticket-modal-title"
        aria-describedby="create-ticket-modal-description"
      >
        <TicketForm onClose={handleClose} />
      </Modal>
      {/* Display existing tickets here */}
    </Box>
  );
}

export default Tickets;
