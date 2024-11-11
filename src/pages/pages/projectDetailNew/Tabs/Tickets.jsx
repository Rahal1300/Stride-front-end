import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { loginSuccess } from 'src/features/reducers/authReducer';
import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import { styled } from '@mui/material';
import CommentBox from './CommentBox'; // Import the CommentBox component

// Responsive wrapper for the posts grid
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw',
  },
  marginBottom: theme.spacing(4),
}));

// Custom styled card to enhance layout
const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%', // Make card width responsive
  height: '100%', // Full height of grid cell
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for modern look
  transition: 'box-shadow 0.3s ease',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Elevation on hover
  },
}));

function Tickets() {
  const [open, setOpen] = useState(false); // State for the modal
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState(''); // State for new comment content
  const usertoken = useSelector(loginSuccess);
  const router = useRouter();
  const { id } = router.query;

  const handleOpen = (postId) => {
    setSelectedPostId(postId); // Set the selected post ID
    setOpen(true); // Open the modal
  };

  const handleClose = () => {
    setOpen(false); // Close the modal
    setNewCommentContent(''); // Reset the comment content
  };

  const handleCreateComment = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/comments/${selectedPostId}`,
        {
          content: newCommentContent,
        },
        {
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`, // Include the token in the headers
          },
        }
      );

      fetchData(); // Refetch comments after adding a new comment
      handleClose(); // Close the modal
    } catch (error) {
      console.error('Error adding comment:', error.response ? error.response.data : error.message);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/project/${id}`, {
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setData(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, usertoken]);

  // Function to handle adding replies to comments
// Function to handle adding replies to comments
const handleAddComment = async (parentId, newComment) => {
  console.log('Selected Post ID for reply:', selectedPostId); // 
  if (!selectedPostId) {
    console.error('No post ID selected. Cannot add reply.'); // Error handling
    return; // Prevent further execution if post ID is null
  }
  
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/comments/${selectedPostId}`, {
      content: newComment,
      parentId: parentId, // Include parentId for nested comments
    }, {
      headers: {
        Authorization: `Bearer ${usertoken.payload.token}`, // Include the token in the headers
      },
    });

    fetchData(); // Refetch comments after adding a new comment
  } catch (error) {
    console.error('Error adding reply:', error);
  }
};

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Divider sx={{ borderColor: 'gray', borderWidth: '1px', width: '80%', marginBottom: '20px' }} />

      <BoxWrapper>
        <Typography variant="h1">Posts</Typography>
        <Grid container spacing={3} justifyContent="center">
          {data.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h5" component="div" align="center" gutterBottom>
                    {post.title}
                  </Typography>
                  <Typography variant="body2" gutterBottom>{post.content}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                    Created by: {post.creatorName}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'space-between', display: 'flex', flexDirection: 'column' }}>
                {post.comments && post.comments.length > 0 && (
                              <Box sx={{ width: '100%', paddingTop: 2 }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                  Comments
                                </Typography>

                                {post.comments
                                  .filter(comment => !comment.parent) // Only render top-level comments
                                  .map((comment) => (
                                    <CommentBox key={comment.id} comment={comment} onReply={handleAddComment} />
                                  ))}
                              </Box>
                            )}

                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleOpen(post.id)} // Open the modal with the post ID
                    sx={{ backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#388e3c' }, mt: 2 }}
                  >
                    Add Comment
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </BoxWrapper>

      {/* Modal for adding a comment */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="add-comment-modal-title"
        aria-describedby="add-comment-modal-description"
      >
        <Box sx={{ p: 3, maxWidth: 400, margin: 'auto', mt: '20%', bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>Add a Comment</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Comment"
            variant="outlined"
            multiline
            rows={4}
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
          />
          <Button onClick={handleCreateComment} variant="contained" color="primary" sx={{ mt: 2 }}>Submit</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default Tickets;