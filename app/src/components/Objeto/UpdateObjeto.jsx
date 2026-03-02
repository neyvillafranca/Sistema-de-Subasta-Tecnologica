import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getObjeto, updateObjeto } from "./services/ObjetoService";

export default function UpdateObjeto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      const res = await getObjeto(id);
      setForm(res.data.data);
    };
    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre) {
      setError("Nombre requerido");
      return;
    }

    try {
      await updateObjeto(id, form);
      navigate("/objetos");
    } catch (err) {
      setError(err.response?.data?.message);
    }
  };

  if (!form) return <p>Cargando...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h2>Actualizar Objeto</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <input
        value={form.nombre}
        onChange={(e) =>
          setForm({ ...form, nombre: e.target.value })
        }
      />

      <textarea
        value={form.descripcion}
        onChange={(e) =>
          setForm({ ...form, descripcion: e.target.value })
        }
      />

      <button type="submit">Actualizar</button>
    </form>
  );
}