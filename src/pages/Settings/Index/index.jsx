import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, Tab, Tabs } from '@mui/material';
import Header from 'components/Header';
import * as S from './style';

const Settings = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const handleResize = () => setWidth(window.innerWidth);
  const [width, setWidth] = useState(0);
  const [tabValue, setTabValue] = useState('openinghours');

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const tabValue = location.pathname.split('/').pop();
    if (tabValue !== 'settings') {
      setTabValue(tabValue);
    } else {
      const firstTabValue = 'openinghours';
      setTabValue(firstTabValue);
      navigate(firstTabValue);
    }
  }, [location.pathname]);

  return (
    (width > 0) && (
      <S.Container>
        <Header title="Configurações" back={-1} />

        <S.WrapperTabs>
          <Box sx={{ width: { xs: (width - 40) + 'px', sm: '100%' }, bgcolor: 'background.paper' }}>
            <Tabs
              value={tabValue}
              onChange={(e, v) => navigate(v)}
              variant="scrollable"
              scrollButtons="auto"
              wrapped
            >
              <Tab value="openinghours" label="Horário de pedido" />
              <Tab value="delivery" label="Delivery" />
              <Tab value="infocontact" label="Opções de contato" />
              <Tab value="infoadmin" label="Administrador" />
            </Tabs>
          </Box>
        </S.WrapperTabs>
        <Outlet />
      </S.Container>
    )
  );
};

export default Settings;
