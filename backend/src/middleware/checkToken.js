// middleware/checkToken.js
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;

const checkToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token

  if (!token) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  try {
    // Verify the token with your JWT secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user information to the request object for later use
    req.user = decoded; 
    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    console.error('Invalid token:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = checkToken;
