/**
 * In-memory database. All data resets when the process restarts.
 */

const users = [
  {
    id: 'user-1',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'alice123',
  },
  {
    id: 'user-2',
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'bob123',
  },
  {
    id: 'user-3',
    name: 'Carol Davis',
    email: 'carol@example.com',
    password: 'carol123',
  },
];

const products = [
  {
    id: 'prod-1',
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones',
    price: 100.0,
  },
  {
    id: 'prod-2',
    name: 'USB-C Hub',
    description: '7-in-1 multiport adapter',
    price: 50.0,
  },
  {
    id: 'prod-3',
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard',
    price: 120.0,
  },
];

/** @type {Record<string, Array<{ productId: string, quantity: number }>>} */
const carts = {};

/** @type {Array<{ token: string, userId: string }>} */
const sessions = [];

/** @type {Array<object>} */
const orders = [];

module.exports = {
  users,
  products,
  carts,
  sessions,
  orders,
};
