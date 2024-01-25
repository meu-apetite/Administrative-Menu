import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { AuthContext } from 'contexts/auth';
import Drawer from 'components/Drawer';

const theme = (colorPrimary, colorSecondary) => {
  return createTheme({
    palette: {
      primary: { main: colorPrimary || '#800080', },
      secondary: { main: colorSecondary || '#CD5C5C' },
    },
    typography: { fontFamily: 'Roboto, sans-serif' },
    spacing: factor => `${0.5 * factor}rem`
  });
};

const themeDark = (colorPrimary, colorSecondary) => {
  return createTheme({
    palette: {
      mode: 'dark',
      primary: { main: colorPrimary || '#800080', },
      secondary: { main: colorSecondary || '#CD5C5C' },
    },
    typography: { fontFamily: 'Roboto, sans-serif' },
    spacing: factor => `${0.5 * factor}rem`
  });
};

const Layout = (props) => {
  const { company, themeMode } = useContext(AuthContext);

  return (
    <ThemeProvider theme={
      themeMode === 'dark' 
        ? themeDark(company.custom.colorPrimary, company.custom.colorSecondary)
        : theme(company.custom.colorPrimary, company.custom.colorSecondary)
      }
    >
      <Box sx={{ display: 'flex', maxWidth: '1300px', margin: 'auto' }}>
        <Drawer />

        <Box component="main" sx={{ flexGrow: 1, p: 2, mt: '64px' }}>
          <Box
            component={props.component}
            onSubmit={props.handleSubmit}
            autoComplete="off"
          >
            <Outlet />
          </Box>
          <Box sx={{ display: 'grid', gap: 1 }}>{props.children}</Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;
