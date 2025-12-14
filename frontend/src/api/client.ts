import axios from 'axios';


// Create a configured Axios instance
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attaches the JWT token to every request
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Optional global error handling (e.g., auto-logout on 401)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    // You could handle 401 Unauthorized errors here
    return Promise.reject(error);
  }
);

export default client;