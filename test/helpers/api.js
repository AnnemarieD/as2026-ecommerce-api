require('dotenv').config();
const request = require('supertest');

const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

/**
 * Supertest agent bound to BASE_URL from .env
 */
function api() {
  return request(baseUrl);
}

/**
 * POST /login — returns the bearer token
 */
async function login(email, password) {
  const res = await api()
    .post('/login')
    .send({ email, password })
    .expect(200);

  return res.body.token;
}

/**
 * GET /cart — current cart for the authenticated user
 */
async function getCart(token) {
  return api()
    .get('/cart')
    .set('Authorization', `Bearer ${token}`);
}

/**
 * POST /cart — add a product for the authenticated user
 */
async function addToCart(token, productId, quantity) {
  return api()
    .post('/cart')
    .set('Authorization', `Bearer ${token}`)
    .send({ productId, quantity });
}

/**
 * POST /checkout — place an order (paymentMethod may be omitted)
 */
async function checkout(token, paymentMethod) {
  const req = api()
    .post('/checkout')
    .set('Authorization', `Bearer ${token}`);

  if (paymentMethod === undefined || paymentMethod === null) {
    return req.send({});
  }

  return req.send({ paymentMethod });
}

/**
 * Clear leftover cart items so discount assertions stay deterministic
 * across re-runs against the in-memory API.
 */
async function clearCart(token) {
  const cartRes = await getCart(token);
  expectStatus(cartRes, 200);
  if (cartRes.body.itemCount > 0) {
    const checkoutRes = await checkout(token, 'credit_card');
    expectStatus(checkoutRes, 201);
  }
}

function expectStatus(res, status) {
  if (res.status !== status) {
    throw new Error(`Expected status ${status}, got ${res.status}: ${JSON.stringify(res.body)}`);
  }
}

module.exports = {
  baseUrl,
  api,
  login,
  getCart,
  addToCart,
  checkout,
  clearCart,
};
