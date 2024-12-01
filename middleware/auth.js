// auth.js (middleware)

import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT tokens
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        const message = err.name === 'TokenExpiredError'
          ? 'Unauthorized: Token has expired'
          : 'Unauthorized: Invalid token';
        return res.status(403).json({ message });
      }

      req.user = decoded;
      next();
    });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export default verifyToken;