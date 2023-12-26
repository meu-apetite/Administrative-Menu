import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';
import { ApiService } from 'services/api.service';
import { AuthContext } from 'contexts/auth';
import ButtonFloat from 'components/ButtonFloat';

const InfoContact = () => {
  const apiService = new ApiService();
  const { toast, setLoading, company, setCompany } = useContext(AuthContext);
  const [data, setData] = useState({ name: '', phoneNumber: '', email: '' });

  const save = async (e) => {
    e.preventDefault();
    setLoading('Agurade...');

    try {
      const response = await apiService.put('/admin/company/owner', data);
      setData(response.data);
      setCompany({ ...company, owner: response.data })
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const getData = async (id) => {
    try {
      setData(company.owner);
    } catch (error) {
      toast.error('Não foi possível recuperar os dados');
    };
  };

  useEffect(() => {
    getData();
  }, []);

  return (

    <Box component="section" noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            label="Email oficial (loja)"
            value={data?.email}
            type="email"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            InputLabelProps={{ shrink: data.email }}
            margin="dense"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            label="Whatsapp oficial (loja)"
            value={data?.phoneNumber}
            type="phone"
            onChange={(e) => setData({ ...data, phoneNumber: e.target.value })}
            InputLabelProps={{ shrink: data.phoneNumber }}
            margin="dense"
            fullWidth
            required
          />
        </Grid>
      </Grid>

      <ButtonFloat text="Salvar" onClick={save} />
    </Box>
  );
};

export default InfoContact;
