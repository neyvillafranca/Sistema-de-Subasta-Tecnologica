import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";
import { Tag, Info, ImageOff } from "lucide-react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

ListCardObjetos.propTypes = {
    data: PropTypes.array.isRequired,
};

export default function ListCardObjetos({ data }) {
    console.log("DATA EN ListCardObjetos:", data);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const condicionMap = {
        "1": "Nuevo",
        "2": "Usado",
    };

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(data) &&
                data.map((item) => (
                    <Card key={item.id_objeto} className="flex flex-col overflow-hidden">
                        {/* Header */}
                        <CardHeader className="text-center">
                            <CardTitle className="text-lg font-semibold">
                                {item.nombre}
                            </CardTitle>
                        </CardHeader>

                        {/* Imagen */}
                        <div className="relative w-full aspect-video">
                            {item.imagen?.url_imagen ? (
                                <img
                                    src={`${BASE_URL}${item.imagen.url_imagen}`}
                                    alt={item.nombre}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                                    <ImageOff className="w-12 h-12" />
                                </div>
                            )}

                            {item.estado?.descripcion && (
                                <Badge
                                    className="absolute top-2 right-2"
                                    variant={
                                        item.estado.descripcion === "Disponible"
                                            ? "secondary"
                                            : item.estado.descripcion === "En Subasta"
                                                ? "default"
                                                : "destructive"
                                    }
                                >
                                    {item.estado.descripcion}
                                </Badge>
                            )}
                        </div>

                        {/* Contenido */}
                        <CardContent className="flex-1 space-y-2 pt-4 text-sm">
                            {/* Categorías */}
                            {item.categoria && item.categoria.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {item.categoria.map((cat) => (
                                        <Badge key={cat.id_categoria} variant="outline">
                                            <Tag className="w-3 h-3 mr-1" />
                                            {cat.nombre}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Condición */}
                            <p className="text-muted-foreground">
                                Condición:{" "}
                                <span className="font-medium text-foreground">
                                    {condicionMap[item.condicion] || "No especificado"}
                                </span>
                            </p>
                        </CardContent>

                        {/* Acciones */}
                        <div className="flex justify-end gap-2 border-t p-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size="icon" className="size-8" asChild>
                                            <Link to={`/objetos/${item.id_objeto}`}>
                                                <Info />
                                            </Link>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Ver detalle</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </Card>
                ))}
        </div>
    );
}