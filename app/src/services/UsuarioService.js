import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'usuario';

class UsuarioService {
  getUsuario() {
    return axios.get(BASE_URL);
  }
  getUserById(UserId) {
    return axios.get(BASE_URL + '/' + UserId);
  }

    updateUsuario(Usuario) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Usuario)

    })
  }
}

export default new UsuarioService();
