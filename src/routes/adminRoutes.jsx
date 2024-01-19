import { Navigate } from 'react-router-dom';
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
import Payment_Pix from 'pages/PaymentMethod/Payment_Pix';
import Settings from 'pages/Settings/Index';
import Settings_Delivery from 'pages/Settings/Settings_Delivery';
import Settings_OpeningHours from 'pages/Settings/Settings_OpeningHours';
import Settings_InfoContact from 'pages/Settings/Settings_InfoContact';
import Settings_InfoAdmin from 'pages/Settings/Settings_InfoAdmin';
import Payment_InDelivery from 'pages/PaymentMethod/Payment_InDelivery';
import Financial from 'pages/Financial/Index';


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

      { path: 'financial', element: <Financial /> },

      {
        path: 'payment-method',
        element: <PaymentMethod />,
        children: [
          { path: 'pay-pix', element: <Payment_Pix /> },
          { path: 'pay-in-delivery', element: <Payment_InDelivery /> },
          
        ],
      },

      {
        path: 'settings',
        element: <Settings />,
        children: [
          { path: 'openinghours', element: <Settings_OpeningHours /> },
          { path: 'delivery', element: <Settings_Delivery /> },
          { path: 'infocontact', element: <Settings_InfoContact /> },
          { path: 'infoadmin', element: <Settings_InfoAdmin /> },
        ],
      },

      { path: '*', element: <Navigate to="/" /> },
    ],
  },
];

export default adminRoutes;
