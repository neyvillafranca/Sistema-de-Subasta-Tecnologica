import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const SubastaService = {
  getSubastasActivas() {
    return axios.get(`${BASE_URL}subasta/activas`);
  },
   getSubastasFinalizadas() {
    return axios.get(`${BASE_URL}subasta/finalizadas`);
  },
   getSubastaById(id) {
    return axios.get(BASE_URL + '/' + 'subasta' + '/' + id);
  },

  
};

export default SubastaService;