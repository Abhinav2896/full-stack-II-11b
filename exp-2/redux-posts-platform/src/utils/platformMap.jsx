import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import PublicIcon from '@mui/icons-material/Public';
import { SiDevdotto } from 'react-icons/si';

export const platformMap = {
  'LinkedIn': {
    icon: LinkedInIcon,
    color: '#0A66C2',
  },
  'Twitter': {
    icon: TwitterIcon,
    color: '#1DA1F2',
  },
  'Instagram': {
    icon: InstagramIcon,
    color: '#E1306C', // Simplified solid color for the avatar bg, though gradient is requested for blobs.
  },
  'Dev.to': {
    icon: SiDevdotto,
    color: '#0A0A0A',
  },
};

export const getPlatformData = (name) => {
  if (platformMap[name]) {
    return platformMap[name];
  }
  
  // Fallback for custom platforms
  return {
    icon: PublicIcon,
    color: 'var(--accent)',
  };
};
