const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const errorHandler = require('./middleware/error.middleware');
const orderRoutes = require('./routes/order.routes');

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) =>
  res.json({ status: 'ok', uptime: process.uptime() })
);

app.use('/api/orders', orderRoutes);
app.use(errorHandler);

module.exports = { app, httpServer, io };
