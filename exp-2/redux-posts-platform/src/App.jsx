import { useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, Avatar, Grid, Box } from '@mui/material';
import PostList from './features/posts/PostList';
import PostForm from './features/posts/PostForm';
import PlatformList from './features/platforms/PlatformList';
import PlatformForm from './features/platforms/PlatformForm';
import { selectAllPlatforms } from './features/platforms/platformsSlice';
import { getPlatformData } from './utils/platformMap';

function App() {
  const platforms = useSelector(selectAllPlatforms);

  return (
    <>
      <div className="ambient-wrapper">
        <div className="blob blob-linkedin"></div>
        <div className="blob blob-twitter"></div>
        <div className="blob blob-instagram"></div>
        <div className="blob blob-devto"></div>
      </div>

      <Box sx={{ minHeight: '100vh', pb: 4 }}>
        <AppBar position="sticky" elevation={0} sx={{ 
          background: 'var(--glass-bg)', 
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--glass-border)',
          mb: 4,
        }}>
          <Toolbar>
            <Typography variant="h5" component="h1" sx={{ flexGrow: 1, color: 'text.primary', fontWeight: 700 }}>
              Post Manager
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {platforms.map(platform => {
                const { icon: PlatformIcon, color } = getPlatformData(platform.name);
                return (
                  <Avatar 
                    key={platform.id} 
                    sx={{ width: 28, height: 28, bgcolor: color }}
                    aria-label={`Connected to ${platform.name}`}
                  >
                    <PlatformIcon sx={{ fontSize: 16, color: '#fff' }} />
                  </Avatar>
                );
              })}
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ px: { xs: 2, md: 4 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={3}>
              <Box sx={{ position: { md: 'sticky' }, top: { md: 100 } }}>
                <PlatformForm />
                <Box sx={{ mt: 3 }}>
                  <PlatformList />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <PostForm />
              <Box sx={{ mt: 4 }}>
                <PostList />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default App;
