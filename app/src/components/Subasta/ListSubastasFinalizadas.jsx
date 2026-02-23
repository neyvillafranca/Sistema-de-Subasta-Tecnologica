import { useEffect, useState } from "react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { EmptyState } from "../ui/custom/EmptyState";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import ListCardSubastasFinalizadas from "./ListCardSubastasFinalizadas";
import SubastaService from "@/services/SubastaService";

export default function ListSubastasFinalizadas() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await SubastaService.getSubastasFinalizadas();

                console.log(
                    "RESPUESTA API SUBASTAS FINALIZADAS:",
                    response.data
                );

                if (!response.data.success) {
                    setError(response.data.message);
                } else {
                    setData(response.data.data);
                }
            } catch (err) {
                setError(err.message || "Error al conectar con el servidor");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <LoadingGrid type="grid" />;

    if (error)
        return (
            <ErrorAlert
                title="Error al cargar subastas finalizadas"
                message={error}
            />
        );

    if (!data || data.length === 0)
        return (
            <EmptyState message="No hay subastas finalizadas registradas." />
        );

    return (
        <div className="mx-auto max-w-7xl p-6">
            <ListCardSubastasFinalizadas data={data} />
        </div>
    );
}