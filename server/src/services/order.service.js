const Order = require('../models/order.model');

const getAllOrders = () => Order.find().sort({ updated_at: -1 });

const createOrder = (data) => Order.create(data);

const updateOrderStatus = (id, status) =>
  Order.findByIdAndUpdate(id, { status }, { new: true });

const deleteOrder = (id) => Order.findByIdAndDelete(id);

module.exports = { getAllOrders, createOrder, updateOrderStatus, deleteOrder };
