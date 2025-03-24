import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

export const signup = (email, password, role, name) =>
  axios.post(`${API_URL}/api/auth/signup`, { email, password, role , name});

export const login = (email, password) =>
  axios.post(`${API_URL}/api/auth/login`, { email, password });
