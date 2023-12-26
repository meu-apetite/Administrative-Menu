import { useContext, useEffect, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import Header from 'components/Header';
import OpeningHours from '../OpeningHours';
import Delivery from '../Delivery';
import InfoAdmin from '../InfoAdmin';
import InfoContact from '../InfoContact';
import * as S from './style';
import { AuthContext } from 'contexts/auth';

const Settings = () => {
  const [tabValue, setTabValue] = useState('orderTime');
  const { company } = useContext(AuthContext);
  const [width, setWidth] = useState(0);
  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  }, []);

  return (
    (width > 0) && (
      <S.Container>
        <Header title="Configurações" back={-1} />

        <S.WrapperTabs>
            <Box
              sx={{ width: { xs: (width - 40) + 'px', sm: '100%' }, bgcolor: 'background.paper' }}
            >
              <Tabs
                value={tabValue}
                onChange={(e, v) => setTabValue(v)}
                variant="scrollable"
                scrollButtons="auto"
                wrapped
              >
                <Tab value="orderTime" label="Horário de pedido" />
                <Tab value="delivery" label="Delivery" />
                <Tab value="contact" label="Opções de contato" />
                <Tab value="admin" label="Administrador" />
              </Tabs>
            </Box>
        </S.WrapperTabs>

        {tabValue === 'orderTime' && (
          <OpeningHours 
            openingHours={company?.settings.openingHours} 
            setTabValue={setTabValue} 
          />
        )}
        {tabValue === 'delivery' && <Delivery setTabValue={(v) => setTabValue(v)} />}
        {tabValue === 'contact' && <InfoContact setTabValue={(v) => setTabValue(v)} />}
        {tabValue === 'admin' && <InfoAdmin setTabValue={(v) => setTabValue(v)} />}
      </S.Container>
    )
  );
};

export default Settings;
