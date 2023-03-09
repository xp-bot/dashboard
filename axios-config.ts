import axios from 'axios';

const baseURL = `${process.env.BACKEND_DOMAIN}/`;
const baseIlumURL = `${process.env.ILUM_DOMAIN}/`;

const axiosApp = axios.create({
  baseURL,
  withCredentials: true,
});
const axiosIlumApp = axios.create({
  baseURL: baseIlumURL,
});

export default axiosApp;

export { axiosIlumApp };
