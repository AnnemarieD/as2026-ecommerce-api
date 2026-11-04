const express = require('express');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const swaggerPath = path.join(__dirname, '..', 'swagger.yaml');
const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, 'utf8'));

app.get('/swagger.yaml', (_req, res) => {
  res.type('text/yaml').send(fs.readFileSync(swaggerPath, 'utf8'));
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (_req, res) => {
  res.json({
    name: 'as2026-ecommerce-api',
    description: 'E-commerce REST API for checkout',
    docs: '/api-docs',
    spec: '/swagger.yaml',
    endpoints: ['/register', '/login', '/cart', '/checkout'],
  });
});

app.use(authRoutes);
app.use(cartRoutes);
app.use(checkoutRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`E-commerce API listening on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
  console.log(`OpenAPI YAML: http://localhost:${PORT}/swagger.yaml`);
});
