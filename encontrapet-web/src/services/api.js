import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    const isRotaPublica = config.url.includes('/auth/login') || config.url.includes('/usuarios');

    if (token && !isRotaPublica) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;