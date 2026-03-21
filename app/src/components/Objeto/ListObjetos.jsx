import { useEffect, useState } from "react";
import { LoadingGrid } from "../ui/custom/LoadingGrid";
import { EmptyState } from "../ui/custom/EmptyState";
import { ErrorAlert } from "../ui/custom/ErrorAlert";
import ListCardObjetos from "./ListCardObjetos"; 
import ObjetoService from "@/services/ObjetoService";

export default function ListObjetos() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ObjetoService.getObjetos();

        console.log("RESPUESTA API OBJETOS:", response.data);

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
  if (error) return <ErrorAlert title="Error al cargar objetos" message={error} />;
  if (!data || data.length === 0)
    return <EmptyState message="No se encontraron objetos en la subasta." />;

  return (
    <div className="mx-auto max-w-7xl p-6">
      <ListCardObjetos data={data} />
    </div>
  );
}