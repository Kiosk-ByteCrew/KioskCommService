const express = require('express');
const morgan = require('morgan');
const ordersRouter = require('./routes/orders');
const usersRouter = require('./routes/users');
const logger = require('./utils/logger');

const app = express();
const apiRouter = express.Router();

// Middleware
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));

// Routes
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/users', usersRouter);

// Health Check Endpoint
app.get('/health', (req, res) => {
  logger.info('Health check endpoint hit');
  res.status(200).json({ status: 'KioskCommService is up and running!' });
});

// Mount apiRouter under /kiosk-comm/api
app.use('/kiosk-comm/api', apiRouter);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;