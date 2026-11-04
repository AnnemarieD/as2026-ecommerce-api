const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { users, sessions, carts } = require('../db');

const router = express.Router();

router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'name, email, and password are required',
    });
  }

  const existing = users.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase()
  );
  if (existing) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'A user with this email already exists',
    });
  }

  const user = {
    id: `user-${uuidv4()}`,
    name: String(name),
    email: String(email).toLowerCase(),
    password: String(password),
  };

  users.push(user);
  carts[user.id] = [];

  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'email and password are required',
    });
  }

  const user = users.find(
    (u) =>
      u.email.toLowerCase() === String(email).toLowerCase() &&
      u.password === String(password)
  );

  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid email or password',
    });
  }

  const token = uuidv4();
  sessions.push({ token, userId: user.id });

  if (!carts[user.id]) {
    carts[user.id] = [];
  }

  return res.status(200).json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
});

module.exports = router;
