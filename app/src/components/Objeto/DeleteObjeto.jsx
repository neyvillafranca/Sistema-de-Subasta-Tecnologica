import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import ObjetoService from "../../services/ObjetoService";
import { Card } from "@/components/ui/card";

export default function DeleteObjeto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [objeto, setObjeto] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchObjeto = async () => {
      try {
        const res = await ObjetoService.getObjetoById(id);
        if (res.data?.data) {
          setObjeto(res.data.data);
        } else {
          setError("Objeto no encontrado");
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar el objeto");
      } finally {
        setLoading(false);
      }
    };

    fetchObjeto();
  }, [id]);

  // ✅ Validación para habilitar el botón eliminar
  const canDelete = () => {
    if (!objeto) return false;

    // Solo objetos registrados
    const estaRegistrado = objeto.estado?.descripcion === "Registrado";

    // No se puede eliminar si tiene subasta activa o finalizada
    const tieneSubasta = (objeto.historial_subastas || []).some(
      (s) =>
        s.estado_subasta.descripcion === "Activa" || s.estado_subasta.descripcion === "Finalizada"
    );

    // No se puede eliminar si ya fue vendido (puedes adaptar según tu backend)
    const vendido = objeto.vendido || false;

    return estaRegistrado && !tieneSubasta && !vendido;
  };

  const handleDelete = async () => {
  if (!objeto) return;

  const confirmDelete = window.confirm(
    `¿Estás seguro que quieres eliminar el objeto "${objeto.nombre}"?`
  );
  if (!confirmDelete) return;

  try {
    console.log("Eliminando objeto con ID:", id); // <-- verificar ID
    await ObjetoService.deleteObjeto(id);
    toast.success("Objeto eliminado correctamente");
    navigate("/objetos");
  } catch (err) {
    console.error("ERROR Axios:", err);
    console.log("err.response.data:", err.response?.data);
    toast.error(err?.response?.data?.message || "No se pudo eliminar el objeto");
  }
};

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <Card className="p-6 max-w-md mx-auto mt-8 shadow-lg text-center">
      <h2 className="text-2xl font-bold mb-4">Eliminar Objeto</h2>
      <p className="mb-6">
        Vas a eliminar el objeto: <strong>{objeto.nombre}</strong>
      </p>
      <div className="flex justify-center gap-4">
        <Button variant="outline" onClick={() => navigate("/objetos")}>
          Cancelar
        </Button>
        <Button
          className="bg-red-600 hover:bg-red-700"
          onClick={handleDelete}
          disabled={!canDelete()}
        >
          Eliminar
        </Button>
      </div>
      {!canDelete() && (
        <p className="mt-4 text-sm text-gray-500">
          Solo se pueden eliminar objetos estén en subasta ni vendidos.
        </p>
      )}
    </Card>
  );
}