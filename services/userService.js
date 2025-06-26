const db = require('../models/db');
const bcrypt = require('bcryptjs');

exports.listUsers = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};

exports.addUser = async (data) => {
    const { name, email, mobileCountryCode, mobile, password, roleId } = data;
    if (!password) throw new Error('Password is required');
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO user (name, email, mobileCountryCode, mobile, password, roleId) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [name, email, mobileCountryCode, mobile, hashedPassword, roleId], (err, result) => {
            if (err) return reject(err);
            resolve(result.insertId);
        });
    });
};

exports.updateUser = async (userId, data) => {
    const { name, email, mobileCountryCode, mobile, password, roleId } = data;
    let fields = [];
    let values = [];

    if (name !== undefined) {
        fields.push('name=?');
        values.push(name);
    }
    if (email !== undefined) {
        fields.push('email=?');
        values.push(email);
    }
    if (mobileCountryCode !== undefined) {
        fields.push('mobileCountryCode=?');
        values.push(mobileCountryCode);
    }
    if (mobile !== undefined) {
        fields.push('mobile=?');
        values.push(mobile);
    }
    if (roleId !== undefined) {
        fields.push('roleId=?');
        values.push(roleId);
    }
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        fields.push('password=?');
        values.push(hashedPassword);
    }

    if (fields.length === 0) {
        throw new Error('No fields to update');
    }

    values.push(userId);

    return new Promise((resolve, reject) => {
        const sql = `UPDATE user SET ${fields.join(', ')} WHERE id=?`;
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

exports.getUserDetail = (userId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE id = ?', [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

// Delete user by ID
exports.deleteUser = (userId) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM user WHERE id = ?', [userId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};