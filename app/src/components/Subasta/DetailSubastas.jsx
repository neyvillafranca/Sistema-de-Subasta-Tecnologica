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
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import { EmptyState } from "../ui/custom/EmptyState";
import SubastaService from "@/services/SubastaService";

export default function DetailSubasta() {
    const { id } = useParams(); 

    const [subastaId, setSubastaId] = useState("");
    const [subasta, setSubasta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const BASE_URL = import.meta.env.VITE_BASE_URL;


    const fetchSubasta = async (idSubasta) => {
        if (!idSubasta) return;

        setLoading(true);
        setError(null);
        setSubasta(null);

        try {
            const response = await SubastaService.getSubastaById(idSubasta);
            const result = response.data;

            if (result?.success && result.data) {
                setSubasta(result.data);
            } else {
                setError("Subasta no encontrada");
            }
        } catch (err) {
            console.error(err);
            setError("Error al buscar la subasta");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            setSubastaId(id);
            fetchSubasta(id);
        }
    }, [id]);

    // 🔍 Búsqueda manual
    const handleSearch = () => {
        fetchSubasta(subastaId);
    };

    const objeto = subasta?.objeto;
    const totalPujas = subasta?.cantidad_pujas ?? 0;

    return (
        <div className="container mx-auto py-8 space-y-6">
            <h1 className="text-3xl font-bold">Detalle de Subasta</h1>

        
            {loading && <LoadingGrid />}
            {error && <ErrorAlert title="Error" message={error} />}
            {!loading && !error && !subasta && (
                <EmptyState message="Ingrese un ID para buscar una subasta." />
            )}

            {subasta && (
                <>
                    {/* 🖼️ Imagen */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        {objeto?.imagenes?.length > 0 ? (
                            <img
                                src={`${BASE_URL}${objeto.imagenes[0].url_imagen}`}
                                alt={objeto.nombre}
                                className="rounded-md border object-cover"
                            />
                        ) : objeto?.imagen?.url_imagen ? (
                            <img
                                src={`${BASE_URL}${objeto.imagen.url_imagen}`}
                                alt={objeto.nombre}
                                className="rounded-md border object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-40 bg-muted rounded-md">
                                <ImageOff className="w-10 h-10 text-muted-foreground" />
                            </div>
                        )}

                        {/* 📦 Info objeto */}
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold">{objeto?.nombre}</h2>

                            <div className="flex flex-wrap gap-2">
                                {objeto?.categoria?.length > 0 ? (
                                    objeto.categoria.map((cat) => (
                                        <Badge key={cat.id_categoria} variant="outline">
                                            {cat.nombre}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground">
                                        Sin categorías
                                    </span>
                                )}
                            </div>

                            <p>
                                <strong>Condición:</strong>{" "}
                                {objeto?.condicion === "1" ? "Nuevo" : "Usado"}
                            </p>
                        </div>
                    </div>

                    {/* 🔨 Datos subasta */}
                    <div className="rounded-md border p-6 space-y-3">
                        <h3 className="text-lg font-semibold">Datos de la Subasta</h3>

                        <div className="grid sm:grid-cols-2 gap-3">
                            <p>
                                <strong>Fecha inicio:</strong>{" "}
                                {new Date(subasta.fecha_inicio).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Fecha cierre:</strong>{" "}
                                {new Date(subasta.fecha_cierre).toLocaleDateString()}
                            </p>
                            <p>
                                <strong>Precio base:</strong> ₡{subasta.precio_base}
                            </p>
                            <p>
                                <strong>Incremento mínimo:</strong> ₡{subasta.incremento_minimo}
                            </p>
                            <p>
                                <strong>Estado:</strong>{" "}
                                <Badge>{subasta.estado?.descripcion}</Badge>
                            </p>
                            <p>
                                <strong>Total de pujas:</strong> {totalPujas}
                            </p>
                        </div>

                        {totalPujas > 0 && (
                            <Button asChild className="mt-4">
                                <Link to={`/subastas/${subasta.id_subasta}/pujas`}>
                                    Ver historial de pujas
                                </Link>
                            </Button>
                        )} 
                    </div>
                </>
            )}

            {/* ⬅️ Volver */}
            <Button asChild variant="outline">
                <Link to="/subastas" className="flex gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Link>
            </Button>
        </div>
    );
}