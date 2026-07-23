import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { addPlatform } from './platformsSlice';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const PlatformForm = () => {
  const [name, setName] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      dispatch(
        addPlatform({
          id: nanoid(),
          name: name.trim(),
        })
      );
      setName('');
    }
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>Add a Platform</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          variant="filled"
          hiddenLabel
          placeholder="e.g. Medium"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          size="small"
          InputProps={{ disableUnderline: true }}
          aria-label="Platform Name"
        />
        <IconButton 
          type="submit" 
          color="primary" 
          aria-label="Add platform"
          sx={{ width: 40, height: 40 }}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default PlatformForm;
