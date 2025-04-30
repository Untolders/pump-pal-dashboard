import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:3000/api/v1/",
    // withCredentials: true,
});

export const googleAuth = (code) => api.get(`/google-login?code=${code}`);


export const isAuthenticated = (): boolean => {
    const user = localStorage.getItem("user-info");
    return !!(user && user !== "null");
  };
  