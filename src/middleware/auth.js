const { sessions, users } = require('../db');

function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid Authorization header. Use: Bearer <token>',
    });
  }

  const token = header.slice('Bearer '.length).trim();
  const session = sessions.find((s) => s.token === token);

  if (!session) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
  }

  const user = users.find((u) => u.id === session.userId);
  if (!user) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'User not found for this session',
    });
  }

  req.user = user;
  req.token = token;
  return next();
}

module.exports = { requireAuth };
