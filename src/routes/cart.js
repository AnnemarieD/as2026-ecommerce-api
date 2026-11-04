const express = require('express');
const { products, carts } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function getCartItems(userId) {
  const items = carts[userId] || [];
  return items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      name: product ? product.name : null,
      unitPrice: product ? product.price : null,
      quantity: item.quantity,
      lineTotal: product ? product.price * item.quantity : null,
    };
  });
}

function cartTotal(userId) {
  return getCartItems(userId).reduce(
    (sum, item) => sum + (item.lineTotal || 0),
    0
  );
}

router.get('/cart', requireAuth, (req, res) => {
  const userId = req.user.id;
  if (!carts[userId]) {
    carts[userId] = [];
  }

  const items = getCartItems(userId);
  return res.status(200).json({
    items,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: cartTotal(userId),
  });
});

router.post('/cart', requireAuth, (req, res) => {
  const { productId, quantity } = req.body || {};
  const userId = req.user.id;

  if (!productId || quantity === undefined || quantity === null) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'productId and quantity are required',
    });
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'quantity must be a positive integer',
    });
  }

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Product ${productId} not found`,
    });
  }

  if (!carts[userId]) {
    carts[userId] = [];
  }

  const existing = carts[userId].find((i) => i.productId === productId);
  if (existing) {
    existing.quantity += qty;
  } else {
    carts[userId].push({ productId, quantity: qty });
  }

  const items = getCartItems(userId);
  return res.status(200).json({
    message: 'Item added to cart',
    items,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    subtotal: cartTotal(userId),
  });
});

module.exports = router;
