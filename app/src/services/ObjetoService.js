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

  /*createObjeto(objeto) {
    return axios.post(BASE_URL, JSON.stringify(objeto));
    //return axios.post(BASE_URL, objeto);
  }*/
  createObjeto(objeto) {
    // Usamos la configuración completa para asegurar compatibilidad total
    /*return axios({
      method: 'post',
      url: BASE_URL,
      data: JSON.stringify(objeto), // Lo convertimos a string como en tu ejemplo exitoso
      headers: {
        'Content-Type': 'application/json' // Esto le dice al PHP que debe procesar JSON
      }
    });*/
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

