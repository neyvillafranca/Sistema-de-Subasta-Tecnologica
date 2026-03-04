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
import ObjetoService from "../../services/ObjetoService";
import CategoriaService from "../../services/CategoriaService";
import ImageService from "../../services/ImageService";

// Componentes personalizados
import { CustomInputField } from "../ui/custom/custom-input-field";
import { CustomSelect } from "../ui/custom/custom-select";
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";

/* ===================== VALIDACIÓN ===================== */

const schema = yup.object({
  nombre: yup.string().required("Nombre requerido").min(3),
  descripcion: yup.string().required("Descripción requerida").min(10),
  condicion: yup.string().required("Seleccione la condición"),
  categorias: yup.array().min(1, "Seleccione al menos una categoría"),
});

export default function CreateObjeto() {
  const navigate = useNavigate();

  const [categorias, setCategorias] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Usuario simulado (debe existir en BD)
  const usuarioActual = { id_usuario: 2 };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      condicion: "",
      categorias: [],
    },
  });

  /* ===================== CARGAR CATEGORÍAS ===================== */

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const res = await CategoriaService.getCategorias();
        setCategorias(res.data.data || res.data || []);
      } catch (err) {
        toast.error("Error al cargar categorías");
      }
    };
    loadCategorias();
  }, []);

  /* ===================== IMAGEN ===================== */

  const handleImageChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  /* ===================== SUBMIT ===================== */

  const onSubmit = async (data) => {
    if (!file) {
      toast.error("Debe seleccionar una imagen");
      return;
    }
console.log("Categorias seleccionadas:", data.categorias);
    try {
      // 1️⃣ Crear objeto (JSON)
      const objeto = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        condicion: data.condicion,
        id_vendedor: usuarioActual.id_usuario,
        categorias: data.categorias
      };
console.log("Categorias enviadas:", objeto.categorias);
      const resObjeto = await ObjetoService.createObjeto(objeto);
      const idObjeto =
        resObjeto.data?.id_objeto ||
        resObjeto.data?.data?.id_objeto;

      if (!idObjeto) {
        console.error("Respuesta completa:", resObjeto.data);
        throw new Error("El servidor no devolvió el ID del objeto");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("objetos_id_objeto", idObjeto);

      await ImageService.createImage(formData);

      //await ObjetoService.getObjeto(idObjeto);
      

      toast.success("Subasta creada correctamente");
      navigate("/objetos");
    } catch (error) {
      console.error(error);
      toast.error("Error al crear la subasta");
    }
  };

  /* ===================== UI ===================== */

  return (
    <Card className="p-6 max-w-4xl mx-auto mt-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Nueva Subasta Tecnológica</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="nombre"
          control={control}
          render={({ field }) => (
            <CustomInputField
              {...field}
              label="Nombre del Producto"
              error={errors.nombre?.message}
            />
          )}
        />

        <Controller
          name="descripcion"
          control={control}
          render={({ field }) => (
            <CustomInputField
              {...field}
              label="Descripción"
              error={errors.descripcion?.message}
            />
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Controller
            name="condicion"
            control={control}
            render={({ field }) => (
              <CustomSelect
                field={field}
                label="Condición"
                data={[
                  { id: "1", nombre: "Nuevo" },
                  { id: "2", nombre: "Usado" },
                ]}
                getOptionLabel={(opt) => opt.nombre}
                getOptionValue={(opt) => opt.id}
                error={errors.condicion?.message}
              />
            )}
          />

          <Controller
            name="categorias"
            control={control}
            render={({ field }) => (
              <CustomMultiSelect
                field={field}
                label="Categorías"
                data={categorias}
                getOptionLabel={(item) => item.nombre}
                getOptionValue={(item) =>
                  item.idcategoria || item.id_categoria || item.id
                }
                error={errors.categorias?.message}
                placeholder="Seleccione categorías"
              />
            )}
          />
        </div>

        {/* IMAGEN */}
        <div className="space-y-2">
          <Label>Imagen del Producto</Label>
          <div
            className="w-56 h-56 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer"
            onClick={() => document.getElementById("file-input").click()}
          >
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <span className="text-sm text-muted-foreground">
                Seleccionar imagen
              </span>
            )}
          </div>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />
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