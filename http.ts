// frontend/lib/api.ts (ou onde você tem este código)
import axios from "axios";
import { constants } from "./constants";

const http = axios.create({ baseURL: constants.baseAPI });

http.interceptors.request.use(
  (config) => {
    const userDataString = localStorage.getItem("warmzap:userData");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        const token = userData.token; // Extrai o token da propriedade "token"
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Erro ao parsear userData do localStorage:", error);
        // Lide com o erro, talvez removendo o item inválido do localStorage
        localStorage.removeItem("warmzap:userData");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default http;
