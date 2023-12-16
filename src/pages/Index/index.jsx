import { useContext, useEffect, useState } from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';
import { AuthContext } from 'contexts/auth';
import { ApiService } from 'services/api.service';
import Header from 'components/Header';
import FindAddress from 'components/FindAddress';
import { propsTextField } from 'utils/form';
import * as S from './style.js';

const Address = () => {
  const apiService = new ApiService();

  const { toast, setLoading, company, setCompany } = useContext(AuthContext);
  const [data, setData] = useState({
    city: '', district: '', street: '', zipCode: ''
  });
  const [openEditorAddress, setOpenEditorAddress] = useState(false);

  const getAddress = async () => {
    if (!company?.address.zipCode) return;
    setData(company.address);
  };

  const updateAddress = async (address) => {
    // address: { street: string, number: number, zipCode: string, district: string, city: string }
    try {
      setLoading('Atualizando endereço');
      const { data } = await apiService.put('/admin/company/address', address);
      setData(data);
      toast.success('Endereço atualizado');
    } catch (error) {
      toast.error(
        'Não foi possível atualizar o endereço. caso não esteja consiguindo, entre em contato conosco.',
      );
    } finally {
      setOpenEditorAddress(false);
      setLoading(null);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <>
      <Header title="Endereço do Estabelecimento" back={-1} />
      <Box component="section" noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <span>Para adicionar um novo endereço clique em "ATUALIZAR ENDEREÇO"</span>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              disabled
              label="Cep"
              value={data.zipCode}
              {...propsTextField}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              disabled
              label="Cidade"
              value={data.city}
              {...propsTextField}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              disabled
              label="Referência/complemento"
              value={data.reference}
              {...propsTextField}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              disabled
              label="Bairro"
              value={data.district}
              {...propsTextField}
            />
          </Grid>
          <Grid item xs={9} sm={9}>
            <TextField
              disabled
              label="Rua"
              value={data.street}
              {...propsTextField}
            />
          </Grid>
          <Grid item xs={3} sm={3}>
            <TextField
              disabled
              label="Número"
              value={data.number}
              {...propsTextField}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <S.WrapperButtonSaved>
              <Button 
                variant='contained'
                onClick={() => setOpenEditorAddress(!openEditorAddress)}
              >
                Atualizar endereço
              </Button>
            </S.WrapperButtonSaved>
          </Grid>

          {
            openEditorAddress && 
              <FindAddress 
                getAddress={(address) => updateAddress(address)} 
                closeModal={(address) => setOpenEditorAddress(false)} 
              />
          }
        </Grid>
      </Box>
    </>
  );
};

export default Address;
