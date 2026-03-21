import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageOff, Gavel, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

ListCardSubastaActivas.propTypes = {
    data: PropTypes.array.isRequired,
};

export default function ListCardSubastaActivas({ data }) {
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
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center">
                                    <ImageOff className="w-10 h-10 text-muted-foreground" />
                                </div>
                            )}

                            {/* Cantidad de pujas (OBLIGATORIO) */}
                            <Badge className="absolute top-2 right-2 flex items-center gap-1">
                                <Gavel className="w-3 h-3" />
                                {subasta.cantidad_pujas} pujas
                            </Badge>
                        </div>

                        {/* Contenido */}
                        <CardContent className="flex-1 space-y-2 pt-4 text-sm">
                            {/* Fecha inicio */}
                            <p className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                Inicio:{" "}
                                <span className="text-foreground font-medium">
                                    {subasta.fecha_inicio}
                                </span>
                            </p>

                            {/* Fecha cierre */}
                            <p className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="w-4 h-4" />
                                Cierre:{" "}
                                <span className="text-foreground font-medium">
                                    {subasta.fecha_cierre}
                                </span>
                            </p>

                        </CardContent>

                        {/* Acción */}
                        <div className="border-t p-3 flex justify-end">
                             <Button size="sm" asChild>
                                <Link to={`/subastas/cancelar/${subasta.id_subasta}`}>
                                    Cancelar Subasta
                                </Link>
                            </Button>
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