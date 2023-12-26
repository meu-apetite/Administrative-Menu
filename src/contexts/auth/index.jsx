import { createContext, useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { ApiService } from 'services/api.service';

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const apiService = new ApiService();
  const [company, setCompany] = useState({});
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticationStatus, setAuthenticationStatus] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState('light') //dark;

  const getComapny = async () => {
    try {
      const response = await apiService.get(`/admin/company`);
      const company = await response.data;
      setCompany(company);
      if (response.status === 401) {
        return setAuthenticationStatus('disconnected');
      }
      setAuthenticationStatus('logged');
    } catch (e) {
      setAuthenticationStatus('disconnected');
    }
  };

  const changeTheme = (theme) => {
    setThemeMode(theme);
    localStorage.setItem('theme', theme);
  };

  const getTheme = (theme) => {
    setThemeMode(localStorage.getItem('theme'));
  };

  useEffect(() => {
    getComapny();
    getTheme();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        company,
        setCompany,
        token,
        setToken,
        loading,
        setLoading,
        toast,
        authenticationStatus,
        isMenuOpen,
        setIsMenuOpen,
        themeMode,
        changeTheme
      }}
    >
      <Toaster position="top-center" reverseOrder={false} />
      {props.children}
    </AuthContext.Provider>
  );
};
