import { createTheme } from '@mui/material/styles';

const glassRecipe = {
  background: 'var(--glass-bg)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid var(--glass-border)',
  borderRadius: '20px',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
};

// Small controls (icon buttons)
const smallRaised = {
  boxShadow: '6px 6px 12px var(--neu-dark), -6px -6px 12px var(--neu-light)',
  backgroundColor: 'var(--surface)',
};
const smallHover = {
  boxShadow: '8px 8px 16px var(--neu-dark), -8px -8px 16px var(--neu-light)',
};
const smallInset = {
  boxShadow: 'inset 4px 4px 8px var(--neu-dark), inset -4px -4px 8px var(--neu-light)',
  backgroundColor: 'var(--surface)',
};

// Medium controls (chips, text inputs, selects)
const mediumRaised = {
  boxShadow: '4px 4px 10px var(--neu-dark), -4px -4px 10px var(--neu-light)',
  backgroundColor: 'var(--surface)',
};
const mediumInset = {
  boxShadow: 'inset 3px 3px 6px var(--neu-dark), inset -3px -3px 6px var(--neu-light)',
  backgroundColor: 'var(--surface)',
};

// Large controls (Publish button)
const largeRaised = {
  boxShadow: '8px 8px 18px var(--neu-dark), -8px -8px 18px var(--neu-light)',
};
const largeInset = {
  boxShadow: 'inset 5px 5px 10px var(--neu-dark), inset -5px -5px 10px var(--neu-light)',
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#6D5DF6',
    },
    background: {
      default: 'transparent',
      paper: 'transparent',
    },
    text: {
      primary: '#232634',
      secondary: '#5B6072',
    }
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontFamily: "'Plus Jakarta Sans', sans-serif" },
    h2: { fontFamily: "'Plus Jakarta Sans', sans-serif" },
    h3: { fontFamily: "'Plus Jakarta Sans', sans-serif" },
    h4: { fontFamily: "'Plus Jakarta Sans', sans-serif" },
    h5: { fontFamily: "'Plus Jakarta Sans', sans-serif" },
    h6: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          ...glassRecipe,
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          ...glassRecipe,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(31, 38, 135, 0.2)',
          }
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 600,
          transition: 'box-shadow 120ms ease, transform 120ms ease',
        },
        contained: {
          ...largeRaised,
          backgroundColor: 'var(--accent)',
          color: '#fff',
          '&:hover': {
            backgroundColor: 'var(--accent)',
            opacity: 0.9,
          },
          '&:active': {
            backgroundColor: 'var(--accent)',
            ...largeInset,
            transform: 'scale(0.98)',
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          ...mediumRaised,
          borderRadius: '12px',
          border: 'none',
          transition: 'box-shadow 120ms ease, background-color 120ms ease',
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          '&:active': {
            ...mediumInset,
          },
          '&.active-chip': {
            ...mediumInset,
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          ...smallRaised,
          transition: 'box-shadow 120ms ease, background-color 120ms ease',
          '&:hover': {
            ...smallHover,
          },
          '&:active': {
            ...smallInset,
          },
          '&.active-icon-btn': {
            ...smallInset,
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiFilledInput-root': {
            ...mediumInset,
            borderRadius: '12px',
            backgroundColor: 'var(--surface)',
            '&:before, &:after': {
              display: 'none',
            },
            '&.Mui-focused': {
              backgroundColor: 'var(--surface)',
            }
          }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        filled: {
          ...mediumInset,
          borderRadius: '12px',
          backgroundColor: 'var(--surface)',
          padding: '16px 12px 8px', // Adjust padding for filled style
          '&:focus': {
            backgroundColor: 'var(--surface)',
            borderRadius: '12px',
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '&.MuiFilledInput-root': {
            '&:before, &:after': {
              display: 'none',
            }
          }
        }
      }
    }
  }
});

export default theme;
