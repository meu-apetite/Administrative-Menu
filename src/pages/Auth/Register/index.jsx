import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  OutlinedInput,
  InputAdornment,
  CssBaseline,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ApiService } from 'services/api.service';
import { AuthContext } from 'contexts/auth';

const themeDark = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1bac4b' },
    secondary: { main: '#1bac4b' },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

const Register = () => {
  const apiService = new ApiService(false);
  const navigate = useNavigate();
  const { setLoading, toast } = useContext(AuthContext);
  const [data, setData] = useState({
    email: null,
    password: null,
    passwordRepeat: null,
    storeUrl: null,
    fantasyName: null,
    ownerName: null,
    description: null
  });

  const toastSuport = () => {
    toast.error(
      <div>
        Não foi possível fazer o cadastro, caso precise de ajuda entre em
        contato com nosso suporte
        <Button variant="outlined" color="success" sx={{ width: '100%' }}>
          <i
            className="fa-brands fa-whatsapp"
            style={{ fontSize: '1.2rem' }}
          ></i>
          <span> Chamar suporte</span>
        </Button>
      </div>,
      { duration: 20000 },
    );
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      e.preventDefault();

      if (
        !data.email || !data.password || !data.passwordRepeat ||
        !data.fantasyName || !data.ownerName || !data.storeUrl
      ) {
        return toast.error('Todos os campos precisam serem preencidos!');
      }

      if (data.password !== data.passwordRepeat) {
        return toast.error('As senhas não correspondem');
      }

      const response = await apiService.post('/auth/register', data);

      if (!response.data.success) {
        if (!response?.data?.message) return toastSuport();
        toast.error(response.data.message);
      }

      toast.success('Successo! Faça o login para continuar.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      if (error.response.data?.message) {
        return toast.error(error.response.data.message);
      }
      return toastSuport();
    } finally {
      setTimeout(() => setLoading(false), 2000);
    }
  };

  return (
    <ThemeProvider theme={themeDark}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>
          <Typography component="h1" variant="h5">Nova conta</Typography>

          <Box component="form" onSubmit={(e) => handleSubmit(e)} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Seu nome"
                  autoFocus
                  onChange={(e) => setData({ ...data, ownerName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do seu negócio"
                  onChange={(e) => setData({ ...data, fantasyName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  label="Descrição (Conte um pouco da sua loja...)"
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                  rows={3}
                  multiline
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Link personalizado"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">
                      {'https://meuapetite.com'}/
                    </InputAdornment>
                  }}
                  onChange={(e) => setData({ ...data, storeUrl: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Principal"
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Senha"
                  type="password"
                  name="password"
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Repita a senha"
                  type="password"
                  name="passwordRepeat"
                  onChange={(e) => setData({ ...data, passwordRepeat: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="Eu aceito todos os termos."
                />
              </Grid>
            </Grid>
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Cadastrar
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login">Já tem uma conta? Entre agora!</Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 5 }}>
          {'Copyright © '}
          <Link color="inherit" href="">Meu apetite </Link>
          {new Date().getFullYear()}
        </Typography>
      </Container>
    </ThemeProvider>
  );
};

export default Register;
