import { useContext, useEffect, useState } from 'react';
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
  MenuList,
  MenuItem,
  Paper
} from '@mui/material';
import { Avatar, CardHeader, styled } from '@mui/material';
import { GlobalContext } from 'contexts/Global';
import { menuItems } from './items';
import * as S from './style';

const MiniDrawer = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openMenuProfile, setOpenMenuProfile] = useState(false);
  const [routeActive, setRouteActive] = useState('home');
  const [currentLeft, setCurrentLeft] = useState('home');
  const { company, changeTheme, themeMode } = useContext(GlobalContext);

  const handleDrawerOpen = () => setOpen(true);

  const handleDrawerClose = () => setOpen(false);

  const toLink = (link) => {
    if (window.innerWidth <= 900) handleDrawerClose();
    setRouteActive(link);
    navigate(link);
  };

  const toggleoMenuProfile = () => setOpenMenuProfile(!openMenuProfile);

  const menuItemsProfile = [
    {
      label: 'Visitar cardápio',
      iconClass: 'fa-eye',
      action: () => {
        window.open(`https://meuapetite.com/${company.storeUrl}`, '_blank');
        setOpenMenuProfile(false);
      }
    },
    {
      label: 'Termos de uso e privacidade',
      iconClass: 'fa-file-alt',
      action: () => {
        navigate('terms');
        setOpenMenuProfile(false);
      }
    },
    {
      label: 'Sair',
      iconClass: 'fa-sign-out-alt',
      action: () => {
        localStorage.removeItem('_id');
        localStorage.removeItem('token');
        return window.location.reload();
      }
    },
  ];

  const CustomCardHeader = styled(CardHeader)`&& .css-1ssile9-MuiCardHeader-avatar { margin: 0 }`;

  useEffect(() => {
    const handleResize = () => {
      const isWidthGreaterThan900 = window.innerWidth > 899;
      const appMain = document.querySelector('#app-main');
      const buttonFloat = document.querySelector('#button-float');
      console.log(isWidthGreaterThan900);

      if (buttonFloat && appMain && isWidthGreaterThan900 && open) {
        if (open) {
          buttonFloat.style.left = `calc(50% + ${((256 / window.innerWidth) * 100)}% - ${buttonFloat.clientWidth / 1.2}px)`;
          buttonFloat.style.transform = 'initial';
        } else {
          buttonFloat.style.transform = 'translateX(-50%)';
          buttonFloat.style.left = '50%';
        }
      } else if ((buttonFloat && appMain) && isWidthGreaterThan900 === false) {
        buttonFloat.style.transform = 'translateX(-50%)';
        buttonFloat.style.left = '50%';
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [open]);


  useEffect(() => {
    const currentRoute = window.location.pathname.split('/');
    setRouteActive('/' + currentRoute[1]);
  }, []);

  return (
    <S.Container>
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

          <S.WrapperIntro onClick={toggleoMenuProfile}>
            <CustomCardHeader
              sx={{ flexDirection: "row-reverse", gap: '8px', pr: 0, m: 0 }}
              avatar={<Avatar sx={{  m: 0 }} src={company.custom.logo?.url} />}
              title={company.fantasyName}
            />
            <span id="button-down" className="fas fa-angle-down"></span>
          </S.WrapperIntro>
        </Toolbar>

        {openMenuProfile &&
          <S.PaperMenuCustom>
            <MenuList>
              {menuItemsProfile.map((item, index) => (
                <MenuItem onClick={item.action} key={index} sx={{ gap: '8px', wordWrap: 'break-word' }}>
                  <span className={`fa ${item.iconClass}`} /> {item.label}
                </MenuItem>
              ))}
            </MenuList>
          </S.PaperMenuCustom>
        }
      </S.AppBar>

      <S.Drawer variant="permanent" open={open}>
        <S.DrawerHeader>
          <S.ButtonToggle
            thememode={themeMode}
            onClick={() => changeTheme(themeMode === 'dark' ? 'light' : 'dark')}
            startIcon={<i className="fa-solid fa-circle-half-stroke"></i>}
          >
            Modo {themeMode === 'dark' ? 'light' : 'dark'}
          </S.ButtonToggle>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </S.DrawerHeader>

        {menuItems.map((category, categoryIndex) => (
          <Box key={categoryIndex}>
            <Divider key={categoryIndex} />
            <List sx={{ p: 0 }}>
              {open &&
                <ListItem sx={{ display: 'block', justifyContent: open ? 'initial' : 'center', px: 2.5 }}>
                  <small style={{ fontWeight: 'bold' }}>
                    {category.category}
                  </small>
                </ListItem>
              }

              {category.items.map((item, index) => (
                <S.MenuItem
                  key={index}
                  disablePadding
                  open={open} 
                  className={routeActive === item.link ? 'active-item' : ''}
                  onClick={() => toLink(item.link)}
                >
                  <S.ListItemButtonCustom open={open}>
                    <ListItemIcon 
                      title={item.text} 
                      sx={{ justifyContent: 'center' }}
                    >
                      <item.Icon />
                    </ListItemIcon>
                    <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                  </S.ListItemButtonCustom>
                </S.MenuItem>
              ))}
            </List>
          </Box>
        ))}
      </S.Drawer>
    </S.Container>
  );
};

export default MiniDrawer;
