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

const BoxWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    width: '90vw',
  },
}));

const Img = styled('img')(({ theme }) => ({
  marginBottom: theme.spacing(10),
  [theme.breakpoints.down('lg')]: {
    height: 450,
    marginTop: theme.spacing(10),
  },
  [theme.breakpoints.down('md')]: {
    height: 400,
  },
  [theme.breakpoints.up('lg')]: {
    marginTop: theme.spacing(13),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: 400,
  height: 400,
  p: 2,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  alignSelf: 'flex-start', // Align button to the lower-left corner
  marginTop: 'auto',
}));

const CommentBox = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1),
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
  const router = useRouter();
  const { id } = router.query;

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleCreatePost = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/posts/create`, {
        projectId: id,
        description: description,
        content: newPostContent,
      }, {
        headers: {
          Authorization: `Bearer ${usertoken.payload.token}`,
        },
      });

      setNewPostTitle('');
      setNewPostContent('');
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
          <Button onClick={handleCreatePost} variant="contained" color="primary" sx={{ mt: 2 }}>Submit</Button>
        </Box>
      </Modal>

      <CommentModal open={commentModalOpen} onClose={handleCloseCommentModal} postId={selectedPostId} />

      <BoxWrapper>
        <Typography variant="h1">Posts</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {data.map((post) => (
            <Grid item xs={12} sm={6} md={4} key={post.id}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h5" component="div" align="center">
                    {post.title}
                  </Typography>
                  <Typography variant="body2">
                    {post.content}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', padding: '8px' }}>
                  <StyledButton size="small" onClick={() => handleOpenCommentModal(post.id)}>Add Comment</StyledButton>
                  {post.comments && post.comments.length > 0 && (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Comments:
                      </Typography>
                      {post.comments.map((comment) => (
                        <CommentBox key={comment.id}>
                          <Typography variant="body2" color="text.primary">
                            <strong>{comment.author}</strong>: {comment.content}
                          </Typography>
                        </CommentBox>
                      ))}
                    </Box>
                  )}
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
