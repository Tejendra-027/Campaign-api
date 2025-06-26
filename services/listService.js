const db = require('../models/db');

// List all lists with pagination/filter
exports.filterLists = ({ page = 1, limit = 10, search = '' }) => {
    const offset = (page - 1) * limit;
    let sql = 'SELECT * FROM list WHERE 1=1';
    let params = [];

    if (search) {
        sql += ' AND name LIKE ?';
        params.push(`%${search}%`);
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

// Add a new list
exports.addList = ({ name }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO list (name) VALUES (?)',
            [name],
            (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            }
        );
    });
};

// Update a list by ID
exports.updateList = (id, { name }) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE list SET name = ? WHERE id = ?',
            [name, id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};

// Get list detail by ID
exports.getListDetail = (id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM list WHERE id = ?', [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};