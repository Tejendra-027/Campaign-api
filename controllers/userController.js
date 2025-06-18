const db = require('../models/db');
const bcrypt = require('bcryptjs');

exports.listUsers = (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) return res.status(500).json({ err });
        res.json(results);
    });
};

exports.addUser = async (req, res) => {
    const { name, email, mobileCountryCode, mobile, password, roleId } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO user (name, email, mobileCountryCode, mobile, password, roleId) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(sql, [name, email, mobileCountryCode, mobile, hashedPassword, roleId], (err, result) => {
        if (err) return res.status(500).json({ err });
        res.json({ message: 'User added successfully', id: result.insertId });
    });
};

exports.updateUser = async (req, res) => {
    const { name, email, mobileCountryCode, mobile, password, roleId } = req.body;
    const userId = req.params.id;

    // If password is provided, hash and update it; otherwise, don't update password
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'UPDATE user SET name=?, email=?, mobileCountryCode=?, mobile=?, password=?, roleId=? WHERE id=?';
        db.query(sql, [name, email, mobileCountryCode, mobile, hashedPassword, roleId, userId], (err, result) => {
            if (err) return res.status(500).json({ err });
            res.json({ message: 'User updated successfully' });
        });
    } else {
        const sql = 'UPDATE user SET name=?, email=?, mobileCountryCode=?, mobile=?, roleId=? WHERE id=?';
        db.query(sql, [name, email, mobileCountryCode, mobile, roleId, userId], (err, result) => {
            if (err) return res.status(500).json({ err });
            res.json({ message: 'User updated successfully' });
        });
    }
};

exports.getUserDetail = (req, res) => {
    db.query('SELECT * FROM user WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ err });
        if (results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.json(results[0]);
    });
};