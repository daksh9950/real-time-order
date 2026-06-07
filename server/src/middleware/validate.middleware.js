const Joi = require('joi');

const orderSchema = Joi.object({
  customer_name: Joi.string().min(2).max(50).required(),
  product_name: Joi.string().min(2).max(100).required(),
  status: Joi.string().valid('pending', 'shipped', 'delivered'),
});

const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'shipped', 'delivered')
    .required(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ success: false, message: error.details[0].message });
  }
  next();
};

module.exports = { validate, orderSchema, updateStatusSchema };
