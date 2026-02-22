import { Link } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";
import UsuarioService from "@/services/UsuarioService";

const usersColumns = [
  { key: "nombre_completo", label: "Nombre" },
  { key: "rol", label: "Rol" },
  { key: "estado", label: "Estado" },
  { key: "actions", label: "Acciones" },
];

export default function TableUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        
      try {
        const response = await UsuarioService.getUsuario();
        const result = response.data;

        if (result?.success) {
          setUsers(result.data ?? []);
        } else {
          setError(result?.message || "Error desconocido");
        }
      } catch (err) {
        console.error(err);
        setError("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingGrid type="grid" />;
  if (error) return <ErrorAlert title="Error al cargar usuarios" message={error} />;
  if (users.length === 0)
    return <EmptyState message="No se encontraron usuarios." />;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Listado de Usuarios
        </h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-primary/50">
            <TableRow>
              {usersColumns.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-left font-semibold"
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id_usuario}>
                {/* Nombre */}
                <TableCell className="font-medium">
                  {user.nombre_completo}
                </TableCell>

                {/* Rol (objeto) */}
                <TableCell>
                  {user.rol?.nombre }
                </TableCell>

                {/* Estado (string -> number) */}
                <TableCell>
                  {Number(user.estado) === 1 ? "Activo" : "Bloqueado"}
                </TableCell>

                {/* Acciones */}
                <TableCell className="flex gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/usuarios/${user.id_usuario}`}>
                            <Edit className="h-4 w-4 text-primary" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Ver detalle</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Button
        type="button"
        asChild
        className="flex items-center gap-2 bg-accent text-white hover:bg-accent/90 mt-6"
      >
        <Link to="/">
          <ArrowLeft className="w-4 h-4" />
          Regresar
        </Link>
      </Button>
    </div>
  );
}