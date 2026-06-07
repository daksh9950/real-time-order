const Order = require('../models/order.model');
const { publishOrderChange } = require('./redis.service');
const logger = require('../utils/logger');

const startChangeStream = () => {
  const pipeline = [
    {
      $match: {
        operationType: { $in: ['insert', 'update', 'delete'] },
      },
    },
  ];

  const changeStream = Order.watch(pipeline, {
    fullDocument: 'updateLookup',
  });

  changeStream.on('change', async (change) => {
    try {
      const payload = {
        operation: change.operationType.toUpperCase(),
        record:
          change.fullDocument || { _id: change.documentKey._id },
        timestamp: new Date().toISOString(),
      };

      logger.info(
        `Change detected: ${payload.operation} on order ${payload.record._id}`
      );

      await publishOrderChange(payload);
    } catch (err) {
      logger.error(`Change stream handler error: ${err.message}`);
    }
  });

  changeStream.on('error', (err) => {
    logger.error(
      `Change stream error: ${err.message} — restarting in 5s`
    );
    setTimeout(startChangeStream, 5000);
  });

  logger.info('MongoDB Change Stream started');
};

module.exports = { startChangeStream };
