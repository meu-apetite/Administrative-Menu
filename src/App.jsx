import { useRoutes } from 'react-router-dom';
import { AuthProvider } from 'contexts/auth';
import authRoutes from 'routes/authRoutes';
import adminRoutes from 'routes/adminRoutes';
import { StoreProvider } from 'contexts/store';
import theme from 'theme/default';
import { ThemeProvider } from '@mui/material';

const GlobalStyles = () => (
  <style>
    {`
      input:-webkit-autofill, input:-webkit-autofill:hover, 
      input:-webkit-autofill:focus, input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px #02020200 inset !important;
        background-color: inherit !important;
        color: inherit !important;
      }
    `}
  </style>
);

export const AuthRoutes = () => {
  const routes = useRoutes([...authRoutes]);
  return <>{routes}</>;
};

export const AdminRoutes = () => {
  const routes = useRoutes([...adminRoutes]);
  return <>{routes}</>;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <AuthRoutes />
        <AdminRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
