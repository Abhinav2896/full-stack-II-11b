import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPlatforms, selectAllPlatforms, selectPlatform, selectSelectedPlatformId } from './platformsSlice';
import { Box, Typography, Chip, Paper } from '@mui/material';
import { getPlatformData } from '../../utils/platformMap';
import PublicIcon from '@mui/icons-material/Public';

const PlatformList = () => {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);
  const platformStatus = useSelector(state => state.platforms.status);
  const selectedPlatformId = useSelector(selectSelectedPlatformId);

  useEffect(() => {
    if (platformStatus === 'idle') {
      dispatch(fetchPlatforms());
    }
  }, [platformStatus, dispatch]);

  const handleSelectPlatform = (id) => {
    if (selectedPlatformId === id) {
      dispatch(selectPlatform(null));
    } else {
      dispatch(selectPlatform(id));
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Filter by Platform</Typography>
      {platformStatus === 'loading' ? (
        <Typography variant="body2" color="text.secondary">Loading...</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
          <Chip
            icon={<PublicIcon />}
            label="All"
            onClick={() => dispatch(selectPlatform(null))}
            className={selectedPlatformId === null ? 'active-chip' : ''}
            sx={{
              ...(selectedPlatformId === null ? {
                backgroundColor: 'rgba(109, 93, 246, 0.1)',
                color: 'var(--accent)',
                '& .MuiChip-icon': { color: 'var(--accent)' }
              } : {})
            }}
          />
          {platforms.map(pf => {
            const { icon: PlatformIcon, color } = getPlatformData(pf.name);
            const isSelected = selectedPlatformId === pf.id;
            
            // To create rgba color from hex, we just use string interpolation if possible, 
            // or rely on MUI's alpha tool. For simplicity, just use transparent background with tinted color,
            // or basic opacity overlay. We'll use a semi-transparent white/brand mix.
            
            return (
              <Chip
                key={pf.id}
                icon={<PlatformIcon />}
                label={pf.name}
                onClick={() => handleSelectPlatform(pf.id)}
                className={isSelected ? 'active-chip' : ''}
                sx={{
                  ...(isSelected ? {
                    backgroundColor: `${color}1A`, // 10% opacity hex
                    color: color,
                    '& .MuiChip-icon': { color: color }
                  } : {})
                }}
              />
            );
          })}
        </Box>
      )}
    </Paper>
  );
};

export default PlatformList;
