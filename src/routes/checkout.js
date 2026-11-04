const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { products, carts, orders } = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const CASH_DISCOUNT_RATE = 0.1;
const VALID_PAYMENT_METHODS = ['cash', 'credit_card'];

router.post('/checkout', requireAuth, (req, res) => {
  const { paymentMethod } = req.body || {};
  const userId = req.user.id;

  if (!paymentMethod) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'paymentMethod is required (cash | credit_card)',
    });
  }

  const method = String(paymentMethod).toLowerCase();
  if (!VALID_PAYMENT_METHODS.includes(method)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'paymentMethod must be cash or credit_card',
    });
  }

  const cart = carts[userId] || [];
  if (cart.length === 0) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Cart is empty. Add products before checkout.',
    });
  }

  const items = cart.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    return {
      productId: item.productId,
      name: product.name,
      unitPrice: product.price,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
    };
  });

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const discountRate = method === 'cash' ? CASH_DISCOUNT_RATE : 0;
  const discountAmount = Number((subtotal * discountRate).toFixed(2));
  const total = Number((subtotal - discountAmount).toFixed(2));

  const order = {
    id: `order-${uuidv4()}`,
    userId,
    items,
    paymentMethod: method,
    subtotal: Number(subtotal.toFixed(2)),
    discountRate,
    discountAmount,
    total,
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  carts[userId] = [];

  return res.status(201).json({
    message:
      method === 'cash'
        ? 'Order placed successfully with 10% cash discount'
        : 'Order placed successfully (no discount for credit card)',
    order,
  });
});

module.exports = router;
