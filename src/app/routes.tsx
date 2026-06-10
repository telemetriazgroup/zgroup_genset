import { createBrowserRouter, Navigate } from 'react-router';
import LoginPage from './pages/LoginPage';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import Alarmas from './pages/Alarmas';
import Data from './pages/Data';
import Mantenimiento from './pages/Mantenimiento';
import Historico from './pages/Historico';
import Documentacion from './pages/Documentacion';
import AccessDenied from './pages/AccessDenied';
import RequireAuth from './components/RequireAuth';
import GuestOnly from './components/GuestOnly';

const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

export const router = createBrowserRouter(
  [
    {
      path: '/login',
      Component: GuestOnly,
      children: [{ index: true, Component: LoginPage }],
    },
    {
      path: '/',
      Component: RequireAuth,
      children: [
        {
          Component: MainLayout,
          children: [
            { index: true, Component: Dashboard },
            { path: 'alarmas', Component: Alarmas },
            { path: 'data', Component: Data },
            { path: 'mantenimiento', Component: Mantenimiento },
            { path: 'historico', Component: Historico },
            { path: 'documentacion', Component: Documentacion },
            { path: 'acceso-denegado', Component: AccessDenied },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/" replace />,
    },
  ],
  { basename },
);
