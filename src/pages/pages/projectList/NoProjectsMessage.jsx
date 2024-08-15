import { Box, Typography, Button } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

const NoProjectsMessage = ({ handleView }) => {
  return (
    <Box sx={{ textAlign: 'center'}}>
      <Typography variant="h5" color="textSecondary" gutterBottom>
        You don t have any projects yet!
      </Typography>
      <Typography variant="body1" color="textSecondary" gutterBottom>
        Click below to create your first project.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleOutline />}
        onClick={handleView}
        sx={{ marginTop: 2 }}
      >
        Create Project
      </Button>
    </Box>
  );
};

export default NoProjectsMessage;
