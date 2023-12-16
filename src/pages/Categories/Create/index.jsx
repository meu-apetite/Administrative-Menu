import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Header from 'components/Header';
import { AuthContext } from 'contexts/auth';
import { ApiService } from 'services/api.service';

const Create = () => {
  const apiService = new ApiService();

  const navigate = useNavigate();
  const [data, setData] = useState({ title: '' });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const {setLoading, toast } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!data.title.trim().length ) return toast('Preencha o campo "Nome"', { icon: 'ℹ️' });
      setLoading('Criando categoria...');
      
      const response = await apiService.post('/admin/categories', data);
      const category = response.data;

      setButtonDisabled(true);

      toast.success('Categoria criada!');

      setTimeout(() => {
        navigate({ pathname: '/admin/categories', search: category._id });
        setLoading(false);
      }, 2000);
    } catch (e) {
      toast.error('Erro ao criar a categoria');
      setLoading(false);
    }
  };

  return (
    <>
      <Header
        title="Nova categoria"
        back={-1}
        buttonText="Salvar"
        buttonClick={handleSubmit}
        buttonDisabled={buttonDisabled}
      />

      <Box component="section" noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12}>
            <TextField
              onBlur={(e) => setData({ ...data, title: e.target.value })}
              margin="dense"
              required
              fullWidth
              label="Título"
              autoFocus
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Create;
