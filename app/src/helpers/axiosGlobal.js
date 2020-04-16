import axios from 'axios';

let axiosInstance = null;

export default {
  init: () => (axiosInstance = axios.create()),
  get: () => {
    if (!axiosInstance) {
      console.log('CREATING NEW ISNTANCE');
      axiosInstance = axios.create();
    }
    return axiosInstance;
  },
};
