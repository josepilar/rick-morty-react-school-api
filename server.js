const express = require('express');
var cors = require('cors');
const { createProxyMiddleware, responseInterceptor } = require('http-proxy-middleware');
const DB = require("./db");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

API_SERVICE_URL = 'https://rickandmortyapi.com';

app.get('/api/lists', (req, res) => {
  return res.status(200).json(DB.lists.get());
});
app.get('/api/lists/:id', (req, res) => {
  try {
    return res.status(200).json(DB.lists.get(req.params.id));
  } catch (error) {
    console.error(error);
    return res.status(404).json({ message: error.message });
  }
});
app.delete('/api/lists/:id', (req, res) => {
  try {
    return res.status(200).json(DB.lists.delete(req.params.id));
  } catch (error) {
    return res.status(404).json({ message: error.message});
  }
});
app.post('/api/lists', (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ message: 'Can not create list. \'name\' is required.'})
  }
  return res.status(200).json(DB.lists.post(req.body.name));
});
app.put('/api/lists/:id', (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: '\'name\' is required.'});
  }
  try {
    return res.status(200).json(DB.lists.put(req.params.id, name));
  } catch (error) {
    res.status(404).json({ message: `Can not update list. ${error.message}`})
  }
});
app.get('/api/lists/:id/items/:itemId', (req, res) => {
  try {
    return res.status(200).json(DB.items.get(req.params.id, req.params.itemId));
  } catch (error) {
    return res.status(404).json({ message: error.message});
  }
});
app.get('/api/lists/:id/items', (req, res) => {
  try {
    return res.status(200).json(DB.items.get(req.params.id));
  } catch (error) {
    return res.status(404).json({ message: error.message});
  }
});
app.post('/api/lists/:id/items', (req, res) => {
  const { itemId, type } = req.body;
  if (!itemId || !type) {
    return res.status(400).json({ message: 'missing property on item object'});
  }
  try {
    return res.status(200).json(DB.items.post(req.params.id, itemId, type));
  } catch (error) {
    return res.status(404).json({ message: `can not create. ${error.message}` });
  }
});
app.delete('/api/lists/:id/items/:itemId', (req, res) => {
  try {
    return res.status(200).json(DB.items.delete(req.params.id, req.params.itemId));
  } catch (error) {
    return res.status(404).json({ message: error.message});
  }
});


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

app.listen(3000, (err) => {
  if (err) throw err
  console.log('Server running in http://localhost:3000')
});