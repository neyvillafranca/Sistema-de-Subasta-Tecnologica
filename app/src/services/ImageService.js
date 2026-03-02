// import axios from 'axios';
// const BASE_URL = import.meta.env.VITE_BASE_URL + 'image';

// class ImageService {
//     createImage(formData){
//         return axios.post(BASE_URL,formData,{
//             headers:{
//                 'Content-Type':'multipart/form-data;',
//                 'Accept':'multipart/form-data'
//             }
//         })
//     } 
// }
// export default new ImageService()

import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "imagen";

class ImageService {

  createImage(formData){
        return axios.post(BASE_URL,formData,{
            headers:{
                'Content-Type':'multipart/form-data;',
                'Accept':'multipart/form-data'
            }
        })
    } 

  getImagesByObjeto(idObjeto) {
    return axios.get(`${BASE_URL}/${idObjeto}`);
  }

}

export default new ImageService();