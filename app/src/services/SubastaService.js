
import CancelarSubasta from "@/components/Subasta/CancelarSubasta";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "subasta";

const SubastaService = {
  getSubastasActivas() {
    return axios.get(`${BASE_URL}/activas`);
  },
   getSubastasFinalizadas() {
    return axios.get(`${BASE_URL}/finalizadas`);
  },
  getSubastasPrevias() {
    return axios.get(`${BASE_URL}/previas`);
  },
   getSubastaById(id) {
    return axios.get(BASE_URL + '/' + id);
  },

  createSubasta(subasta) {
    return axios.post(BASE_URL, JSON.stringify(subasta));
  },

  updateSubasta(subasta) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(subasta)

    })
  },

  publicarSubasta(id) {
  return axios.put(`${BASE_URL}/publicar/${id}`);
},

cancelarSubasta(id) {
  return axios.put(`${BASE_URL}/cancelar/${id}`);
}

  
};

export default SubastaService;