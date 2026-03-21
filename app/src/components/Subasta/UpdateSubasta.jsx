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
import { Save, ArrowLeft } from "lucide-react";

// Servicios
import SubastaService from "../../services/SubastaService";
import UsuarioService from "../../services/UsuarioService";

// Componentes custom
import { CustomInputField } from "../ui/custom/custom-input-field";

/* ================= VALIDACIONES ================= */

const schema = yup.object({
  nombre: yup.string(),
  fecha_inicio: yup.date().required("Fecha inicio requerida"),
  fecha_cierre: yup
    .date()
    .required("Fecha cierre requerida")
    .min(
      yup.ref("fecha_inicio"),
      "La fecha de cierre debe ser mayor a la fecha de inicio"
    ),
  precio_base: yup
    .number()
    .typeError("Debe ser un número")
    .positive("Debe ser mayor a 0")
    .required("Precio base requerido"),
  incremento_minimo: yup
    .number()
    .typeError("Debe ser un número")
    .positive("Debe ser mayor a 0")
    .required("Incremento mínimo requerido"),
});

/* ================= HELPERS ================= */

// "2026-03-20 15:00:00" → "2026-03-20T15:00" (para mostrar en datetime-local)
const fechaParaInput = (fechaStr) => {
  if (!fechaStr) return "";
  return fechaStr.replace(" ", "T").slice(0, 16);
};

// Date de Yup → "2026-03-20 15:00:00" (para enviar a MySQL)
const formatearFecha = (fecha) => {
  const d = new Date(fecha);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

/* ================= COMPONENTE ================= */

export default function UpdateSubasta() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [subastaOriginal, setSubastaOriginal] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");

  const USER_ID_SIMULADO = 2;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  /* ================= VALIDAR SI SE PUEDE EDITAR ================= */

  const canEdit = () => {
    if (!subastaOriginal) return false;
    if (subastaOriginal.estado_subasta?.descripcion === "Finalizada") return false;
    if (subastaOriginal.pujas?.length > 0) return false;
    return true;
  };

  /* ================= CARGAR DATOS ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subastaRes = await SubastaService.getSubastaById(id);
        const subasta = subastaRes.data.data;

        setSubastaOriginal(subasta);

        // ✅ Convertir fechas de "YYYY-MM-DD HH:mm:ss" a "YYYY-MM-DDTHH:mm"
        // para que el input datetime-local las muestre correctamente
        reset({
          nombre: subasta.objeto?.nombre || "",
          fecha_inicio: fechaParaInput(subasta.fecha_inicio),
          fecha_cierre: fechaParaInput(subasta.fecha_cierre),
          precio_base: subasta.precio_base,
          incremento_minimo: subasta.incremento_minimo,
        });

        const userRes = await UsuarioService.getUserById(USER_ID_SIMULADO);
        setUsuario(userRes.data.data || userRes.data);
      } catch (err) {
        console.error(err);
        setError("Error cargando subasta");
      }
    };

    fetchData();
  }, [id, reset]);

  /* ================= SUBMIT ================= */

  const onSubmit = async (dataForm) => {
    if (!canEdit()) {
      toast.error("No se puede editar esta subasta");
      return;
    }

    try {
      await SubastaService.updateSubasta({
        id_subasta: Number(id),
        fecha_inicio: formatearFecha(dataForm.fecha_inicio), // ✅
        fecha_cierre: formatearFecha(dataForm.fecha_cierre), // ✅
        precio_base: Number(dataForm.precio_base),
        incremento_minimo: Number(dataForm.incremento_minimo),
        id_vendedor: USER_ID_SIMULADO,
      });

      toast.success("Subasta actualizada correctamente");
      navigate("/subastas/previas");
    } catch (err) {
      console.error(err);
      toast.error(
        err?.response?.data?.message ||
        err.message ||
        "Error al actualizar subasta"
      );
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  /* ================= UI ================= */

  return (
    <Card className="p-6 max-w-3xl mx-auto mt-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Actualizar Subasta</h2>

      {!canEdit() && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          Esta subasta no se puede editar porque ya tiene pujas o está finalizada.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* OBJETO (SOLO LECTURA) */}
        <Controller
          name="nombre"
          control={control}
          render={({ field }) => (
            <CustomInputField
              {...field}
              label="Nombre del Producto"
              disabled
            />
          )}
        />

        {/* FECHAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="fecha_inicio"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                type="datetime-local"
                label="Fecha inicio"
                error={errors.fecha_inicio?.message}
                disabled={!canEdit()}
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
                disabled={!canEdit()}
              />
            )}
          />
        </div>

        {/* PRECIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="precio_base"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                type="number"
                label="Precio base"
                error={errors.precio_base?.message}
                disabled={!canEdit()}
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
                disabled={!canEdit()}
              />
            )}
          />
        </div>

        {/* USUARIO */}
        <div>
          <Label>Usuario vendedor</Label>
          <div className="w-full border rounded-md p-3 bg-gray-100 font-bold">
            {usuario ? usuario.nombre_completo : "Cargando usuario..."}
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancelar
          </Button>

          <Button type="submit" disabled={!canEdit()}>
            <Save className="w-4 h-4 mr-2" />
            Actualizar Subasta
          </Button>
        </div>
      </form>
    </Card>
  );
}