const { createClient } = require('redis');
const { EventEmitter } = require('events');
const logger = require('../utils/logger');

class MockRedisClient extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.isMock = true;
    this.pubsub = new EventEmitter();
    this.pubsub.setMaxListeners(100);
  }

  async connect() {
    logger.warn(`Redis [${this.name}] falling back to LOCAL IN-MEMORY MOCK client`);
    setTimeout(() => this.emit('connect'), 0);
    return this;
  }

  duplicate() {
    const dup = new MockRedisClient(this.name + '-duplicate');
    dup.pubsub = this.pubsub;
    return dup;
  }

  async publish(channel, message) {
    logger.info(`MockRedis [${this.name}] publish to [${channel}]: ${message}`);
    this.pubsub.emit(channel, message);
    return 1;
  }

  async subscribe(channel, callback) {
    logger.info(`MockRedis [${this.name}] subscribe to [${channel}]`);
    this.pubsub.on(channel, callback);
    return this;
  }

  async quit() {}
  async disconnect() {}
}

const createRedisClient = async (name) => {
  let client;
  
  if (!process.env.REDIS_HOST && !process.env.REDIS_URL) {
    logger.warn(`No Redis host or URL configured for [${name}]. Initializing Mock Redis client.`);
    const mock = new MockRedisClient(name);
    await mock.connect();
    return mock;
  }

  // Define reconnectStrategy that fails fast to support instant fallback
  const reconnectStrategy = (retries) => {
    return new Error('Fail connection immediately to fall back to mock');
  };

  try {
    if (process.env.REDIS_URL) {
      client = createClient({
        url: process.env.REDIS_URL,
        socket: { reconnectStrategy }
      });
    } else if (process.env.REDIS_TLS === 'true' || (process.env.REDIS_PORT && process.env.REDIS_PORT !== '6379')) {
      const url = `rediss://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;
      client = createClient({
        url,
        socket: { reconnectStrategy }
      });
    } else {
      client = createClient({
        socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT) || 6379,
          reconnectStrategy
        },
        password: process.env.REDIS_PASSWORD || undefined,
      });
    }

    client.on('error', (err) => {
      // Avoid spamming log on connection refusal / ENOTFOUND
      logger.debug(`Redis [${name}] socket error: ${err.message}`);
    });
    client.on('connect', () =>
      logger.info(`Redis [${name}] connected`)
    );

    await client.connect();
    return client;
  } catch (err) {
    logger.warn(`Failed to connect to Redis [${name}]: ${err.message}. Initializing Mock Redis client.`);
    if (client) {
      try {
        await client.disconnect();
      } catch (discErr) {
        // Ignore disconnect errors
      }
    }
    const mock = new MockRedisClient(name);
    await mock.connect();
    return mock;
  }
};

module.exports = createRedisClient;
