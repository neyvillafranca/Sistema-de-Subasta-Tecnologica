import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";
import PujaService from "@/services/PujaService";

export default function HistorialPujas() {
    const { id } = useParams(); // id_subasta
    const [pujas, setPujas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPujas = async () => {
            try {
                const response = await PujaService.getPujasBySubasta(id);
                const result = response.data;

                if (!result?.success) {
                    setError(result?.message || "Error al cargar pujas");
                } else {
                    // 🔒 VALIDACIÓN OBLIGATORIA:
                    // Solo pujas asociadas a esta subasta
                    const pujasValidas = result.data.filter(
                        (p) => p.id_subasta == id
                    );

                    // 🕒 ORDEN CRONOLÓGICO DESCENDENTE (CONSISTENTE)
                    pujasValidas.sort(
                        (a, b) => new Date(b.fecha_puja) - new Date(a.fecha_puja)
                    );

                    setPujas(pujasValidas);
                }
            } catch (err) {
                setError(err.message || "Error al conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };

        fetchPujas();
    }, [id]);

    if (loading) return <LoadingGrid />;
    if (error) return <ErrorAlert title="Error" message={error} />;
    if (!pujas || pujas.length === 0)
        return <EmptyState message="No hay pujas registradas para esta subasta." />;

    return (
        <div className="container mx-auto py-8 space-y-6">
            <h1 className="text-3xl font-bold">Historial de Pujas</h1>

            {/* 📊 Tabla de pujas */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-primary/10">
                        <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Monto ofertado</TableHead>
                            <TableHead>Fecha y hora</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {pujas.map((puja) => (
                            <TableRow key={puja.id_puja}>
                                <TableCell>
                                    {puja.usuario?.nombre_completo || "N/A"}
                                </TableCell>

                                <TableCell>
                                    <Badge variant="secondary">
                                        ₡{Number(puja.monto).toLocaleString()}
                                    </Badge>
                                </TableCell>

                                <TableCell>
                                    {new Date(puja.fecha_puja).toLocaleString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* ⬅️ Volver */}
            <Button asChild variant="outline">
                <Link to={`/subastas/${id}`} className="flex gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Volver a la subasta
                </Link>
            </Button>
        </div>
    );
}