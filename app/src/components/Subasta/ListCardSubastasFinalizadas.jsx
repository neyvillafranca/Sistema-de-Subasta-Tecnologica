import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageOff, Gavel, Clock, Ban, CheckCircle } from "lucide-react";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

ListCardSubastasFinalizadas.propTypes = {
    data: PropTypes.array.isRequired,
};

export default function ListCardSubastasFinalizadas({ data }) {
    const BASE_URL = import.meta.env.VITE_BASE_URL  + "uploads";

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(data) &&
                data.map((subasta) => (
                    <Card
                        key={subasta.id_subasta}
                        className="flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <CardHeader className="text-center">
                            <CardTitle className="text-base font-semibold">
                                {subasta.objeto?.nombre}
                            </CardTitle>
                        </CardHeader>

                        {/* Imagen */}
                        <div className="relative w-full aspect-video">
                            {subasta.objeto?.imagen?.url_imagen ? (
                                <img
                                    src={`${BASE_URL}/${subasta.objeto.imagen.url_imagen}`}
                                    alt={subasta.objeto.nombre}
                                    className="h-[250px] w-full object-fill"
                                />
                            ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center">
                                    <ImageOff className="w-10 h-10 text-muted-foreground" />
                                </div>
                            )}

                            {/* Estado final (OBLIGATORIO) */}
                            <Badge
                                className="absolute top-2 right-2 flex items-center gap-1"
                                variant={
                                    subasta.estado_final === "Finalizada"
                                        ? "default"
                                        : "destructive"
                                }
                            >
                                {subasta.estado_final === "Finalizada" ? (
                                    <CheckCircle className="w-3 h-3" />
                                ) : (
                                    <Ban className="w-3 h-3" />
                                )}
                                {subasta.estado_final}
                            </Badge>
                        </div>

                        {/* Contenido */}
                        <CardContent className="flex-1 space-y-2 pt-4 text-sm">
                            {/* Fecha de cierre (OBLIGATORIA) */}
                            <p className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                Cierre:
                                <span className="text-foreground font-medium">
                                    {subasta.fecha_cierre}
                                </span>
                            </p>

                            {/* Cantidad de pujas (calculado) */}
                            <p className="flex items-center gap-1 text-muted-foreground">
                                <Gavel className="w-4 h-4" />
                                Pujas recibidas:
                                <span className="text-foreground font-medium">
                                    {subasta.cantidad_pujas}
                                </span>
                            </p>
                        </CardContent>
                        <div className="border-t p-3 flex justify-end">
                            <Button size="sm" asChild>
                                <Link to={`/subastas/${subasta.id_subasta}`}>
                                    Ver subasta
                                </Link>
                            </Button>
                        </div>
                    </Card>
                ))}
        </div>
    );
}