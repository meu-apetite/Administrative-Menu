import { useState, useEffect, useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Backdrop, CircularProgress, Typography, Box } from '@mui/material';
import { AuthContext } from 'contexts/auth';
import { ApiService } from 'services/api.service';
import Drawer from 'components/Drawer';


const Create = (props) => {
  const apiService = new ApiService();

  const { setCompany } = useContext(AuthContext);

  const [authenticationStatus, setAuthenticationStatus] = useState('pending');
  /* pending, disconnected*/

  const update = async () => {
    try {
      const response = await apiService.get(`/admin/company`);
      const company = await response.data;
      setCompany(company);

      if (response.status === 401) return setAuthenticationStatus('disconnected');

      setAuthenticationStatus('logged');
    } catch (e) {
      setAuthenticationStatus('disconnected');
    }
  };

  useEffect(() => {
    update();
  }, []);

  if (authenticationStatus === 'pending') return <h1>Aguarde...</h1>;
  if (authenticationStatus === 'disconnected') return <Navigate to="/auth/login" />;
  if (authenticationStatus === 'error') return <h1>Error no servidor...</h1>;

  if (authenticationStatus === 'logged') {
    return (
      <>
        <Box sx={{ display: 'flex', maxWidth: '1300px', margin: 'auto' }}>
          <Drawer />

          <Box component="main" sx={{ flexGrow: 1, p: 2, mt: '64px' }}>
            <Box component={props.component} onSubmit={props.handleSubmit} autoComplete="off">
              <Outlet />
            </Box>
          </Box>
        </Box>

        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={props.loading}
        >
          <Box sx={{ display: 'grid', gap: 1 }}>{props.children}</Box>
          <CircularProgress disableShrink />
          <Typography>{props.loading}</Typography>
        </Backdrop>
      </>
    );
  }
};

export default Create;
