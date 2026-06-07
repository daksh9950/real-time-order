const router = require('express').Router();
const {
  getOrders,
  createOrder,
  updateStatus,
  deleteOrder,
} = require('../controllers/order.controller');
const {
  validate,
  orderSchema,
  updateStatusSchema,
} = require('../middleware/validate.middleware');

router.get('/', getOrders);
router.post('/', validate(orderSchema), createOrder);
router.patch('/:id', validate(updateStatusSchema), updateStatus);
router.delete('/:id', deleteOrder);

module.exports = router;
