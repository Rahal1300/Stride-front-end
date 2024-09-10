import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, CardMedia, Typography, Box, Button } from '@mui/material';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/router';

import CircleProgress from './CircleProgress';

const ProjectCard = ({ project }) => {
  const router = useRouter();
  const handleView = () => {
    router.push({
      pathname: '/pages/projectDetailNew/',
      query: {
        id: project.id,
      },
    });
  };
  if (!project || !project.image) {
    return null; // or render a loading indicator, an empty state, or handle it in any appropriate way
  }
  console.log(project);
  return (
    <Card sx={{ maxWidth: 361 }}>
      <CardMedia
        sx={{ height: 300 }}
        image={`data:image/png;base64,${project.image}`}
        style={{ width: '100%' }}
      />
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          {project.projectName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <div>
          <Typography variant="body2" color="text.secondary">
  Owner: {project.owner ? project.owner : 'No owner available'}
</Typography>
<Typography variant="body2" color="text.secondary">
  Creation date: {project.startDate ? project.startDate : 'No creation date available'}
</Typography>

          </div>
          <CircleProgress progress={Math.trunc(project.progress)} />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center'}}>
        {project.projectUsersAndRoles && project.projectUsersAndRoles.length > 0 ? (
            <AvatarGroup max={4} sx={{ mr: 1 }}>
              {project.projectUsersAndRoles.map((user, index) => (
                user.email && <Avatar key={index} alt={user.first_name} src={`data:image/png;base64,${user.image}`} />
              ))}
            </AvatarGroup>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
              No team members yet 
            </Typography>
          )}

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#E2EAF8",
              marginLeft: '40px',
              color: "#202224",
              border: "none",
              "&:hover": {
                backgroundColor: "#E2EAF8",
              },
            }}
            onClick={handleView}
          >
            View Project
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.object.isRequired, // Define prop type for project
};

export default ProjectCard;
