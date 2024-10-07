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
import CommentModal from './Commentmodal';
import { styled } from '@mui/material';

// Responsive wrapper for the posts grid
const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw',
  },
  marginBottom: theme.spacing(4),
}));

// Custom styled card to enhance layout
const StyledCard = styled(Card)(({ theme }) => ({
  width: '400%', // Make card width responsive
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

// Styled button for consistent spacing and appearance
const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  alignSelf: 'flex-end', // Align button to the lower-right corner
}));

// Comment container for a modern, clean look
const CommentBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

function Tickets() {
  const [open, setOpen] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [description, setNewPostDescription] = useState('');
  const usertoken = useSelector(loginSuccess);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCreatePost = async () => {
    try {
      // Create FormData object to handle both text and file data
      const formData = new FormData();
      formData.append('projectId', id);
      formData.append('description', description);
      formData.append('content', newPostContent);
  
      // Assuming you have an image state holding the selected image
      if (selectedImage) {
        formData.append('image', selectedImage); // Append the image file to the form data
      }
  
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/posts/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${usertoken.payload.token}`,
            // Set the content type to handle file uploads
          },
        }
      );
  
      // Clear form and close modal after successful post creation
      setNewPostTitle('');
      setNewPostContent('');
      setSelectedImage(null); // Clear the selected image
      setOpen(false);
      fetchData(); // Refetch data to include the new post
    } catch (error) {
      console.error('Error creating post:', error);
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

  const handleOpenCommentModal = (postId) => {
    setSelectedPostId(postId);
    setCommentModalOpen(true);
  };

  const handleCloseCommentModal = () => {
    setCommentModalOpen(false);
    setSelectedPostId(null);
  };

  const handleFileChange = (e) => {
    setSelectedImage(e.target.files[0]); // Set the selected file
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Divider sx={{ borderColor: 'gray', borderWidth: '1px', width: '80%', marginBottom: '20px' }} />

      <Button variant="contained" color="primary" onClick={handleOpen}>Create Post</Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="create-post-modal-title"
        aria-describedby="create-post-modal-description"
      >
        <Box sx={{ p: 3, maxWidth: 400, margin: 'auto', mt: '20%', bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>Create a Post</Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Title"
            variant="outlined"
            value={description}
            onChange={(e) => setNewPostDescription(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Content"
            variant="outlined"
            multiline
            rows={4}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />
          <input type="file" onChange={handleFileChange} />
          <Button onClick={handleCreatePost} variant="contained" color="primary" sx={{ mt: 2 }}>Submit</Button>
        </Box>
      </Modal>

      <CommentModal open={commentModalOpen} onClose={handleCloseCommentModal} postId={selectedPostId} />

      <BoxWrapper>
        <Typography variant="h1">Posts</Typography>
        <Grid
          container
          spacing={3} // Space between grid items (cards)
          justifyContent="center"
        >
          {data.map((post) => (
  <Grid
    item
    xs={12}  // Full width on small screens
    sm={6}   // 2 cards per row on medium screens
    md={4}   // 3 cards per row on larger screens
    key={post.id}
  >
    <StyledCard sx={{ boxShadow: 3, borderRadius: 3, padding: 2 }}>
      <CardContent>
        <Typography
          variant="h5"
          component="div"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#1e88e5', // Customize the color
            textTransform: 'capitalize',
          }}
        >
          {post.title}
        </Typography>

        <Typography
          variant="body2"
          gutterBottom
          sx={{
            fontSize: '1rem',
            lineHeight: 1.5,
            marginBottom: 2,
            color: '#424242', // Greyish tone
            textAlign: 'justify',
          }}
        >
          {post.content}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            fontStyle: 'italic',
            color: '#757575', // Muted color for secondary text
            textAlign: 'right',
          }}
        >
          Created by: {post.creatorName}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', paddingTop: 1 }}>
        {post.comments && post.comments.length > 0 && (
          <Box sx={{ width: '100%', paddingTop: 2 }}>
            <Typography
              variant="h6"
              color="text.secondary"
              gutterBottom
              sx={{ fontWeight: 'bold', color: '#1976d2' }} // Blue shade for comments heading
            >
              Comments
            </Typography>

            {post.comments.map((comment) => (
              <CommentBox
                key={comment.id}
                sx={{
                  backgroundColor: '#f1f1f1', // Light grey background for comments
                  padding: 1,
                  borderRadius: 2,
                  marginBottom: 1.5,
                }}
              >
                <Typography
                  variant="body1"
                  color="text.primary"
                  sx={{ fontWeight: 500, color: '#333' }}
                >
                  {comment.author}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ color: '#616161' }} // Slightly darker color for comment content
                >
                  {comment.content}
                </Typography>
              </CommentBox>
            ))}
          </Box>
        )}

        <StyledButton
          size="small"
          variant="contained"
          onClick={() => handleOpenCommentModal(post.id)}
          sx={{
            backgroundColor: '#4caf50', // Green button for adding comments
            '&:hover': { backgroundColor: '#388e3c' },
           mb:2
           ,ml:2
          }}
        >
          Add Comment
        </StyledButton>
      </CardActions>
    </StyledCard>
  </Grid>
))}

          
        </Grid>
      </BoxWrapper>
    </Box>
  );
}

export default Tickets;
