const express = require('express');
const path = require('path');
var cors = require('cors');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

API_SERVICE_URL = 'https://rickandmortyapi.com';

app.use("/docs", express.static(path.resolve(__dirname, 'docs')));
app.use(require('./src/controllers'));


const escapeRegExp = string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Proxy to map API through localhost
app.use('/api', createProxyMiddleware({
  target: API_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
      [`^/api`]: '/api',
  },
  selfHandleResponse: true,
  // this is to manipulate responses so links ger routed through proxy
  onProxyRes: responseInterceptor(async (responseBuffer, proxyRes, req, res) => {
    // detect json responses
    if (proxyRes.headers['content-type'].includes('application/json')) {
      const data = responseBuffer.toString('utf8');
      const manipulatedData = data.replace(new RegExp(escapeRegExp(API_SERVICE_URL), 'gi'), 'http://localhost:3000');
      return manipulatedData
    }
    // return other content-types as-is
    return responseBuffer;
  }),
}));

app.listen(4000, (err) => {
  if (err) throw err
  console.log('Server running in http://localhost:4000')
});