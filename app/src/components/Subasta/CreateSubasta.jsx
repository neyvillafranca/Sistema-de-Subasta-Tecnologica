import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// UI
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Save, ArrowLeft } from "lucide-react";

// Servicios
import SubastaService from "../../services/SubastaService";
import ObjetoService from "../../services/ObjetoService";
import UsuarioService from "../../services/UsuarioService";

// Componentes
import { CustomInputField } from "../ui/custom/custom-input-field";
import { CustomSelect } from "../ui/custom/custom-select";

/* ================= VALIDACIONES ================= */

const schema = yup.object({
  objeto_id: yup.string().required("Debe seleccionar un objeto"),

  fecha_inicio: yup
    .date()
    .required("Fecha inicio requerida"),

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

/* ================= HELPER ================= */

const formatearFecha = (fecha) => {
  const d = new Date(fecha);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

/* ================= COMPONENTE ================= */

export default function CreateSubasta() {
  const navigate = useNavigate();

  const [objetos, setObjetos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");

  // 🔒 Variable lógica simulada (NO editable)
  const USER_ID_SIMULADO = 2;

  /* ================= FORM ================= */

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      objeto_id: "",
      fecha_inicio: "",
      fecha_cierre: "",
      precio_base: "",
      incremento_minimo: "",
    },
  });

  /* ================= CARGA INICIAL ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const objetosRes = await ObjetoService.getObjetosActivos();
        setObjetos(objetosRes.data.data || []);

        const userRes = await UsuarioService.getUserById(USER_ID_SIMULADO);
        setUsuario(userRes.data.data || userRes.data);
      } catch (err) {
        console.error(err);
        setError("Error cargando datos");
      }
    };

    fetchData();
  }, []);

  /* ================= SUBMIT ================= */

  const onSubmit = async (dataForm) => {
    try {
      const subasta = {
        id_objeto: Number(dataForm.objeto_id),
        fecha_inicio: formatearFecha(dataForm.fecha_inicio), // ✅
        fecha_cierre: formatearFecha(dataForm.fecha_cierre), // ✅
        precio_base: Number(dataForm.precio_base),
        incremento_minimo: Number(dataForm.incremento_minimo),
        id_vendedor: USER_ID_SIMULADO,
      };

      const response = await SubastaService.createSubasta(subasta);

      if (response.data?.success === false) {
        throw new Error(response.data.message);
      }

      toast.success("Subasta creada correctamente");
      navigate("/subastas/previas");

    } catch (err) {
      console.error("ERROR CREAR SUBASTA:", err);
      toast.error(
        err?.response?.data?.message ||
        err.message ||
        "No se pudo crear la subasta"
      );
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  /* ================= UI ================= */

  return (
    <Card className="p-6 max-w-3xl mx-auto mt-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Crear Subasta</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* OBJETO */}
        <Controller
          name="objeto_id"
          control={control}
          render={({ field }) => (
            <CustomSelect
              field={field}
              label="Objeto"
              data={objetos}
              getOptionLabel={(o) => o.nombre}
              getOptionValue={(o) => o.id_objeto}
              error={errors.objeto_id?.message}
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
                label="Fecha y hora inicio"
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
                label="Fecha y hora cierre"
                error={errors.fecha_cierre?.message}
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

        {/* USUARIO VENDEDOR */}
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
            className="w-1/3"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Cancelar
          </Button>

          <Button type="submit" className="w-2/3">
            <Save className="w-4 h-4 mr-2" />
            Crear Subasta
          </Button>
        </div>
      </form>
    </Card>
  );
}