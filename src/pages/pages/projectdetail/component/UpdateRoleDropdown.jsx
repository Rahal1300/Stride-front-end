import React, { useState } from 'react';
import MenuItem from '@mui/material/MenuItem';
import { Button, TextField } from '@mui/material';

const UpdateRoleDropdown = ({ currentRole, onUpdate, userId }) => {
  const [selectedRole, setSelectedRole] = useState(currentRole);

  // Define role mappings based on currentRole
  const roleMappings = {
    'Guest': 'Guest',
    'Collaborator': 'Collaborator',
    // If currentRole is 'Team Leader', exclude 'Team Leader' from roleMappings
    ...(currentRole !== 'Team Leader' && { 'Team Leader': 'TeamLeader' }),
    // If currentRole is 'Team Manager', include only 'Team Manager'
    ...(currentRole === 'Team Manager' && { 'Team Manager': 'TeamManager' }),
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
      <TextField
        select
        label="Update Role"
        variant="outlined"
        size="small"
        value={selectedRole}
        onChange={(e) => setSelectedRole(e.target.value)}
        sx={{ marginRight: '20px' }}
      >
        {Object.keys(roleMappings).map((role) => (
          <MenuItem key={role} value={roleMappings[role]}>
            {role}
          </MenuItem>
        ))}
      </TextField>
      <Button onClick={() => onUpdate(selectedRole, userId)} sx={{ marginTop: '20px' }}>
        ✔
      </Button>
    </div>
  );
};

export default UpdateRoleDropdown;
