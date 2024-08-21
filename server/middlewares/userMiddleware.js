const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/userModel');

const verifyProfileAccess = async (req, res, next) => {
    const { id } = req.params;
    if (req.user.role === 'admin' || req.user.id === id) {
        return next();
    }
    res.status(403).json({ error: 'Access denied, admin or user only' });
}

const verifyUpdateAccess = async (req, res, next) => {
    const { role } = req.user;  // Assuming the authenticated user's role is available in req.user
    const allowedFieldsForEmployee = ['email', 'password'];
    
    if (role !== 'admin') {
        // Filter the fields based on allowedFieldsForEmployee
        const updateData = req.body;
        const fieldsToUpdate = Object.keys(updateData);

        for (let field of fieldsToUpdate) {
            if (!allowedFieldsForEmployee.includes(field)) {
                return res.status(403).json({ error: 'You are not authorized to update this field.' });
            }
        }
    }
    next();
}

module.exports = { verifyProfileAccess, verifyUpdateAccess };