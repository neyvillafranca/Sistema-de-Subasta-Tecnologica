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
import ObjetoService from "../../services/ObjetoService";
import CategoriaService from "../../services/CategoriaService";
import ImageService from "../../services/ImageService";
import UsuarioService from "../../services/UsuarioService";

// Componentes
import { CustomInputField } from "../ui/custom/custom-input-field";
import { CustomSelect } from "../ui/custom/custom-select";
import { CustomMultiSelect } from "../ui/custom/custom-multiple-select";

/* ================= VALIDACIÓN ================= */

const schema = yup.object({
  nombre: yup
    .string()
    .required("Nombre requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),

  descripcion: yup
    .string()
    .required("Descripción requerida")
    .min(20, "La descripción debe tener al menos 20 caracteres"),

  condicion: yup.string().required("Seleccione la condición"),

  categorias: yup
    .array()
    .min(1, "Seleccione al menos una categoría"),
});

export default function UpdateObjeto() {
  const navigate = useNavigate();
  const { id } = useParams();

  const BASE_URL_image = import.meta.env.VITE_BASE_URL + "uploads";

  const [categorias, setCategorias] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [estado, setEstado] = useState("");
  const [file, setFile] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [error, setError] = useState("");
  const [objetoOriginal, setObjetoOriginal] = useState(null);

  /* ================= REACT HOOK FORM ================= */

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      nombre: "",
      descripcion: "",
      condicion: "",
      categorias: [],
    },
  });

  /* ================= VALIDACIÓN DE EDICIÓN ================= */

  const canEdit = () => {
    if (!objetoOriginal) return false;

    const tieneSubastaActiva = (objetoOriginal.historial_subastas || []).some(
      (s) => s.estado_subasta.descripcion === "Activa"
    );

    return !tieneSubastaActiva;
  };

  /* ================= CARGAR DATOS ================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasRes = await CategoriaService.getCategorias();
        const objetoRes = await ObjetoService.getObjetoById(id);

        setCategorias(categoriasRes.data.data || []);

        if (objetoRes.data?.data) {
          const objeto = objetoRes.data.data;
          setObjetoOriginal(objeto);

          reset({
            id: objeto.id_objeto,
            nombre: objeto.nombre,
            descripcion: objeto.descripcion,
            condicion: String(objeto.condicion),
            categorias: objeto.categoria.map((c) =>
              String(c.id_categoria)
            ),
          });

          if (objeto.imagen) {
            setFileURL(BASE_URL_image + "/" + objeto.imagen.url_imagen);
          }

          //setEstado(objeto.idestadoobjeto === "1" ? "Activo" : "Inactivo");
          setEstado(objeto.estado?.descripcion || "Sin estado");

          if (objeto.id_vendedor) {
            const userRes = await UsuarioService.getUserById(
              objeto.id_vendedor
            );
            setUsuario(userRes.data.data || userRes.data);
          }
        }
      } catch (err) {
        console.error(err);
        setError("Error cargando el objeto");
      }
    };

    fetchData();
  }, [id, reset, BASE_URL_image]);

  /* ================= IMAGEN ================= */

  const handleChangeImage = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileURL(URL.createObjectURL(selectedFile));
    }
  };

  /* ================= SUBMIT ================= */

  const onSubmit = async (dataForm) => {
    if (!canEdit()) {
      toast.error("No se puede editar un objeto con subasta activa");
      return;
    }

    try {
      const objeto = {
        id_objeto: Number(id),
        nombre: dataForm.nombre,
        descripcion: dataForm.descripcion,
        condicion: Number(dataForm.condicion),
        id_vendedor: objetoOriginal.id_vendedor,
        idestadoobjeto: objetoOriginal.idestadoobjeto,
        categoria: dataForm.categorias.map((idCat) => ({
          id_categoria: Number(idCat),
        })),
      };

      await ObjetoService.updateObjeto(objeto);

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("objetos_id_objeto", id);
        await ImageService.createImage(formData);
      }

      toast.success("Objeto actualizado correctamente");
      navigate("/objetos");
    } catch (error) {
      console.error("ERROR UPDATE:", error);
      toast.error("Error al actualizar objeto");
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;

  /* ================= UI ================= */

  return (
    <Card className="p-6 max-w-4xl mx-auto mt-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Actualizar Objeto</h2>

      {!canEdit() && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          Este objeto no se puede editar porque tiene una subasta activa.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          name="nombre"
          control={control}
          render={({ field }) => (
            <CustomInputField
              {...field}
              label="Nombre del Producto"
              error={errors.nombre?.message}
              disabled={!canEdit()}
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
              disabled={!canEdit()}
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
                disabled={!canEdit()}
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
                getOptionValue={(item) => item.id_categoria}
                error={errors.categorias?.message}
                disabled={!canEdit()}
              />
            )}
          />
        </div>

        <div>
          <Label>Usuario vendedor</Label>
          <div className="w-full border rounded-md p-3 bg-gray-100 font-bold">
            {usuario ? usuario.nombre_completo : "Cargando usuario..."}
          </div>
        </div>

        <div>
          <Label>Estado</Label>
          <div className="w-full border rounded-md p-3 bg-gray-100 font-bold">
            {estado}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Imagen del Producto</Label>
          <div
            className={`w-56 h-56 border-2 border-dashed rounded-lg flex items-center justify-center ${
              canEdit() ? "cursor-pointer" : "opacity-50"
            }`}
            onClick={() =>
              canEdit() && document.getElementById("file-input").click()
            }
          >
            {fileURL ? (
              <img
                src={fileURL}
                alt="preview"
                className="w-full h-full object-contain p-2"
              />
            ) : (
              <span>Seleccionar imagen</span>
            )}
          </div>

          <input
            id="file-input"
            type="file"
            hidden
            accept="image/*"
            onChange={handleChangeImage}
            disabled={!canEdit()}
          />
        </div>

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

          <Button type="submit" className="w-2/3" disabled={!canEdit()}>
            <Save className="w-4 h-4 mr-2" />
            Actualizar Objeto
          </Button>
        </div>
      </form>
    </Card>
  );
}