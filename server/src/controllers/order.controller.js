const orderService = require('../services/order.service');

const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

const createOrder = async (req, res, next) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const order = await orderService.updateOrderStatus(
      req.params.id,
      req.body.status
    );
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const order = await orderService.deleteOrder(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, message: 'Order deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders, createOrder, updateStatus, deleteOrder };
