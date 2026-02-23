import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + 'subasta';

class PujaService {
 getPujasBySubasta(id) {
  return axios.get(BASE_URL + `/pujas/${id}`);
}
}

export default new PujaService();


