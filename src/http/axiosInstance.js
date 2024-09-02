import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/",
<<<<<<< HEAD
  headers: { "Content-Type": "application/json", Accept: "application/json" },
=======
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
>>>>>>> b6d5298edbe982e3ae71d11d8ed6716b7a3ee674
});

export default API;
