import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
  Avatar,
  Button,
  CssBaseline,
  createTheme,
  ThemeProvider,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
} from '@mui/material';
import ImageIntro from 'assets/images/16548-min.jpg';
import { ApiService } from 'services/api.service';
import { AuthContext } from 'contexts/auth';

const apiService = new ApiService(false);

const themeDark = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#1bac4b' },
    secondary: { main: '#1bac4b' },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

export default function Login() {
  const { setLoading, toast } = useContext(AuthContext);
  const navigate = useNavigate();

  const checkSuport = () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
    return true;
  };

  const urlB64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  const registerServiceWorker = async () => {
    const registration = await navigator.serviceWorker.register('sw.js');
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(
        'BIKAYUcYP8q6CbBFRfBJsOz9zJcl8siDpqr7vAu5I1Y8q5M0bW2UGpimc4lwzEVD4VlpUzeZ7HRyNjh6J7xOOQI'
      ),
    });
    return subscription;
  };

  const requestNotificationPermission = async () => {
    const permission = await window.Notification.requestPermission();

    if (permission !== 'granted') {
      return toast.error(
        'Por favor, conceda permissão de notificação para o funcionamento adequado do sistema.',
      );
    }
  };

  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      
      e.preventDefault();
      // const notificationSuport = checkSuport();
      // await requestNotificationPermission();
      // const subscription = await registerServiceWorker() || null;

      const data = new FormData(e.target);
      
      if (!data.get('email')) return toast.error('O Email não pode ficar em branco');
      if (!data.get('password')) return toast.error('A Senha não pode ficar em branco');
      console.log(data.get('password'))

      const response = await apiService.post(
        '/auth/login',
        { email: data.get('email'), password: data.get('password'), subscription: {} }
      );

      if (!response.data.success) return toast.error(response.data.message);

      localStorage.setItem('_id', JSON.stringify(response.data._id));
      localStorage.setItem('token', JSON.stringify(response.data.token));

      // if (!notificationSuport) {
      //   toast(
      //     'Seu navegador não suporta notificações em tempo real. Use o Google Chrome para acessar todas as funcionalidades do sistema.',
      //     { icon: "⚠️" }
      //   );
      // }

      navigate('/admin');
      return document.location.reload();
    } catch (error) {
      alert(error)
      console.log(error);
      return toast.error(error.response.data.message);
    } finally {
      setLoading(false);
      setTimeout(() => setLoading(false), 4000);
    }
  };

  return (
    <ThemeProvider theme={themeDark}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />

        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${ImageIntro})`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}><LockOutlinedIcon /></Avatar>

            <Typography component="h1" variant="h5">Login</Typography>

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField margin="normal" required fullWidth
                name="email" label="Email" autoComplete="email"
                autoFocus
              />

              <TextField margin="normal" required fullWidth
                label="Senha" type="password" name="password"
                autoComplete="current-password"
              />

              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Lembrar de mim"
              />

              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                Entrar
              </Button>

              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">Esqueceu a senha?</Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2">Cadastre-se</Link>
                </Grid>
              </Grid>

              <br /> <br />

              <Typography variant="body2" color="text.secondary" align="center">
                {'Copyright © '}
                <Link color="inherit" href="https://lojaexpressa.com/">Loja Expressa</Link>
                {' '} {new Date().getFullYear()}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
