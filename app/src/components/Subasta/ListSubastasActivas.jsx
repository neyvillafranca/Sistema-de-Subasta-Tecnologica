import { useEffect, useState } from "react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { EmptyState } from "../ui/custom/EmptyState";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import ListCardSubastaActivas from "./ListCardSubastaActivas";
import SubastaService from "@/services/SubastaService";

export default function ListSubastasActivas() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await SubastaService.getSubastasActivas();

                console.log("RESPUESTA API SUBASTAS ACTIVAS:", response.data);

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
                title="Error al cargar subastas activas"
                message={error}
            />
        );

    if (!data || data.length === 0)
        return <EmptyState message="No hay subastas activas en este momento." />;

    return (
        <div className="mx-auto max-w-7xl p-6">
            <ListCardSubastaActivas data={data} />
        </div>
    );
}