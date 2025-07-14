const db = require('../models/db');
const bcrypt = require('bcryptjs');

/* =========================================================================
   ✅ Paginated + Searchable List of Users
   ========================================================================= */
exports.listUsers = ({ page = 1, limit = 10, search = '' }) => {
    const offset = (page - 1) * limit;
    const keyword = `%${search}%`;

    const baseSql = `FROM user WHERE name LIKE ? OR email LIKE ? OR mobile LIKE ?`;

    const dataSql = `SELECT * ${baseSql} ORDER BY id DESC LIMIT ? OFFSET ?`;
    const countSql = `SELECT COUNT(*) as total ${baseSql}`;

    const params = [keyword, keyword, keyword];
    const paginatedParams = [...params, Number(limit), Number(offset)];

    return new Promise((resolve, reject) => {
        db.query(dataSql, paginatedParams, (err, rows) => {
            if (err) return reject(err);

            db.query(countSql, params, (countErr, countResult) => {
                if (countErr) return reject(countErr);

                resolve({
                    rows,
                    total: countResult[0].total,
                    page: Number(page),
                    limit: Number(limit),
                });
            });
        });
    });
};

/* =========================================================================
   Add New User
   ========================================================================= */
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

/* =========================================================================
   Update User Fields
   ========================================================================= */
exports.updateUser = async (userId, data) => {
    const { name, email, mobileCountryCode, mobile, password, roleId } = data;
    let fields = [];
    let values = [];

    if (name !== undefined) fields.push('name=?'), values.push(name);
    if (email !== undefined) fields.push('email=?'), values.push(email);
    if (mobileCountryCode !== undefined) fields.push('mobileCountryCode=?'), values.push(mobileCountryCode);
    if (mobile !== undefined) fields.push('mobile=?'), values.push(mobile);
    if (roleId !== undefined) fields.push('roleId=?'), values.push(roleId);
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        fields.push('password=?');
        values.push(hashedPassword);
    }

    if (fields.length === 0) throw new Error('No fields to update');

    values.push(userId);

    return new Promise((resolve, reject) => {
        const sql = `UPDATE user SET ${fields.join(', ')} WHERE id=?`;
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/* =========================================================================
   Get Single User Detail by ID
   ========================================================================= */
exports.getUserDetail = (userId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE id = ?', [userId], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

/* =========================================================================
   Delete User by ID
   ========================================================================= */
exports.deleteUser = (userId) => {
    return new Promise((resolve, reject) => {
        db.query('DELETE FROM user WHERE id = ?', [userId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/* =========================================================================
   Reset User Password by ID
   ========================================================================= */
exports.resetPassword = async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    return new Promise((resolve, reject) => {
        const sql = 'UPDATE user SET password = ? WHERE id = ?';
        db.query(sql, [hashedPassword, userId], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};
