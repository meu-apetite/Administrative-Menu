import { Navigate } from 'react-router-dom';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

const authRoutes = [
  {
    path: '/',
    children: [
      { path: 'login', element: <Login /> },
      { path: '', element: <Login /> },
      { path: 'register', element: <Register /> }
    ],
  },
  { path: '*', element: <Navigate to="/login" /> },
];

export default authRoutes;