import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  ListItem, 
  Divider, 
  List, 
  Toolbar, 
  Box, 
  IconButton,
  Button
} from '@mui/material';
import menuItems from './items';
import { Avatar, CardHeader, styled } from '@mui/material';
import { AuthContext } from 'contexts/auth';
import * as S from './style';

const MiniDrawer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [routeActive, setRouteActive] = useState('home');
  const { company, changeTheme, themeMode } = useContext(AuthContext);

  const handleDrawerOpen = () => {
    setOpen(true);
    // button-float
  };

  const handleDrawerClose = () => setOpen(false);

  const toLink = (link) => {
    if (link === 'logout') {
      localStorage.removeItem('_id');
      localStorage.removeItem('token');
      return window.location.reload();
    }
    if (window.innerWidth <= 900) handleDrawerClose();
    setRouteActive(link)
    navigate(link);
  };

  const CustomCardHeader = styled(CardHeader)`
    && .css-1ssile9-MuiCardHeader-avatar { margin: 0 }
  `;

  return (
    <Box
      sx={{ 
        display: 'flex', [theme.breakpoints.down('md')]: { position: 'absolute' } 
      }}
    >
      <CssBaseline />
      <S.AppBar open={open} position="fixed" sx={{ height: "65px" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ marginRight: 2, ...(open && { visibility: "hidden" }) }}
          >
            <MenuIcon />
          </IconButton>

          <S.WrapperIntro>
            <CustomCardHeader
              sx={{ flexDirection: "row-reverse", gap: 1, pr: 0, m: 0 }}
              avatar={<Avatar src={company.custom.logo?.url} />}
              title={company.fantasyName}
            />
          </S.WrapperIntro>
        </Toolbar>
      </S.AppBar>

      <S.Drawer variant="permanent" open={open}>
        <S.DrawerHeader>
          <Button
            onClick={() => changeTheme(themeMode === 'dark' ? 'light' : 'dark')}
            startIcon={<i className="fa-solid fa-circle-half-stroke"></i>}
            sx={{ 
              color: themeMode === 'dark' ? '#fff' : '#092635',
              borderColor: themeMode === 'dark' ? '#fff' : '#092635',
              display: 'flex',
              gap: '0.7rem',
              pl: '6px'
            }}
          >
            Modo {themeMode === 'dark' ? 'light' : 'dark'} 
          </Button>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </S.DrawerHeader>

        {menuItems.map((group, menuIndex) => (
          <Box key={menuIndex}>
            <Divider key={menuIndex} />
            <List sx={{ p: 0 }}>
              {group.map((item, index) => (
                <ListItem 
                  key={index} 
                  disablePadding 
                  sx={{ 
                    display: 'block', 
                    background: item.link === routeActive ? 'rgba(0, 0, 0, 0.04)' : '' 
                  }} 
                  onClick={() => toLink(item.link)}
                >
                  <ListItemButton sx={{ minHeight: 48, justifyContent: open ? 'initial' : 'center', px: 2.5 }}>
                    <ListItemIcon title={item.text} sx={{ minWidth: 0, mr: open ? 3 : 'auto', justifyContent: 'center' }}>
                      <item.Icon />
                    </ListItemIcon>
                    <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        ))}
      </S.Drawer>
    </Box>
  );
};

export default MiniDrawer;
