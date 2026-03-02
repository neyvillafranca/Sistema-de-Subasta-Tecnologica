import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'rol';

const RolService = {
  getRoles() {
    return axios.get(BASE_URL);
  },
  
  getRolById(rolId) {
    return axios.get(`${BASE_URL}/${rolId}`);
  }
};

export default RolService;