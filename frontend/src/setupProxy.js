const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Specify the route you want to proxy
    createProxyMiddleware({
      target: 'http://127.0.0.1:5000', // Specify your backend server
      changeOrigin: true,
    })
  );
};
