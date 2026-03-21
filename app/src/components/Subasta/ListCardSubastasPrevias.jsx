import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageOff, Clock, Edit, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import SubastaService from "@/services/SubastaService";

ListCardSubastaPrevias.propTypes = {
    data: PropTypes.array.isRequired,
};

export default function ListCardSubastaPrevias({ data }) {
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BASE_URL + "uploads";

    const formatDate = (date) => {
        if (!date) return "Sin fecha";
        const d = new Date(date.replace(" ", "T"));
        return d.toLocaleString();
    };

    const publicarSubasta = async (id) => {
        if (!window.confirm("¿Deseas publicar esta subasta?")) return;

        try {
            const res = await SubastaService.publicarSubasta(id);
            alert("✅ Subasta publicada correctamente");
            window.location.reload();
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "❌ No se pudo publicar la subasta"
            );
        }
    };

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((subasta) => (
                <Card key={subasta.id_subasta} className="flex flex-col">

                    {/* HEADER */}
                    <CardHeader className="text-center">
                        <CardTitle className="text-base font-semibold">
                            {subasta.objeto?.nombre}
                        </CardTitle>
                    </CardHeader>

                    {/* IMAGEN */}
                    <div className="relative w-full aspect-video">
                        {subasta.objeto?.imagen?.url_imagen ? (
                            <img
                                src={`${BASE_URL}/${subasta.objeto.imagen.url_imagen}`}
                                alt={subasta.objeto.nombre}
                                className="h-[250px] w-full object-fill"
                            />
                        ) : (
                            <div className="h-full w-full bg-muted flex items-center justify-center h-[250px]">
                                <ImageOff className="w-10 h-10 text-muted-foreground" />
                            </div>
                        )}

                        <Badge className="absolute top-2 right-2">
                            <p className="flex items-center gap-1 text-muted-foreground">
                            {subasta.objeto.historial_subastas[0].estado_subasta.descripcion}
                        </p>
                            
                        </Badge>
                    </div>

                    {/* CONTENIDO */}
                    <CardContent className="space-y-2 pt-4 text-sm">
                        <p className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            Inicio:
                            <span className="ml-1 text-foreground font-medium">
                                {formatDate(subasta.fecha_inicio)}
                            </span>
                        </p>

                        <p className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            Cierre:
                            <span className="ml-1 text-foreground font-medium">
                                {formatDate(subasta.fecha_cierre)}
                            </span>
                        </p>
                    </CardContent>

                    {/* BOTONES */}
                    <div className="border-t p-3 flex justify-between gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                navigate(`/subastas/update/${subasta.id_subasta}`)
                            }
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                        </Button>

                        <Button
                            size="sm"
                            onClick={() => navigate(`/subastas/publicar/${subasta.id_subasta}`)}
                        >
                            <Upload className="h-4 w-4 mr-1" />
                            Publicar
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    );
}