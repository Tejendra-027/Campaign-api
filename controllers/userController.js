// controllers/userController.js
const userService = require('../services/userService');

/* ------------------------------------------------------------------ */
/* 1. List users – POST /user/filter                                  */
/* ------------------------------------------------------------------ */
exports.listUsers = async (req, res) => {
  try {
    // moved from req.query ➜ req.body
    const { page = 1, limit = 10, search = '' } = req.body;

    // userService.listUsers should return { rows, total, page, limit }
    const result = await userService.listUsers({ page, limit, search });

    return res.json({
      success: true,
      data: result           // { rows, total, page, limit }
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || err });
  }
};

/* ------------------------------------------------------------------ */
/* 2. Add user                                                        */
/* ------------------------------------------------------------------ */
exports.addUser = async (req, res) => {
  try {
    const id = await userService.addUser(req.body);
    return res.status(201).json({ message: 'User added', id });
  } catch (err) {
    return res.status(500).json({ error: err.message || err });
  }
};

/* ------------------------------------------------------------------ */
/* 3. Update user info (PUT /user/:id)                                */
/* ------------------------------------------------------------------ */
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userService.updateUser(userId, req.body);
    return res.json({ message: 'User updated' });
  } catch (err) {
    if (err.message === 'No fields to update') {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ error: err.message || err });
  }
};

/* ------------------------------------------------------------------ */
/* 4. Get single user detail – POST /user/detail                      */
/* ------------------------------------------------------------------ */
exports.getUserDetail = async (req, res) => {
  try {
    const { id } = req.body;             // was req.params.id
    if (!id) return res.status(400).json({ message: 'User ID is required' });

    const user = await userService.getUserDetail(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message || err });
  }
};

/* ------------------------------------------------------------------ */
/* 5. Delete user by ID (admin only)                                  */
/* ------------------------------------------------------------------ */
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
    return res.json({ message: 'User deleted' });
  } catch (err) {
    return res.status(500).json({ error: err.message || err });
  }
};

/* ------------------------------------------------------------------ */
/* 6. Reset password (admin only)                                     */
/* ------------------------------------------------------------------ */
exports.resetPassword = async (req, res) => {
  try {
    if (!req.user || req.user.roleId !== 1) {
      return res.status(403).json({ message: 'Only admin can reset passwords' });
    }

    const userId     = req.params.id;
    const { newPassword } = req.body;
    if (!newPassword) {
      return res.status(400).json({ message: 'New password is required' });
    }

    await userService.resetPassword(userId, newPassword);
    return res.json({ message: 'Password reset' });
  } catch (err) {
    return res.status(500).json({ error: err.message || err });
  }
};
