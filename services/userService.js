// services/userService.js
const db     = require('../models/db');
const bcrypt = require('bcryptjs');

/* =========================================================================
   Paginated + searchable list of users   (called by POST /user/filter)
   ========================================================================= */
exports.listUsers = ({ page = 1, limit = 10, search = '' }) => {
  const offset   = (page - 1) * limit;
  const keyword  = `%${search}%`;

  const baseSql  = 'FROM user WHERE name LIKE ? OR email LIKE ? OR mobile LIKE ?';
  const dataSql  = `SELECT * ${baseSql} ORDER BY id DESC LIMIT ? OFFSET ?`;
  const countSql = `SELECT COUNT(*) AS total ${baseSql}`;

  const where    = [keyword, keyword, keyword];
  const params   = [...where, Number(limit), Number(offset)];

  return new Promise((resolve, reject) => {
    db.query(dataSql, params, (err, rows) => {
      if (err) return reject(err);

      db.query(countSql, where, (cErr, cRes) => {
        if (cErr) return reject(cErr);

        resolve({
          rows,
          total : cRes[0].total,
          page  : Number(page),
          limit : Number(limit),
        });
      });
    });
  });
};

/* =========================================================================
   Add new user
   ========================================================================= */
exports.addUser = async ({ name, email, mobileCountryCode, mobile, password, roleId }) => {
  if (!password) throw new Error('Password is required');
  const hashed = await bcrypt.hash(password, 10);

  const sql = `
    INSERT INTO user (name, email, mobileCountryCode, mobile, password, roleId)
    VALUES (?,?,?,?,?,?)
  `;

  return new Promise((resolve, reject) => {
    db.query(sql, [name, email, mobileCountryCode, mobile, hashed, roleId], (err, res) => {
      if (err) return reject(err);
      resolve(res.insertId);
    });
  });
};

/* =========================================================================
   Update user fields (PUT /user/:id)
   ========================================================================= */
exports.updateUser = async (id, data) => {
  const { name, email, mobileCountryCode, mobile, password, roleId } = data;
  const fields = [];
  const values = [];

  if (name  !== undefined) fields.push('name=?'),               values.push(name);
  if (email !== undefined) fields.push('email=?'),              values.push(email);
  if (mobileCountryCode !== undefined) fields.push('mobileCountryCode=?'), values.push(mobileCountryCode);
  if (mobile !== undefined) fields.push('mobile=?'),            values.push(mobile);
  if (roleId !== undefined) fields.push('roleId=?'),            values.push(roleId);
  if (password) {
    const hashed = await bcrypt.hash(password, 10);
    fields.push('password=?');
    values.push(hashed);
  }

  if (!fields.length) throw new Error('No fields to update');

  values.push(id);
  const sql = `UPDATE user SET ${fields.join(', ')} WHERE id=?`;

  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

/* =========================================================================
   Get single user detail   (called by POST /user/detail)
   ========================================================================= */
exports.getUserDetail = ({ id }) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM user WHERE id = ?', [id], (err, res) => {
      if (err) return reject(err);
      resolve(res[0]);
    });
  });
};

/* =========================================================================
   Delete user (admin only)
   ========================================================================= */
exports.deleteUser = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM user WHERE id = ?', [id], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};

/* =========================================================================
   Reset user password (admin only)
   ========================================================================= */
exports.resetPassword = async (id, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  return new Promise((resolve, reject) => {
    db.query('UPDATE user SET password = ? WHERE id = ?', [hashed, id], (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
};
