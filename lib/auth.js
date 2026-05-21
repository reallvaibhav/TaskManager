const jwt = require('jsonwebtoken');

module.exports = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    res.status(401).json({ message: 'Access denied. No token provided.' });
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // { id, name, email }
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
    return null;
  }
};
