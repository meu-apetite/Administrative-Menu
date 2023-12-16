import { useContext, useEffect, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import Header from 'components/Header';
import HorarioFuncionamento from '../HorarioFuncionamento';
import Delivery from '../Delivery';
import InfoAdmin from '../InfoAdmin';
import InfoContact from '../InfoContact';
import * as S from './style';
import { AuthContext } from 'contexts/auth';

const Settings = () => {
  const [tabValue, setTabValue] = useState('delivery');
  const { toast, setLoading, company, setCompany } = useContext(AuthContext);

  const [width, setWidth] = useState(0);

  const handleResize = () => setWidth(window.innerWidth);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  }, []);

  return (
    (width > 0) && (
      <section>
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
          <HorarioFuncionamento openingHours={company?.settings.openingHours} />
        )}
        {tabValue === 'delivery' && <Delivery />}
        {tabValue === 'contact' && <InfoContact />}
        {tabValue === 'admin' && <InfoAdmin />}
      </section>
    )
  );
};

export default Settings;
