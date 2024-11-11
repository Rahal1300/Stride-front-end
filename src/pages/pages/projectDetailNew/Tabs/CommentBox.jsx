import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const CommentBox = ({ comment, onReply }) => {
  const [replyContent, setReplyContent] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    onReply(comment.id, replyContent); // Pass the parent comment ID
    setReplyContent('');
    setShowReplyForm(false);
  };

  return (
    <Box sx={{ marginTop: 2, padding: 1, backgroundColor: '#f1f1f1', borderRadius: 2 }}>
      <Typography variant="body1" color="text.primary" sx={{ fontWeight: 'bold' }}>
        {comment.author}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {comment.content}
      </Typography>
      <Button onClick={() => setShowReplyForm(!showReplyForm)}>
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
          <Button type="submit" variant="contained" color="primary">Submit Reply</Button>
        </form>
      )}

      {/* Render replies with indentation */}
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ marginLeft: 2, marginTop: 1 }}>
          {comment.replies.map((reply) => (
            <CommentBox key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CommentBox;