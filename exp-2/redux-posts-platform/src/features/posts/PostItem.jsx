import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likePost, deletePost } from './postsSlice';
import { selectPlatformById } from '../platforms/platformsSlice';
import { Card, CardHeader, CardContent, CardActions, Avatar, Typography, IconButton, Badge, Collapse } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { getPlatformData } from '../../utils/platformMap';

const PostItem = ({ post }) => {
  const dispatch = useDispatch();
  const [isDeleted, setIsDeleted] = useState(false);
  
  const platform = useSelector(state => selectPlatformById(state, post.platformId));
  const platformName = platform ? platform.name : 'Unknown';
  const { icon: PlatformIcon, color } = getPlatformData(platformName);
  
  const handleDelete = () => {
    setIsDeleted(true);
    // Wait for the collapse animation to complete before removing from state
    setTimeout(() => {
      dispatch(deletePost(post.id));
    }, 300);
  };

  const isLiked = post.likes > 0;

  return (
    <Collapse in={!isDeleted} timeout={300} unmountOnExit>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: color }} aria-label={platformName}>
              <PlatformIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Avatar>
          }
          title={platformName}
          titleTypographyProps={{ variant: 'subtitle2', fontWeight: 600 }}
        />
        <CardContent sx={{ flexGrow: 1, pt: 0 }}>
          <Typography variant="h6" component="h2" gutterBottom fontWeight={700}>
            {post.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {post.content}
          </Typography>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
          <IconButton 
            aria-label="Like this post" 
            onClick={() => dispatch(likePost(post.id))}
            className={isLiked ? 'active-icon-btn' : ''}
          >
            <Badge badgeContent={post.likes} color="primary" max={99}
              sx={{ '& .MuiBadge-badge': { backgroundColor: 'var(--accent)' } }}
            >
              {isLiked ? <FavoriteIcon sx={{ color: '#E1306C' }} /> : <FavoriteBorderIcon />}
            </Badge>
          </IconButton>
          <IconButton 
            aria-label="Delete this post" 
            onClick={handleDelete}
            sx={{ 
              '&:hover': { color: 'error.main' },
              marginLeft: 'auto !important'
            }}
          >
            <DeleteOutlinedIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Collapse>
  );
};

export default PostItem;
