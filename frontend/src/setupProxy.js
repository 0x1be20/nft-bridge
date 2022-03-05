const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/collections', { target: 'http://localhost:7001/' ,changeOrigin:true}));
  app.use(createProxyMiddleware("/api",{ target: 'http://localhost:7001/' ,changeOrigin:true}))
};