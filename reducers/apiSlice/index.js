import axios from "axios";

export const apiSlice = axios.create({
  baseURL: "http://10.0.0.128:3000",
});
