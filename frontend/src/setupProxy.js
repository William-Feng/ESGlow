const { createProxyMiddleware } = require('http-proxy-middleware');

const target = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

module.exports = function (app) {
  app.use(
    '/api', // Specify the route you want to proxy
    createProxyMiddleware({
      target: target,// Specify your backend server
      changeOrigin: true,
    })
  );
};
