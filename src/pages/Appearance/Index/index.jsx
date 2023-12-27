import { useContext, useEffect, useState } from 'react';
import { ApiService } from 'services/api.service';
import { Avatar, TextField, Grid, Box } from '@mui/material';
import { AuthContext } from 'contexts/auth';
import ButtonFloat from 'components/ButtonFloat';
import Header from 'components/Header';
import * as S from './style';
import BackdropLoading from 'components/BackdropLoading';

const Create = () => {
  const apiService = new ApiService();
  const { toast, company, setCompany } = useContext(AuthContext);
  const [logo, setLogo] = useState();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const save = async (e) => {
    try {
      e.preventDefault(); 
      setLoading('Atualizando dados...');

      const form = new FormData(e.target);

      const response = await apiService.put('/admin/company/appearance', {
        fantasyName: form.get('fantasyName'),
        description: form.get('description'),
        slogan: form.get('slogan'),
        colorPrimary: form.get('colorPrimary'),
        colorSecondary: form.get('colorSecondary'),
      });
      setCompany(response.data);
    } catch (error) {
      console.log(e)

      toast.error('Não foi possível atualizar os dados');
    } finally {
      setLoading(null);
    }
  };

  const updateLogo = async (e) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('logo', e.target.files[0]);
      const response = await apiService.post(
        '/admin/company/logo',
        formData,
        true,
      );
      setLogo(response.data.url);
      setCompany({ 
        ...company,custom: { ...company.custom, logo: response.data 
      } });
      toast.success('Logo atualizada');
    } catch (e) {
      toast.error(e.data.message || 'Não foi possível atualizar a logo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setData({
      fantasyName: company.fantasyName,
      slogan: company.slogan,
      description: company.description,
      colorPrimary: company.custom.colorPrimary,
      colorSecondary: company.custom.colorSecondary,
    });
    setLogo(company.custom.logo?.url);
  }, [company]);

  return (
    data && (
      <form onSubmit={save}>
        <Header title="Aparência" back={-1} />

        <Box component="section" sx={{ mb: '48px' }}>
          <Box sx={{ display: 'grid', justifyContent: 'center', mb: 2 }}>
            <Avatar
              src={logo}
              sx={{
                width: '150px',
                height: '150px',
                mb: 1,
                border: '2px solid',
              }}
            />
            <S.ButtonChangeLogo component="label" variant="outlined">
              <S.VisuallyHiddenInput type="file" onChange={(e) => updateLogo(e)} />
              Mudar logo
            </S.ButtonChangeLogo>
          </Box>

          <Grid container spacing={2}>
            <Grid item sm={12} xs={12}>
              <TextField
                label="Nome fantasia"
                name="fantasyName"
                defaultValue={data.fantasyName}
                InputLabelProps={{ shrink: data.fantasyName?.length }}
                margin="dense"
                fullWidth
                required
              />
            </Grid>

            <Grid item sm={12} xs={12}>
              <TextField
                label="Descrição"
                name="description"
                defaultValue={data.description}
                InputLabelProps={{ shrink: data.description?.length }}
                rows={3}
                margin="dense"
                multiline
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                label="Slogan"
                name="slogan"
                defaultValue={data.slogan}
                InputLabelProps={{ shrink: data.slogan?.length }}
                margin="dense"
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={12} sx={{ mb: -1 }}>
              <span>
                Escolha duas cores (cor principal e cor sencundaria) para ser a
                cor tema do seu cardapio. As cores serão utilizada também aqui
                no seu painel
              </span>
            </Grid>

            <Grid item xs={4} sm={4}>
              <TextField
                label="Cor principal"
                name="colorPrimary"
                defaultValue={data.colorPrimary}
                margin="dense"
                type="color"
                InputLabelProps={{ shrink: data.slogan?.length }}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={4} sm={4}>
              <TextField
                label="Cor secundária"
                defaultValue={data.colorSecondary}
                name="colorSecondary"
                margin="dense"
                type="color"
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        </Box>

        <ButtonFloat text={'salvar'} type="submit" />

        <BackdropLoading loading={loading} />
      </form>
    )
  );
};

export default Create;
