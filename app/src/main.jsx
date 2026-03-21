import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Layout } from './components/Layout/Layout'
import { Home } from './components/Home/Home'
import { PageNotFound } from './components/Home/PageNotFound';
import { Toaster } from "react-hot-toast";
import ListUsuarios from "./components/Usuario/listUsuarios";
import DetailUsuario from "./components/Usuario/DetailUsuario";
import ListObjetos from "./components/Objeto/ListObjetos";
import DetailObjetos from "./components/Objeto/DetailObjetos";
import ListSubastasActivas from "./components/Subasta/ListSubastasActivas";
import ListSubastasFinalizadas from "./components/Subasta/ListSubastasFinalizadas";
import DetailSubasta from "./components/Subasta/DetailSubastas";
import HistorialPujas from "./components/Pujas/HistorialPujas";
import UpdateUsuarios from "./components/Usuario/UpdateUsuario";
import CreateObjeto from './components/Objeto/CreateObjeto';
import UpdateObjeto from './components/Objeto/UpdateObjeto';
import DeleteObjeto from './components/Objeto/DeleteObjeto';
import ListSubastasPrevias from './components/Subasta/ListSubastasPrevias';
import CreateSubasta from './components/Subasta/CreateSubasta';
import UpdateSubasta from './components/Subasta/UpdateSubasta';
import PublicarSubasta from './components/Subasta/PublicarSubasta';
import CancelarSubasta from './components/Subasta/CancelarSubasta';

const rutas = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },

      // {path:"objetos/table", element: <TableObjeto/>},
     // {path:"objetos/update/:id", element: <UpdateObjeto/>},
      /*{ path:"objetos/create", element: <CreateObjeto/>},
      { path:"objetos/update/:id", element: <UpdateObjeto/>},
      { path:"objetos/delete/:id", element: <DeleteObjeto/>},
      { path: "usuarios/update/:id", element: <UpdateUsuarios /> },
      { path:"subastas/create", element: <CreateSubasta/>},
      { path: "subastas/activas", element: <ListSubastasActivas /> },
      { path: "subastas/finalizadas", element: <ListSubastasFinalizadas /> },
      { path: "subastas/:id", element: <DetailSubasta /> },
      { path: "objetos", element: <ListObjetos /> },
      { path: "objetos/:id", element: <DetailObjetos /> },
      { path: "usuarios", element: <ListUsuarios /> },
      { path: "usuarios/:id", element: <DetailUsuario /> },
      //{ path: "subastas/activas", element: <ListSubastasActivas /> },
      { path: "subastas/:id/pujas", element: <HistorialPujas /> },
      { path: "*", element: <PageNotFound /> },*/
       // OBJETOS
      { path: "objetos", element: <ListObjetos /> },
      { path: "objetos/create", element: <CreateObjeto /> },
      { path: "objetos/update/:id", element: <UpdateObjeto /> },
      { path: "objetos/delete/:id", element: <DeleteObjeto /> },
      { path: "objetos/:id", element: <DetailObjetos /> },

      // USUARIOS
      { path: "usuarios", element: <ListUsuarios /> },
      { path: "usuarios/update/:id", element: <UpdateUsuarios /> },
      { path: "usuarios/:id", element: <DetailUsuario /> },

      // SUBASTAS
      { path: "subastas/create", element: <CreateSubasta /> },
      { path: "subastas/update/:id", element: <UpdateSubasta /> },
      { path: "subastas/publicar/:id", element: <PublicarSubasta /> },
      { path: "subastas/cancelar/:id", element: <CancelarSubasta /> },
      { path: "subastas/activas", element: <ListSubastasActivas /> },
      { path: "subastas/finalizadas", element: <ListSubastasFinalizadas /> },
      { path: "subastas/previas", element: <ListSubastasPrevias /> },
      { path: "subastas/:id/pujas", element: <HistorialPujas /> },
      { path: "subastas/:id", element: <DetailSubasta /> },
    ],
  },
])
createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 🔥 TOASTER GLOBAL */}
    <Toaster position="top-center" reverseOrder={false} />

    <RouterProvider router={rutas} />
  </StrictMode>
);
