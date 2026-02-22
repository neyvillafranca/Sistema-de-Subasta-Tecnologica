import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound'
import ListUsuarios from "./components/Usuario/listUsuarios";
import DetailUsuario from "./components/Usuario/DetailUsuario";

const rutas = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

       { path: "usuarios", element: <ListUsuarios /> },

      // DETALLE (con ID)
      { path: "usuarios/:id", element: <DetailUsuario /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={rutas} />
  </StrictMode>,
)
