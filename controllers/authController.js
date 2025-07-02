const authService = require('../services/authService');

exports.login = async (req, res) => {
    try {
        const result = await authService.login(req.body);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message, error: err.error });
    }
};

exports.register = async (req, res) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message, error: err.error });
    }
};

// Delete user controller
exports.deleteUser = async (req, res) => {
    try {
        const result = await authService.deleteUser(req.params.id);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ message: err.message, error: err.error });
    }
};