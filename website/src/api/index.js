import axios from "axios";
const baseURL =
  process.env.API_URL === undefined
    ? "http://localhost:8080"
    : process.env.API_URL;
let api = axios.create({
  baseURL: `${baseURL}/api/course`,
});

export default api;
