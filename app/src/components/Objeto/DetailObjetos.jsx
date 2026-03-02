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
import ObjetoService from "@/services/ObjetoService";

export default function DetailObjetos() {
    const {id} = useParams();
    const [objetoId, setObjetoId] = useState("");
    const [objeto, setObjeto] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

   const fetchObjeto = async (idObjeto) => {
        if (!idObjeto) return;

        setLoading(true);
        setError(null);
        setObjeto(null);

        try {
            const response = await ObjetoService.getObjetoById(idObjeto);
            console.log("Response completo:", response);
            const result = response.data;

            if (result?.success && result.data) {
                console.log("Objeto obtenido:", result.data);
                setObjeto(result.data);
            } else {
                setError("Objeto no encontrado");
            }
        } catch (err) {
            console.error(err);
            setError("Error al buscar el objeto");
        } finally {
            setLoading(false);
        }
    };

        useEffect(() => {
            if (id) {
                setObjetoId(id);
                fetchObjeto(id);
            }
        }, [id]);

         const handleSearch = () => {
        fetchObjeto(objetoId);
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            <h1 className="text-3xl font-bold">Detalle de Objeto</h1>


            {loading && <LoadingGrid type="grid" />}
            {error && <ErrorAlert title="Error" message={error} />}
            {!loading && !error && !objeto && (
                <EmptyState message="Ingrese un identificador para buscar un objeto." />
            )}

            {/* 📦 DETALLE DEL OBJETO */}
            {objeto && (
                <>
                    {/* 🖼️ TODAS LAS IMÁGENES del objeto */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {objeto.imagenes && objeto.imagenes.length > 0 ? (
                            objeto.imagenes.map((img) => (
                                <img
                                    key={img.id_imagen_objeto}
                                    src={`${BASE_URL}${img.url_imagen}`}
                                    alt={objeto.nombre}
                                    className="aspect-video object-cover rounded-md border"
                                />
                            ))
                        ) : objeto.imagen?.url_imagen ? (
                            <img
                                src={`${BASE_URL}${objeto.imagen.url_imagen}`}
                                alt={objeto.nombre}
                                className="aspect-video object-cover rounded-md border"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-40 bg-muted rounded-md">
                                <ImageOff className="w-10 h-10 text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* 📄 Información general */}
                    <div className="rounded-md border p-6 space-y-3">
                        <h2 className="text-xl font-semibold">{objeto.nombre}</h2>

                        <p className="text-muted-foreground">
                            {objeto.descripcion || "Sin descripción"}
                        </p>

                        {/* 🏷️ Categorías */}
                        <div className="flex flex-wrap gap-2">
                            {objeto.categoria && objeto.categoria.length > 0 ? (
                                objeto.categoria.map((cat) => (
                                    <Badge key={cat.id_categoria} variant="outline">
                                        {cat.nombre}
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-sm text-muted-foreground">Sin categorías</span>
                            )}
                        </div>

                        {/* ℹ️ Detalles */}
                        <div className="grid sm:grid-cols-2 gap-2 pt-2">
                            <p>
                                <strong>Condición:</strong>{" "}
                                {objeto.condicion === "1" ? "Nuevo" : "Usado"}
                            </p>
                            <p>
                                <strong>Estado:</strong>{" "}
                                <Badge>{objeto.estado?.descripcion || "N/A"}</Badge>
                            </p>
                            <p>
                                <strong>Fecha de registro:</strong>{" "}
                                {objeto.fecha_registro ? new Date(objeto.fecha_registro).toLocaleDateString() : "N/A"}
                            </p>
                            <p>
                                <strong>Propietario:</strong>{" "}
                                {objeto.propietario?.nombre_completo || "N/A"}
                            </p>
                        </div>
                    </div>

                    {/* 📊 Historial de Subastas */}
                    <div className="rounded-md border">
                        <h3 className="text-lg font-semibold p-4 border-b">Historial de Subastas</h3>
                        <Table>
                            <TableHeader className="bg-primary/50">
                                <TableRow>
                                    <TableHead>Numero Subasta</TableHead>
                                    <TableHead>Fecha Inicio</TableHead>
                                    <TableHead>Fecha Cierre</TableHead>
                                    <TableHead>Estado Subasta</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {objeto.historial_subastas && objeto.historial_subastas.length > 0 ? (
                                    objeto.historial_subastas.map((subasta) => (
                                        <TableRow key={subasta.id_subasta}>
                                            <TableCell>{subasta.id_subasta}</TableCell>
                                            <TableCell>
                                                {new Date(subasta.fecha_inicio).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(subasta.fecha_cierre).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <Badge>{subasta.estado_subasta?.descripcion || "N/A"}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                                            Este objeto no ha participado en subastas
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </>
            )}

            {/* ⬅️ Volver */}
            <Button asChild className="flex gap-2">
                <Link to="/objetos">
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Link>
            </Button>
        </div>
    );
}