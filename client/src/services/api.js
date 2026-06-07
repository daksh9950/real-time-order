import axios from 'axios';

const api = axios.create({
  baseURL: 'https://real-time-order-777r.onrender.com/api',
});

export const fetchOrders = () =>
  api.get('/orders').then((res) => res.data.data);

export const createOrder = (data) =>
  api.post('/orders', data).then((res) => res.data.data);

export const updateOrderStatus = (id, status) =>
  api.patch(`/orders/${id}`, { status }).then((res) => res.data.data);

export const deleteOrder = (id) =>
  api.delete(`/orders/${id}`).then((res) => res.data);
