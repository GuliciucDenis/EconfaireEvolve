const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/userModel');

// Middleware to authenticate and check if the user is an admin
const authenticate = (req, res, next) => {
    if (!req.header('Authorization')) {
        return res.status(401).json({ error: 'Access denied, no authorization header provided' });
    }
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

// Middleware to check if the user is an admin
const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied, admin only' });
    }
    next();
};

module.exports = { authenticate, adminOnly};
