import axios from "axios";

const api = axios.create({
  baseURL: "https://hrms-back-end.onrender.com/api"
});

export default api;