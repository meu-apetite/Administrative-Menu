import React, { createContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Backdrop, Box, CircularProgress } from '@mui/material';
import { ApiService } from 'services/api.service';

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const apiService = new ApiService();
  const [company, setCompany] = useState({});
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticationStatus, setAuthenticationStatus] = useState(null);

  const getComapny = async () => {
    try {
      const response = await apiService.get(`/admin/company`);
      const company = await response.data;
      setCompany(company);
      console.log(response)
      if (response.status === 401) {
        return setAuthenticationStatus('disconnected');
      }
      setAuthenticationStatus('logged');
    } catch (e) {
      setAuthenticationStatus('disconnected');
    }
  };

  useEffect(() => {
   getComapny();
  }, [])

  return (
    <AuthContext.Provider 
      value={{ company, setCompany, token, setToken, loading, setLoading, toast, authenticationStatus }}
    >
      <Backdrop
        sx={{ color: '#000000', zIndex: (theme) => theme.zIndex.drawer + 100 }}
        open={loading}
      >
        <Box sx={{ display: 'grid', justifyContent: 'center', gap: 1 }}>
          <CircularProgress size="4rem" sx={{ margin: 'auto' }} />
          <strong style={{ color: '#fff' }}>{loading}</strong>
        </Box>
      </Backdrop>
      <Toaster position="top-center" reverseOrder={false} />
      {props.children}
    </AuthContext.Provider>
  );
};
