import { useEffect, useState } from "react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Edit, Trash2, Plus } from "lucide-react";

import ObjetoService from "@/services/ObjetoService";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";

export default function TableObjetos() {
  const [objetos, setObjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ObjetoService.getObjetos();
        const result = response.data;

        if (result.success) {
          setObjetos(result.data || []);
        } else {
          setError("Error al cargar objetos");
        }
     } catch (err) {
            console.error(err);
            setError("Error al buscar el objeto");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingGrid type="grid" />;
  if (error) return <ErrorAlert title="Error" message={error} />;
  if (objetos.length === 0)
    return <EmptyState message="No hay objetos registrados." />;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Listado de Objetos</h1>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild variant="outline" size="icon">
                <Link to="/objetos/create">
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Crear objeto</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Condición</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {objetos.map((obj) => (
              <TableRow key={obj.id_objeto}>
                <TableCell>{obj.nombre}</TableCell>
                <TableCell>{obj.condicion}</TableCell>
                <TableCell>{obj.estado?.descripcion}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4 text-primary" />
                  </Button>

                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}