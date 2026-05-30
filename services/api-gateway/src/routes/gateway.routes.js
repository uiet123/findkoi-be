const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const router = express.Router();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://127.0.0.1:3001';
const KOI_SERVICE_URL = process.env.KOI_SERVICE_URL || 'http://127.0.0.1:3002';

router.use(
  '/auth',
  createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/': '/auth/' }
  })
);

router.use(
  '/koi',
  createProxyMiddleware({
    target: KOI_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/': '/koi/' }
  })
);

module.exports = router;
