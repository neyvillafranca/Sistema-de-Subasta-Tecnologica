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
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";
import UsuarioService from "@/services/UsuarioService";

const usersColumns = [
  { key: "nombre_completo", label: "Nombre" },
  { key: "rol", label: "Rol" },
  { key: "estado", label: "Estado" },
  { key: "cantidad_subastas_creadas", label: "Cantidad Subastas" },
  { key: "cantidad_pujas_realizadas", label: "Cantidad Pujas" },
  { key: "actions", label: "Acciones" },
];

export default function DetailUsuario() {
  const [userId, setUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);
    setUsers([]);

    try {
      const response = await UsuarioService.getUserById(userId);
      const result = response.data;

      if (result?.success && result.data) {
        setUsers([result.data]); // 🔑 backend devuelve objeto
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Detalle de Usuario</h1>

      {/* 🔍 Buscador */}
      <div className="flex gap-2 mb-6 max-w-sm">
        <Input
          type="number"
          placeholder="Ingrese ID de usuario"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <Button onClick={handleSearch}>
          <Search className="w-4 h-4 mr-1" />
          Buscar
        </Button>
      </div>

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