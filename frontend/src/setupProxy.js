const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(createProxyMiddleware('/collections', { target: 'http://nftdemoapi.pingolab.com/' ,changeOrigin:true}));
  app.use(createProxyMiddleware("/api",{ target: 'http://nftdemoapi.pingolab.com/' ,changeOrigin:true}))
};