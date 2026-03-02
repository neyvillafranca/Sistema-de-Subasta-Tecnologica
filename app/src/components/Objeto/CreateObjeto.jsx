import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

// icons
import { Save, ArrowLeft } from "lucide-react";

// servicios
import ObjetoService from "../../services/ObjetoService";
import CategoriaService from "../../services/CategoriaService";
import ImageService from "../../services/ImageService";

// componentes reutilizables
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";
import { CustomSelect } from "../ui/custom/custom-select";
import { CustomInputField } from "../ui/custom/custom-input-field";

export default function CreateObjeto() {

  const navigate = useNavigate();

  const [dataCategorias, setDataCategorias] = useState([]);
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [error, setError] = useState("");

  const usuarioActual = {
    id_usuario: 2
  };

  // 🔹 Schema igual estilo Movie
  const objetoSchema = yup.object({
    nombre: yup.string().required("El nombre es requerido"),
    descripcion: yup
      .string()
      .min(20, "Mínimo 20 caracteres")
      .required("La descripción es requerida"),
    condicion: yup
      .number()
      .typeError("Seleccione una condición")
      .required("La condición es requerida"),
    categorias: yup
      .array()
      .min(1, "Debe seleccionar al menos una categoría"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      descripcion: "",
      condicion: "",
      categorias: [],
    },
    resolver: yupResolver(objetoSchema),
  });

  // 🔹 Cargar categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await CategoriaService.getCategorias();
        setDataCategorias(res.data.data || []);
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      }
    };
    fetchData();
  }, []);

  // 🔹 Manejo imagen
  const handleChangeImage = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile));
    }
  };

  // 🔹 Submit igual lógica Movie
  const onSubmit = async (dataForm) => {

    if (!file) {
      toast.error("Debe seleccionar una imagen");
      return;
    }

    try {

      // 1️⃣ Crear objeto
      const objetoData = {
        id_vendedor: usuarioActual.id_usuario,
        nombre: dataForm.nombre,
        descripcion: dataForm.descripcion,
        condicion: dataForm.condicion,
        categorias: dataForm.categorias
      };

      const response = await ObjetoService.create(objetoData);

      const idObjeto =
        response.data.id_objeto ??
        response.data.data?.id_objeto;

      // 2️⃣ Subir imagen
      const formData = new FormData();
      formData.append("file", file);
      formData.append("objetos_id_objeto", idObjeto);

      await ImageService.createImage(formData);

      toast.success("Objeto creado correctamente");
      navigate("/objetos");

    } catch (err) {
      console.error(err);
      setError("Error al crear objeto");
      toast.error("Error al crear objeto");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Crear Objeto</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* Nombre */}
        <Controller
          name="nombre"
          control={control}
          render={({ field }) => (
            <CustomInputField
              {...field}
              label="Nombre"
              placeholder="Ingrese el nombre"
              error={errors.nombre?.message}
            />
          )}
        />

        {/* Descripción */}
        <Controller
          name="descripcion"
          control={control}
          render={({ field }) => (
            <CustomInputField
              {...field}
              label="Descripción"
              placeholder="Descripción del objeto"
              error={errors.descripcion?.message}
            />
          )}
        />

        {/* Condición */}
        <Controller
          name="condicion"
          control={control}
          render={({ field }) => (
            <CustomSelect
              field={field}
              data={[
                { id: 1, label: "Nuevo" },
                { id: 2, label: "Usado" }
              ]}
              label="Condición"
              getOptionLabel={(item) => item.label}
              getOptionValue={(item) => item.id}
              error={errors.condicion?.message}
            />
          )}
        />

        {/* Categorías */}
        <Controller
          name="categorias"
          control={control}
          render={({ field }) => (
            <CustomMultiSelect
              field={field}
              data={dataCategorias}
              label="Categorías"
              getOptionLabel={(item) => item.nombre}
              getOptionValue={(item) => item.idcategoria}
              error={errors.categorias?.message}
              placeholder="Seleccione categorías"
            />
          )}
        />

        {/* Imagen */}
        <div>
          <Label className="block mb-2">Imagen</Label>

          <div
            className="relative w-56 h-56 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer"
            onClick={() => document.getElementById("image").click()}
          >
            {!fileURL && <p>Haz clic para subir imagen</p>}
            {fileURL && (
              <img
                src={fileURL}
                alt="preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          <input
            type="file"
            id="image"
            className="hidden"
            accept="image/*"
            onChange={handleChangeImage}
          />
        </div>

        {/* Botones */}
        <div className="flex justify-between gap-4">
          <Button
            type="button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Regresar
          </Button>

          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
        </div>

      </form>
    </Card>
  );
}