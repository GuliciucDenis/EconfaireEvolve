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
    console.log('REQUEST BODY:', req.body);
    const allowedFieldsForEmployee = ['email', 'oldPassword', 'password'];
    console.log(allowedFieldsForEmployee);
    console.log(role);
    if (role !== 'admin') {
        // Filter the fields based on allowedFieldsForEmployee
        const updateData = req.body;
        const fieldsToUpdate = Object.keys(updateData)
        console.log(fieldsToUpdate);

        for (let field of fieldsToUpdate) {
            if (!allowedFieldsForEmployee.includes(field)) {
                return res.status(403).json({ error: 'You are not authorized to update this field.' });
            }
        }
    }
    next();
}

module.exports = { verifyProfileAccess, verifyUpdateAccess };