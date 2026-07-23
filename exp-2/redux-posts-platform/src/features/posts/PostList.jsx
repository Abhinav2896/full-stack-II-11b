import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectAllPosts } from './postsSlice';
import { selectSelectedPlatformId } from '../platforms/platformsSlice';
import PostItem from './PostItem';
import { Grid, Typography, Skeleton, Alert, Button, Box, Fade } from '@mui/material';

const PostList = () => {
  const dispatch = useDispatch();
  
  const posts = useSelector(selectAllPosts);
  const postStatus = useSelector((state) => state.posts.status);
  
  const selectedPlatformId = useSelector(selectSelectedPlatformId);

  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  if (postStatus === 'loading') {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((n) => (
          <Grid item xs={12} sm={6} lg={4} key={n}>
            <Skeleton variant="rounded" height={220} sx={{ borderRadius: '20px' }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (postStatus === 'failed') {
    return (
      <Alert 
        severity="error" 
        sx={{ 
          background: 'var(--glass-bg)', 
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          borderRadius: '20px'
        }}
        action={
          <Button color="inherit" size="small" onClick={() => dispatch(fetchPosts())}>
            Try again
          </Button>
        }
      >
        Couldn't load posts. Try again.
      </Alert>
    );
  }

  const displayedPosts = selectedPlatformId 
    ? posts.filter(post => post.platformId === selectedPlatformId)
    : posts;
    
  // Reverse to show newest first
  const reversed = [...displayedPosts].reverse();

  if (reversed.length === 0) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No posts yet for this platform.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {reversed.map((post, index) => (
        <Fade in={true} timeout={500} style={{ transitionDelay: `${index * 50}ms` }} key={post.id}>
          <Grid item xs={12} sm={6} lg={4}>
            <PostItem post={post} />
          </Grid>
        </Fade>
      ))}
    </Grid>
  );
};

export default PostList;
