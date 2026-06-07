const { createAdapter } = require('@socket.io/redis-adapter');
const logger = require('../utils/logger');

const initSocket = (io, pubClient, subClient) => {
  if (pubClient && !pubClient.isMock) {
    io.adapter(createAdapter(pubClient, subClient));
    logger.info('Socket.io Redis adapter initialized');
  } else {
    logger.info('Socket.io running in local/standalone mode (no Redis adapter)');
  }

  subClient.subscribe('order_changes', (message) => {
    try {
      const payload = JSON.parse(message);
      io.emit('order_update', payload);
      logger.info(
        `Broadcasted to ${io.engine.clientsCount} client(s)`
      );
    } catch (err) {
      logger.error(`Socket broadcast error: ${err.message}`);
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);
    socket.on('disconnect', () =>
      logger.info(`Client disconnected: ${socket.id}`)
    );
  });

  logger.info('Socket.io initialized');
};

module.exports = { initSocket };
