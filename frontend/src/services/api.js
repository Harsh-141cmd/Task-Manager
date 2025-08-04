import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) =>
    api.post('/auth/signin', { email, password }),
  
  register: (name, email, password) =>
    api.post('/auth/signup', { name, email, password }),
};

// Tasks API
export const tasksAPI = {
  getTasks: (status = '', sortByDueDate = false) =>
    api.get('/tasks', { params: { status, sortByDueDate } }),
  
  getTask: (id) =>
    api.get(`/tasks/${id}`),
  
  createTask: (task) =>
    api.post('/tasks', task),
  
  updateTask: (id, task) =>
    api.put(`/tasks/${id}`, task),
  
  deleteTask: (id) =>
    api.delete(`/tasks/${id}`),
  
  markAsCompleted: (id) =>
    api.put(`/tasks/${id}/complete`),
};

export default api;
