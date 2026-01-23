import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { StrictMode } from 'react';
import './index.css';

import { router } from './routes';
import axios from 'axios';

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
