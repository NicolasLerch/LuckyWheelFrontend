import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from './App.jsx'
import './index.css'
import UserForm from './components/UserForm/UserForm.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserForm />,
  },
  {
    path: "/lucky-wheel",
    element: <App />
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
