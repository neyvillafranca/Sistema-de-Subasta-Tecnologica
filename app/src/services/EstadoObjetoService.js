import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "estadoobjeto";

class EstadoObjetoService {

  getEstados() {
    return axios.get(BASE_URL);
  }

}

export default new EstadoObjetoService();