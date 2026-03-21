import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";

import { Tag, Info, ImageOff, Edit, Trash2, Plus } from "lucide-react";

ListCardObjetos.propTypes = {
    data: PropTypes.array.isRequired,
};

export default function ListCardObjetos({ data }) {
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";

    return (
        <div className="space-y-6">

            {/* ===== BARRA SUPERIOR ===== */}
            <div className="flex flex-col sm:flex-row justify-end gap-3">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={() => navigate("/subastas/create")}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Crear subasta
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Crear subasta</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="secondary"
                                onClick={() => navigate("/objetos/create")}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Crear objeto
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Crear objeto</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            {/* GRID DE OBJETOS */}
            <div className="grid gap-6 pt-14 sm:grid-cols-2 lg:grid-cols-3">
                {Array.isArray(data) &&
                    data.map((item) => (
                        <Card
                            key={item.id_objeto}
                            className="flex flex-col overflow-hidden"
                        >
                            {/* HEADER */}
                            <CardHeader className="text-center">
                                <CardTitle className="text-lg font-semibold">
                                    {item.nombre}
                                </CardTitle>
                            </CardHeader>

                            {/* IMAGEN */}
                            <div className="relative w-full bg-muted overflow-hidden">
                                {item.imagen?.url_imagen ? (
                                    <img
                                        src={`${BASE_URL}/${item.imagen.url_imagen}`}
                                        alt={item.nombre}
                                        className="w-full h-[250px] object-fill"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-[200px]">
                                        <ImageOff className="w-12 h-12 text-muted-foreground" />
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

                            {/* CONTENIDO */}
                            <CardContent className="flex-1 space-y-2 pt-4 text-sm">
                                {item.categoria?.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {item.categoria.map((cat) => (
                                            <Badge
                                                key={cat.id_categoria}
                                                variant="outline"
                                            >
                                                <Tag className="w-3 h-3 mr-1" />
                                                {cat.nombre}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>

                            {/* ACCIONES */}
                            <div className="flex justify-end gap-2 border-t p-3">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button size="icon" asChild>
                                                <Link
                                                    to={`/objetos/${item.id_objeto}`}
                                                >
                                                    <Info />
                                                </Link>
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Ver detalle
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    navigate(
                                                        `/objetos/update/${item.id_objeto}`
                                                    )
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Actualizar
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    navigate(
                                                        `/objetos/delete/${item.id_objeto}`
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Eliminar objeto
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </Card>
                    ))}
            </div>
        </div>
    );
}