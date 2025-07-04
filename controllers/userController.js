const userService = require('../services/userService');

// List all users
exports.listUsers = async (req, res) => {
    try {
        const users = await userService.listUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ err });
    }
};

// Add a new user
exports.addUser = async (req, res) => {
    try {
        const id = await userService.addUser(req.body);
        res.json({ message: 'User added successfully', id });
    } catch (err) {
        res.status(500).json({ err: err.message || err });
    }
};

// Update user info
exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    try {
        await userService.updateUser(userId, req.body);
        res.json({ message: 'User updated successfully' });
    } catch (err) {
        if (err.message === 'No fields to update') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ err: err.message || err });
    }
};

// Get single user detail
exports.getUserDetail = async (req, res) => {
    try {
        const user = await userService.getUserDetail(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ err });
    }
};

// Delete user by ID (admin only)
exports.deleteUser = async (req, res) => {
    try {
        if (!req.user || req.user.roleId !== 1) {
            return res.status(403).json({ message: 'Only admin can delete users' });
        }
        const userId = req.params.id;
        const result = await userService.deleteUser(userId);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ err: err.message || err });
    }
};

// ✅ Reset user password by ID (admin only)
exports.resetPassword = async (req, res) => {
    try {
        if (!req.user || req.user.roleId !== 1) {
            return res.status(403).json({ message: 'Only admin can reset passwords' });
        }

        const userId = req.params.id;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        await userService.resetPassword(userId, newPassword);

        res.json({ message: 'Password reset successfully' });
    } catch (err) {
        res.status(500).json({ err: err.message || err });
    }
};
