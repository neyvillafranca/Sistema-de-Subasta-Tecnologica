import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

import { Save, ArrowLeft } from "lucide-react";

import UsuarioService from "@/services/UsuarioService";

export default function UpdateUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre_completo: "",
      email: "",
      estado: "",
    },
  });

  // 🔹 Cargar usuario por ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UsuarioService.getUserById(id);
        const result = response.data;

        if (result.success) {
          reset({
            nombre_completo: result.data.nombre_completo,
            email: result.data.email,
            estado: result.data.estado,
          });
        } else {
          setError(result.message || "Usuario no encontrado");
        }
      } catch (err) {
        setError(err.message || "Error al cargar usuario");
      } finally {
        setLoadingData(false);
      }
    };

    fetchUser();
  }, [id, reset]);

  // 🔹 Update
  const onSubmit = async (dataForm) => {
    try {
      setLoading(true);

      const dataToSend = {
        id_usuario: Number(id),
        nombre_completo: dataForm.nombre_completo,
        email: dataForm.email,
        estado: Number(dataForm.estado),
      };

      console.log("DATA ENVIADA:", dataToSend);

      const response = await UsuarioService.updateUsuario(dataToSend);

      console.log("RESPONSE COMPLETO:", response.data);

      if (response.data) {
        toast.success("Usuario actualizado correctamente");
        navigate("/usuarios");
      } else {
        toast.error("No se pudo actualizar el usuario");
      }

    } catch (error) {
      console.error(error);
      toast.error("Error del servidor");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) return <p className="text-center mt-10">Cargando usuario...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Editar Usuario</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Nombre */}
        <div>
          <Label>Nombre Completo</Label>
          <Controller
            name="nombre_completo"
            control={control}
            rules={{ required: "El nombre es requerido" }}
            render={({ field }) => (
              <Input {...field} placeholder="Nombre completo" />
            )}
          />
          {errors.nombre_completo && (
            <p className="text-red-500 text-sm">
              {errors.nombre_completo.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <Label>Email</Label>
          <Controller
            name="email"
            control={control}
            rules={{ required: "El email es requerido" }}
            render={({ field }) => (
              <Input type="email" {...field} placeholder="Correo electrónico" />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Estado */}
        <div>
          <Label>Estado</Label>
          <Controller
            name="estado"
            control={control}
            rules={{ required: "Seleccione estado" }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full border rounded-md p-2"
              >
                <option value="">Seleccione</option>
                <option value={1}>Activo</option>
                <option value={0}>Bloqueado</option>
              </select>
            )}
          />
          {errors.estado && (
            <p className="text-red-500 text-sm">
              {errors.estado.message}
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-between">
          <Button type="button" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Regresar
          </Button>

          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>

      </form>
    </Card>
  );
}