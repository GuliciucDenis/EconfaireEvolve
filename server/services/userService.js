const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const registerUser = async ({ firstName, lastName, email, password, role }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, lastName, email, password: hashedPassword, role });
    return user.save(); // Saves the user to the `users` collection
};

const authenticateUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: '1h' });
    return token;
};

const getAllUsers = async () => {
    return User.find();
}

const getUserById = async (id) => {
    return User.findById(id);
}

const deleteUserById = async (id) => {
    return User.findByIdAndDelete(id);
}

const updateUserById = async (id, { firstName, lastName, email, password, role }) => {
    const user = await User.findById(id);
    if (!user) {
        throw new Error('User not found');
    }

    user.firstName = firstName? firstName : user.firstName;
    user.lastName = lastName? lastName : user.lastName;
    user.role = role? role : user.role;
    user.email = email? email : user.email;
    user.password = password? await bcrypt.hash(password, 10) : user.password;

    return user.save();
}

module.exports = { registerUser, authenticateUser, getAllUsers, getUserById, deleteUserById, updateUserById};
