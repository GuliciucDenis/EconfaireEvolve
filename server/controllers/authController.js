const userService = require('../services/userService');

const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const user = await userService.registerUser({ firstName, lastName, email, password, role });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const token = await userService.authenticateUser({ email, password });
        res.status(200).json({ token });
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};

module.exports = { register, login };
