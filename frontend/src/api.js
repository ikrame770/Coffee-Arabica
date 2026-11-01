import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

export const getProducts = () => API.get('/products');
export const getAvailableProducts = () => API.get('/products/available');
export const createProduct = (data) => API.post('/products', data);
export const updateProduct = (id, data) => API.put(`/products/${id}`, data);
export const deleteProduct = (id) => API.delete(`/products/${id}`);

export const getOrders = () => API.get('/orders');
export const createOrder = (data) => API.post('/orders', data);
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, status);