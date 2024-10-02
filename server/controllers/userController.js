const userService = require('../services/userService');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ message: 'All current users', users});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ message: 'User found', user});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteUserById = async (req, res) => {
    try {
        const user = await userService.deleteUserById(req.params.id);
        res.status(200).json({ message: 'User deleted', user});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateUserById = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const user = await userService.updateUserById(req.params.id ,{firstName, lastName, email, password, role });
        res.status(200).json({ message: 'User updated', user});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const validateOldPassword = async (req, res) => {
    try {
        const { oldPassword } = req.body;
        const user = await userService.getUserById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ isValid: false, message: 'Incorrect old password' });
        }

        res.status(200).json({ isValid: true });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};


module.exports = {getAllUsers, getUserById, deleteUserById, updateUserById, validateOldPassword};
