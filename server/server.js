require('dotenv').config();
const { httpServer, io } = require('./src/app');
const connectDB = require('./src/config/db');
const createRedisClient = require('./src/config/redis');
const { setPublisher } = require('./src/services/redis.service');
const { startChangeStream } = require('./src/services/changeStream.service');
const { initSocket } = require('./src/socket/socket.handler');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();

    const pubClient = await createRedisClient('publisher');
    const subClient = pubClient.duplicate();
    await subClient.connect();

    setPublisher(pubClient);

    initSocket(io, pubClient, subClient);

    startChangeStream();

    httpServer.listen(PORT, () =>
      logger.info(`Server running on port ${PORT}`)
    );
  } catch (err) {
    logger.error(`Startup failed: ${err.message}`);
    process.exit(1);
  }
};

start();
