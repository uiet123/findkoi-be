const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const KOI_SERVICE_URL = process.env.KOI_SERVICE_URL || 'http://localhost:3002';

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (_, res) => {
  res.status(200).json({ service: 'api-gateway', status: 'ok' });
});

app.use(
  '/api/auth',
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/auth': '/auth' }
  })
);

app.use(
  '/api/koi',
  createProxyMiddleware({
    target: KOI_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/api/koi': '/koi' }
  })
);

app.use((_, res) => {
  res.status(404).json({ message: 'Route not found on API Gateway' });
});

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
