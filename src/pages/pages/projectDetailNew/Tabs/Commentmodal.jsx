import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { loginSuccess } from 'src/features/reducers/authReducer';

const CommentModal = ({ open, onClose, postId }) => {
  const [comment, setComment] = useState('');
  const usertoken = useSelector(loginSuccess);

  const handleSubmit = async () => {
    console.log("here");
    try {
      await axios.post(`http://192.168.30.200:8087/comments/${postId}`, { content: comment }, {
        headers: {
         
          Authorization: `Bearer ${usertoken.payload.token}`,
        }
      });
      setComment('');
      onClose(); // Close the modal on success
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 3, maxWidth: 400, margin: 'auto', mt: '20%', bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" mb={2}>Add a Comment here</Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          sx={{ mb: 2 }}
        />
        
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default CommentModal;
