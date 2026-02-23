import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "objeto"; // ← SIN 's'

class ObjetoService {
  getObjetos() {
    return axios.get(BASE_URL);
  }

  getObjetoById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

    getUserById(UserId) {
    return axios.get(BASE_URL + '/' + UserId);
  }
}

export default new ObjetoService();