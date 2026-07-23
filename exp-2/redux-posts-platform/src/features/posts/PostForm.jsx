import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { addPost } from './postsSlice';
import { selectAllPlatforms } from '../platforms/platformsSlice';
import { Paper, TextField, Button, Box, MenuItem, Typography, Select, FormControl, InputLabel } from '@mui/material';
import { getPlatformData } from '../../utils/platformMap';
import SendIcon from '@mui/icons-material/Send';

const PostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platformId, setPlatformId] = useState('');

  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && content && platformId) {
      dispatch(
        addPost({
          id: nanoid(),
          title,
          content,
          platformId,
          likes: 0,
        })
      );
      setTitle('');
      setContent('');
      setPlatformId('');
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Create New Post</Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        
        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <TextField
            variant="standard"
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            fullWidth
            sx={{ flex: 2 }}
          />
          
          <FormControl variant="filled" required sx={{ flex: 1, minWidth: 150 }}>
            <InputLabel id="platform-select-label" sx={{ display: 'none' }}>Platform</InputLabel>
            <Select
              labelId="platform-select-label"
              value={platformId}
              onChange={(e) => setPlatformId(e.target.value)}
              displayEmpty
              disableUnderline
            >
              <MenuItem value="" disabled>Select Wire</MenuItem>
              {platforms.map(pf => {
                const { icon: PlatformIcon, color } = getPlatformData(pf.name);
                return (
                  <MenuItem key={pf.id} value={pf.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PlatformIcon sx={{ fontSize: 20, color }} />
                    {pf.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Box>

        <TextField
          variant="standard"
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          multiline
          minRows={4}
          fullWidth
        />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <Button 
            type="submit" 
            variant="contained" 
            size="large"
            endIcon={<SendIcon />}
          >
            Publish Post
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default PostForm;
