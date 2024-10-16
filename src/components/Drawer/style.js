import { styled } from '@mui/material/styles';
import { Button, ListItem, ListItemButton, Paper } from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';


export const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  [theme.breakpoints.down ('md')]: {
    position: 'absolute'
  }
}));

export const openedMixin = (theme) => ({
  width: 240,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  zIndex: theme.zIndex.drawer + 2
});

export const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  '@media (max-width: 900px)': {
    display: 'none'
  },
});

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1),
  paddingLeft: '1.25rem',
  ...theme.mixins.toolbar,
  '.on': {
    display: 'flex',
    border: '2px solid #000000',
    borderRadius: 4,
    padding: '2px 12px',
    cursor: 'pointer'
  }
}));

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: 2,
  '@media (min-width: 900px)': { zIndex: theme.zIndex.drawer + 1 },
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: 240,
    '@media (min-width: 900px)': { width: `calc(100% - ${240}px)` },
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: 240,
  paddingTop: 0,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '.MuiDrawer-paperAnchorDockedLeft': {
    '::-webkit-scrollbar': {
      width: '5px'
    },              
    '::-webkit-scrollbar-track': {
      background: '#f1f1f1' 
    },               
    '::-webkit-scrollbar-thumb': {
      background: '#888'
    },              
    '::-webkit-scrollbar-thumb:hover': {
      background:'#555' 
    },
  },
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

export const Logo = styled('img')(({ theme }) => ({
  width: '32px',
  height: '32px',
  borderRadius: '50%'
}));

export const WrapperIntro = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textTransform: 'capitalize',
  '#button-down': {
    cursor: 'pointer'
  }
}));

export const MenuItem = styled(ListItem)(({ theme, open }) => ({
  display: 'block',
  '&.active-item': {
    background: 'rgba(0, 0, 0, 0.04)',
    borderLeft: `4px solid ${theme.palette.secondary.main}`,
    '[role="button"]': {
      marginLeft: open ? '-18px' : '-6' 
    }
  }
}));

export const ButtonToggle = styled(Button)(({ theme, thememode }) => ({
  color: thememode === 'dark' ? '#fff' : '#092635',
  borderColor: thememode === 'dark' ? '#fff' : '#092635',
  display: 'flex',
  gap: '0.7rem',
  pl: '6px',
}));

export const ListItemButtonCustom = styled(ListItemButton)(({ theme, open }) => ({
  minHeight: 48,
  justifyContent: open ? 'initial' : 'center', 
  marginLeft: open ? -16 : 0
}));

export const PaperMenuCustom = styled(Paper)(({ theme }) => ({
maxWidth: '250px', 
position: 'absolute', 
right: 0, 
top: '65px', 
}));
