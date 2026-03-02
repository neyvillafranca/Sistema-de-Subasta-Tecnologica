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

  createObjeto(objeto) {
    return axios.post(BASE_URL, JSON.stringify(objeto));
  }

  updateObjeto(objeto) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(objeto)

    })
  }

  deleteObjeto = (id) =>
  axios.delete(`${BASE_URL}/${id}`);

changeEstadoObjeto = (id, estado) =>
  axios.patch(`${BASE_URL}/${id}/estado`, { estado });
}

export default new ObjetoService();

