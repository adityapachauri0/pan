const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'panchroma_jwt_secret_key_2024';

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || 
                  req.cookies?.token ||
                  req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Token is valid but user not found.' 
        });
      }

      if (!user.isActive) {
        return res.status(401).json({ 
          success: false, 
          message: 'Account is deactivated.' 
        });
      }

      if (user.isLocked) {
        return res.status(423).json({ 
          success: false, 
          message: 'Account is temporarily locked due to failed login attempts.' 
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid.' 
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication.' 
    });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Admin privileges required.' 
    });
  }
};

const managerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
    next();
  } else {
    res.status(403).json({ 
      success: false, 
      message: 'Access denied. Manager or Admin privileges required.' 
    });
  }
};

const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

module.exports = {
  authMiddleware,
  adminOnly,
  managerOrAdmin,
  generateToken
};