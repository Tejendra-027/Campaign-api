const db = require('../models/db');
const fs = require('fs');
const csv = require('csv-parser');

// List all list items with pagination/filter
exports.filterListItems = ({ page = 1, limit = 10, search = '', listId }) => {
    const offset = (page - 1) * limit;
    let sql = 'SELECT * FROM list_item WHERE 1=1';
    let params = [];

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

// Add a new list item
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

// Update a list item by ID
exports.updateListItem = (id, { listId, email, name, variables }) => {
    let fields = [];
    let values = [];

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

    return new Promise((resolve, reject) => {
        const sql = `UPDATE list_item SET ${fields.join(', ')} WHERE id=?`;
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Get list item detail by ID
exports.getListItemDetail = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM list_item WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

// Upload CSV and insert list items in bulk
exports.uploadCsv = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) return reject(new Error('No file uploaded'));

        const results = [];
        fs.createReadStream(file.path)
            .pipe(csv())
            .on('data', (row) => {
                // Expecting columns: listId, email, name, variables (as JSON string or blank)
                results.push({
                    listId: row.listId,
                    email: row.email,
                    name: row.name,
                    variables: row.variables ? JSON.parse(row.variables) : null
                });
            })
            .on('end', () => {
                // Bulk insert
                if (results.length === 0) return resolve({ inserted: 0 });
                const values = results.map(item => [
                    item.listId,
                    item.email,
                    item.name,
                    JSON.stringify(item.variables)
                ]);
                db.query(
                    'INSERT INTO list_item (listId, email, name, variables) VALUES ?',
                    [values],
                    (err, result) => {
                        if (err) return reject(err);
                        resolve({ inserted: result.affectedRows });
                    }
                );
            })
            .on('error', (err) => reject(err));
    });
};