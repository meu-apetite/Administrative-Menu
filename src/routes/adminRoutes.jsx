import Layout from 'components/Layout';
import Address from 'pages/Address/Index';
import Product from 'pages/Products/Index';
import ProductCreate from 'pages/Products/Create';
import ProductUpdate from 'pages/Products/Update';
import Category from 'pages/Categories/Index';
import CategoryCreate from 'pages/Categories/Create';
import CategoryUpdate from 'pages/Categories/Update';
import Orders from 'pages/Orders/Index';
import Appearance from 'pages/Appearance/Index';
import Home from 'pages/Home';
import PaymentMethod from 'pages/PaymentMethod/Index';
import Settings from 'pages/Settings/Index';
import { Navigate } from 'react-router-dom';

const adminRoutes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'home', element: <Home /> },

      { path: 'products', element: <Product /> },
      { path: 'products/create', element: <ProductCreate /> },
      { path: 'products/update/:id', element: <ProductUpdate /> },

      { path: 'categories', element: <Category /> },
      { path: 'categories/create', element: <CategoryCreate /> },
      { path: 'categories/update/:id', element: <CategoryUpdate /> },

      { path: 'orders', element: <Orders /> },

      { path: 'address', element: <Address /> },
      { path: 'appearance', element: <Appearance /> },
      { path: 'payment-method', element: <PaymentMethod /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <Navigate to="/" /> },
    ],
  },
];

export default adminRoutes;
