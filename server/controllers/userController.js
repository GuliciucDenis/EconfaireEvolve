const userService = require('../services/userService');

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
        console.log(req);
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


module.exports = {getAllUsers, getUserById, deleteUserById, updateUserById};
