import Layout from 'components/Layout';
import Address from 'pages/Address/Index';
import Product from 'pages/Products/Index';
import ProductCreate from 'pages/Products/Create';
import ProductUpdate from 'pages/Products/Update';
import Category from 'pages/Categories/Index';
import CategoryCreate from 'pages/Categories/Create';
import CategoryUpdate from 'pages/Categories/Update';
import Orders from 'pages/Orders/Index';
import OrdersView from 'pages/Orders/View';
import Appearance from 'pages/Appearance/Index';
import Home from 'pages/Home';
import PaymentMethod from 'pages/PaymentMethod/Index';
import Settings from 'pages/Settings/Index';

const adminRoutes = [
  {
    path: '/admin',
    element: <Layout />,
    exact: true,
    children: [
      { path: 'address', element: <Address /> },
      { path: 'products', element: <Product /> },
      { path: 'products/create', element: <ProductCreate /> },
      { path: 'products/update/:id', element: <ProductUpdate /> },
      { path: 'products/view', element: <ProductCreate /> },
      { path: 'categories', element: <Category /> },
      { path: 'categories/create', element: <CategoryCreate /> },
      { path: 'categories/update/:id', element: <CategoryUpdate /> },
      { path: 'orders', element: <Orders /> },
      { path: 'orders/view', element: <OrdersView /> },
      { path: 'appearance', element: <Appearance /> },
      { path: 'payment-method', element: <PaymentMethod /> },
      { path: 'settings', element: <Settings /> },
      { path: '', element: <Home /> },
    ],
  },
];

export default adminRoutes;
