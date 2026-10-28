import axios from 'axios';

// Same-origin '/api' works both with the Vite dev proxy and when Express serves the built app.
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

export const getTasks = (status = 'all') =>
  api.get('/tasks', { params: { status } }).then((r) => r.data);
export const getStats = () => api.get('/tasks/stats').then((r) => r.data);
export const createTask = (data) => api.post('/tasks', data).then((r) => r.data);
export const updateTask = (id, data) => api.put(`/tasks/${id}`, data).then((r) => r.data);
export const toggleTask = (id) => api.patch(`/tasks/${id}/toggle`).then((r) => r.data);
export const deleteTask = (id) => api.delete(`/tasks/${id}`).then((r) => r.data);

// Turn an Axios error into a message a person can read.
export const errorMessage = (err) => {
  if (err.response?.data?.message) return err.response.data.message;
  if (err.request) return 'Cannot reach the server. Make sure the backend is running.';
  return 'Something went wrong.';
};
