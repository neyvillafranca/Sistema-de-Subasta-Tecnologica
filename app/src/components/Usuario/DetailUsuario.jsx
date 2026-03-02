import { Link, useParams } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, ArrowLeft, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";
import UsuarioService from "@/services/UsuarioService";

const usersColumns = [
  { key: "nombre_completo", label: "Nombre" },
  { key: "rol", label: "Rol" },
  { key: "estado", label: "Estado" },
  { key: "fecha_registro", label: "Fecha Registro" },
  { key: "cantidad_subastas_creadas", label: "Subastas Creadas" },
  { key: "cantidad_pujas_realizadas", label: "Pujas Realizadas" },
  { key: "actions", label: "Acciones" },
];

export default function DetailUsuario() {
  const { id } = useParams();
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

    const fetchUser = async (idUser) => {
        if (!idUser) return;

    setLoading(true);
    setError(null);
    setUsers([]);

    try {
      const response = await UsuarioService.getUserById(idUser);
      const result = response.data;

      if (result?.success && result.data) {
        setUsers([result.data]); // backend devuelve objeto
      } else {
        setError("Usuario no encontrado");
      }
    } catch (err) {
      console.error(err);
      setError("Error al buscar usuario");
    } finally {
      setLoading(false);
    }
  };

   useEffect(() => {
        if (id) {
            setUserId(id);
            fetchUser(id);
        }
    }, [id]);

      const handleSearch = () => {
        fetchUser(userId);
    };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Detalle de Usuario</h1>

   
      {loading && <LoadingGrid type="grid" />}
      {error && <ErrorAlert title="Error" message={error} />}
      {!loading && !error && users.length === 0 && (
        <EmptyState message="Ingrese un ID para buscar un usuario." />
      )}

      {users.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-primary/50">
              <TableRow>
                {usersColumns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id_usuario}>
                  <TableCell>{user.nombre_completo}</TableCell>
                  <TableCell>{user.rol?.nombre}</TableCell>
                  <TableCell>
                    {Number(user.estado) === 1 ? "Activo" : "Bloqueado"}
                  </TableCell>
                  <TableCell>{user.fecha_registro}</TableCell>
                  <TableCell>{user.cantidad_subastas_creadas}</TableCell>
                  <TableCell>{user.cantidad_pujas_realizadas}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4 text-primary" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Editar</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Button asChild className="mt-6 flex gap-2">
        <Link to="/usuarios">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>
      </Button>
    </div>
  );
}