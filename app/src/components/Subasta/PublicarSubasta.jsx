import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// UI
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, ArrowLeft } from "lucide-react";

// Servicios
import SubastaService from "@/services/SubastaService";
import UsuarioService from "@/services/UsuarioService";

// Custom
import { CustomInputField } from "@/components/ui/custom/custom-input-field";

/* ================= VALIDACIONES ================= */

const schema = yup.object({
  nombre: yup.string(),
  fecha_inicio: yup.date().required("Fecha inicio requerida"),
  fecha_cierre: yup
    .date()
    .required("Fecha cierre requerida")
    .min(yup.ref("fecha_inicio"), "Debe ser mayor a la fecha inicio"),
  precio_base: yup.number().positive().required("Precio base requerido"),
  incremento_minimo: yup.number().positive().required("Incremento mínimo requerido"),
});

export default function PublicarSubasta() {
  const { id } = useParams();           // ✅ ID de la subasta desde la URL
  const navigate = useNavigate();

  const [subasta, setSubasta] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [publicando, setPublicando] = useState(false);

  const USER_ID_SIMULADO = 2;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  /* ================= CARGA ================= */

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await SubastaService.getSubastaById(id);
        const data = res.data.data;

        setSubasta(data);

        reset({
          nombre: data.objeto?.nombre ?? "",
          fecha_inicio: data.fecha_inicio ?? "",
          fecha_cierre: data.fecha_cierre ?? "",
          precio_base: data.precio_base ?? "",
          incremento_minimo: data.incremento_minimo ?? "",
        });

        const userRes = await UsuarioService.getUserById(USER_ID_SIMULADO);
        setUsuario(userRes.data.data);
      } catch {
        toast.error("Error al cargar la subasta");
      }
    };

    cargar();
  }, [id, reset]);

  /* ================= PUBLICAR ================= */

  const onPublicar = async (form) => {
  console.log("✅ Form válido, id:", id);
  console.log("✅ URL que se va a llamar:", `${import.meta.env.VITE_BASE_URL}subasta/publicar/${id}`);

  if (new Date(form.fecha_inicio) <= new Date()) {
    toast.error("La fecha de inicio debe ser futura");
    return;
  }

  try {
    setPublicando(true);
    const res = await SubastaService.publicarSubasta(id);
    console.log("✅ Respuesta del backend:", res);
    toast.success("Subasta publicada y activada correctamente");
    navigate("/subastas/activas");
  } catch (error) {
    console.log("❌ Error completo:", error);
    console.log("❌ Response:", error?.response);
    const mensaje = error?.response?.data?.message || "Error al publicar la subasta";
    toast.error(mensaje);
  } finally {
    setPublicando(false);
  }
};

  /* ================= RENDER ================= */

  if (!subasta) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <Card className="p-6 max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Publicar Subasta</h2>

      <form onSubmit={handleSubmit(onPublicar)} className="space-y-6">

        {/* Nombre del producto — solo lectura */}
        <Controller
          name="nombre"
          control={control}
          render={({ field }) => (
            <CustomInputField {...field} label="Producto" disabled />
          )}
        />

        {/* Fechas */}
        <div className="grid md:grid-cols-2 gap-6">
          <Controller
            name="fecha_inicio"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                type="datetime-local"
                label="Fecha inicio"
                error={errors.fecha_inicio?.message}
              />
            )}
          />

          <Controller
            name="fecha_cierre"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                type="datetime-local"
                label="Fecha cierre"
                error={errors.fecha_cierre?.message}
              />
            )}
          />
        </div>

        {/* Precios */}
        <div className="grid md:grid-cols-2 gap-6">
          <Controller
            name="precio_base"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                type="number"
                label="Precio base"
                error={errors.precio_base?.message}
              />
            )}
          />

          <Controller
            name="incremento_minimo"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                type="number"
                label="Incremento mínimo"
                error={errors.incremento_minimo?.message}
              />
            )}
          />
        </div>

        {/* Vendedor — solo lectura */}
        <div>
          <Label>Vendedor</Label>
          <div className="p-3 bg-gray-100 rounded">
            {usuario?.nombre_completo ?? "Cargando..."}
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={publicando}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Cancelar
          </Button>

          <Button type="submit" disabled={publicando}>
            <Upload className="mr-2 w-4 h-4" />
            {publicando ? "Publicando..." : "Publicar Subasta"}
          </Button>
        </div>

      </form>
    </Card>
  );
}