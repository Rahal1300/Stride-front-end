import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';

const ListProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Retrieve projects from local storage on component mount
    setProjects(storedProjects);
  }, []);

  const handleAddProject = () => {
    // Add a new project to the list
    const newProject = { title: `New Project ${projects.length + 1}`, description: 'New Project Description' };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);

    // Save projects to local storage
  };

  return (
    <div>
      <Head>
        <title>List Projects</title>
      </Head>

      <main>
        <Typography variant="h4" gutterBottom>
          Projects
        </Typography>
        <div>
          A role provided access to predefined menus and features so that depending on assigned role an administrator can have access to what he needs
        </div>

        <Grid container spacing={5} className='mt-5'>
          {/* External Project */}
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <div>Total 6 project invitations</div>
                <Typography variant="h5" gutterBottom sx={{ marginTop: '20px' }}>
                  External Project
                </Typography>
                <div>View Projects</div>
                {/* Additional details for External Project */}
              </CardContent>
            </Card>
          </Grid>

          {/* My Project */}
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <div>Total 10 projects</div>
                <Typography variant="h5" gutterBottom sx={{ marginTop: '20px' }}>
                  My Project
                </Typography>
                <div>View Projects</div>
                {/* Additional details for My Project */}
              </CardContent>
            </Card>
          </Grid>

          {/* Add Project */}
          <Grid item xs={4}>
            <Card>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <img src="/images/ourimg/char.png" alt="Project Image" />
                  </Grid>
                  <Grid item xs={12} md={6} container justifyContent="flex-end" alignItems="flex-start">
                    <Button onClick={handleAddProject} variant="contained" color="primary">
                      Add Project
                    </Button>
                    <Typography>
                      Add a new project if it doesn t exist
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Dynamic Rendering of Projects */}
          {projects.map((project, index) => (
            <Grid item xs={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h5" gutterBottom sx={{ marginTop: '20px' }}>
                    {project.title}
                  </Typography>
                  <Typography>
                    {project.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </main>
    </div>
  );
};

export default ListProjects;
