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
import { XCircle, ArrowLeft } from "lucide-react";

// Servicios
import SubastaService from "@/services/SubastaService";
import UsuarioService from "@/services/UsuarioService";

// Custom
import { CustomInputField } from "@/components/ui/custom/custom-input-field";

/* ================= VALIDACIONES ================= */

const schema = yup.object({
  nombre: yup.string(),
  fecha_inicio: yup.date().required("Fecha inicio requerida"),
  fecha_cierre: yup.date().required("Fecha cierre requerida"),
  precio_base: yup.number().positive().required("Precio base requerido"),
  incremento_minimo: yup.number().positive().required("Incremento mínimo requerido"),
});

export default function CancelarSubasta() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [subasta, setSubasta] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [cancelando, setCancelando] = useState(false);

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

  /* ================= CANCELAR ================= */

  const onCancelar = async () => {
    const confirmado = window.confirm(
      "¿Estás seguro de que deseas cancelar esta subasta? Esta acción no se puede deshacer."
    );
    if (!confirmado) return;

    try {
      setCancelando(true);
      await SubastaService.cancelarSubasta(id);
      toast.success("Subasta cancelada correctamente");
      navigate("/subastas/previas");
    } catch (error) {
      const mensaje =
        error?.response?.data?.message || "Error al cancelar la subasta";
      toast.error(mensaje);
    } finally {
      setCancelando(false);
    }
  };

  /* ================= RENDER ================= */

  if (!subasta) return <p className="text-center mt-10">Cargando...</p>;

  // ✅ Validaciones de cancelación
  const yaTieneInicio = new Date(subasta.fecha_inicio) <= new Date();
  const tienePujas = subasta.cantidad_pujas > 0;
  const noPuedeCancelar = yaTieneInicio || tienePujas;

  return (
    <Card className="p-6 max-w-3xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">Cancelar Subasta</h2>

      <form onSubmit={handleSubmit(onCancelar)} className="space-y-6">

        {/* Nombre del producto — solo lectura */}
        <Controller
          name="nombre"
          control={control}
          render={({ field }) => (
            <CustomInputField {...field} label="Producto" disabled />
          )}
        />

        {/* Fechas — solo lectura */}
        <div className="grid md:grid-cols-2 gap-6">
          <Controller
            name="fecha_inicio"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                type="datetime-local"
                label="Fecha inicio"
                disabled
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
                disabled
                error={errors.fecha_cierre?.message}
              />
            )}
          />
        </div>

        {/* Precios — solo lectura */}
        <div className="grid md:grid-cols-2 gap-6">
          <Controller
            name="precio_base"
            control={control}
            render={({ field }) => (
              <CustomInputField
                {...field}
                type="number"
                label="Precio base"
                disabled
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
                disabled
                error={errors.incremento_minimo?.message}
              />
            )}
          />
        </div>

        {/* Pujas — informativo */}
        <div>
          <Label>Cantidad de pujas</Label>
          <div className="p-3 bg-gray-100 rounded text-sm font-medium">
            {subasta.cantidad_pujas ?? 0} pujas
          </div>
        </div>

        {/* Vendedor — solo lectura */}
        <div>
          <Label>Vendedor</Label>
          <div className="p-3 bg-gray-100 rounded">
            {usuario?.nombre_completo ?? "Cargando..."}
          </div>
        </div>

        {/* ✅ Avisos de validación */}
        {noPuedeCancelar && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 space-y-1">
            {tienePujas && (
              <p className="text-sm text-red-600 font-medium">
                ⚠ Esta subasta tiene {subasta.cantidad_pujas} puja(s) registrada(s).
              </p>
            )}
            {yaTieneInicio && (
              <p className="text-sm text-red-600 font-medium">
                ⚠ Esta subasta ya ha iniciado ({subasta.fecha_inicio}).
              </p>
            )}
            <p className="text-sm text-red-500">
              No es posible cancelar la subasta.
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={cancelando}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Volver
          </Button>

          <Button
            type="submit"
            variant="destructive"
            disabled={cancelando || noPuedeCancelar}
          >
            <XCircle className="mr-2 w-4 h-4" />
            {cancelando ? "Cancelando..." : "Cancelar Subasta"}
          </Button>
        </div>

      </form>
    </Card>
  );
}