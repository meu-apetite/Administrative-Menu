import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

const authRoutes = [
  {
    path: '/auth',
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> }
    ],
  },
];

export default authRoutes;