const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const gatewayRoutes = require('./routes/gateway.routes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));

// Health check
app.get('/health', (_, res) => {
  res.status(200).json({ service: 'api-gateway', status: 'ok' });
});

// Proxy routes mapped under /api
app.use('/api', gatewayRoutes);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found on API Gateway' });
});

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
