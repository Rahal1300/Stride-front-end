import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function CollaboratorsList() {
  return (
 
    <Autocomplete
    id="free-solo-demo"
    freeSolo
    style={{ width: '200px',marginRight:'30px'}}
    size="small"

    options={Collaborators_list.map((option) => option.label)}
    renderInput={(params) => <TextField {...params} label="Search collaborator" />}
    
  />
  );
}

const Collaborators_list = [
  { label: ' Jordan Stevenson ' },
  { label: ' Benedetto Rossiter' },
  { label: ' Bentlee Emblin' },
  { label: 'Bradan Rosebotham' },
 
];
