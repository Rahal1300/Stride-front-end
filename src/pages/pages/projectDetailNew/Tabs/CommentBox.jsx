import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const CommentBox = ({ comment = {}, onReply }) => { // Default value for comment
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onReply(comment.id, replyContent);
      setReplyContent('');
      setShowReplyForm(false);
    } catch (error) {
      console.error("Error submitting reply:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check if comment has the necessary properties
  if (!comment || !comment.author) {
    return <Typography variant="body2" color="text.secondary">Comment data is not available.</Typography>;
  }

  return (
    <Box sx={{ marginTop: 2, padding: 1, width:'500px', backgroundColor: '#f1f1f1', borderRadius: 2 }}>
      <Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold' }}>
       Author: {comment.author}
      </Typography>
      <Typography variant="body2" color="text.secondary">
      Comment:   {comment.content}
      </Typography>
      <Button 
        onClick={() => setShowReplyForm(!showReplyForm)} 
        aria-expanded={showReplyForm}
      >
        {showReplyForm ? 'Cancel' : 'Reply'}
      </Button>

      {showReplyForm && (
        <form onSubmit={handleReplySubmit}>
          <TextField
            fullWidth
            label="Reply"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Reply'}
          </Button>
        </form>
      )}

      {/* Render replies with indentation */}
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ marginLeft: 2, marginTop: 1, width:'2px !important',}}>
          {comment.replies.map((reply) => (
            <CommentBox key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </Box>
      )}
    </Box>
  );
};

// PropTypes for validation
CommentBox.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    replies: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  onReply: PropTypes.func.isRequired,
};

export default CommentBox;