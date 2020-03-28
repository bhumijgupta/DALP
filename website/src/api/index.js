import axios from "axios";

let api = axios.create({
  baseURL: "http://localhost:8080/api/course"
});

export default api;
