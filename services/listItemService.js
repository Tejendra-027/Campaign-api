const db = require('../models/db');
const fs = require('fs');
const csv = require('csv-parser');

// 📄 List all list items with pagination/filter
exports.filterListItems = ({ page = 1, limit = 10, search = '', listId }) => {
  const offset = (page - 1) * limit;
  let sql = 'SELECT * FROM list_item WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (email LIKE ? OR name LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (listId) {
    sql += ' AND listId = ?';
    params.push(listId);
  }

  sql += ' LIMIT ? OFFSET ?';
  params.push(Number(limit), Number(offset));

  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

// ➕ Add a new list item
exports.addListItem = ({ listId, email, name, variables }) => {
  return new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO list_item (listId, email, name, variables) VALUES (?, ?, ?, ?)',
      [listId, email, name, JSON.stringify(variables)],
      (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId);
      }
    );
  });
};

// ✏️ Update list item by ID
exports.updateListItem = (id, { listId, email, name, variables }) => {
  const fields = [];
  const values = [];

  if (listId !== undefined) {
    fields.push('listId=?');
    values.push(listId);
  }
  if (email !== undefined) {
    fields.push('email=?');
    values.push(email);
  }
  if (name !== undefined) {
    fields.push('name=?');
    values.push(name);
  }
  if (variables !== undefined) {
    fields.push('variables=?');
    values.push(JSON.stringify(variables));
  }

  if (fields.length === 0) {
    return Promise.reject(new Error('No fields to update'));
  }

  values.push(id);
  const sql = `UPDATE list_item SET ${fields.join(', ')} WHERE id=?`;

  return new Promise((resolve, reject) => {
    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

// 🔍 Get list item detail by ID
exports.getListItemDetail = (id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM list_item WHERE id = ?', [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

// 📤 Upload CSV and insert list items in bulk
exports.uploadCsv = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file uploaded'));

    const results = [];

    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (row) => {
        const name = row.Name || row.name;
        const email = row.Email || row.email;
        const listId = row.listId || row.ListId || 1;

        if (!name || !email) return; // skip invalid row

        // Dynamically collect extra fields into variables
        const variables = {};
        for (const key in row) {
          if (!['name', 'Name', 'email', 'Email', 'listId', 'ListId'].includes(key)) {
            variables[key] = row[key];
          }
        }

        results.push([
          listId,
          email,
          name,
          Object.keys(variables).length ? JSON.stringify(variables) : null
        ]);
      })
      .on('end', () => {
        if (results.length === 0) return resolve({ inserted: 0 });

        db.query(
          'INSERT INTO list_item (listId, email, name, variables) VALUES ?',
          [results],
          (err, result) => {
            if (err) return reject(err);
            resolve({ inserted: result.affectedRows });
          }
        );
      })
      .on('error', (err) => reject(err));
  });
};

// 🗑️ Delete list item by ID
exports.deleteListItem = (id) => {
  return new Promise((resolve, reject) => {
    db.query('DELETE FROM list_item WHERE id = ?', [id], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows > 0);
    });
  });
};
