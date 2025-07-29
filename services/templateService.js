const db = require('../models/db');

// Add new template
exports.addTemplate = ({ name, description, content, createdBy }) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO templates (name, description, content, createdBy) VALUES (?, ?, ?, ?)';
        db.query(sql, [name, description, content, createdBy], (err, result) => {
            if (err) return reject(err);

            // Fetch inserted row
            db.query('SELECT * FROM templates WHERE id = ?', [result.insertId], (err2, rows) => {
                if (err2) return reject(err2);
                resolve(rows[0]);
            });
        });
    });
};

// Update template
exports.updateTemplate = (id, { name, description, content }) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE templates SET name = ?, description = ?, content = ? WHERE id = ?';
        db.query(sql, [name, description, content, id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return resolve(null);

            db.query('SELECT * FROM templates WHERE id = ?', [id], (err2, rows) => {
                if (err2) return reject(err2);
                resolve(rows[0]);
            });
        });
    });
};

// Get template by ID
exports.getTemplateById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM templates WHERE id = ?';
        db.query(sql, [id], (err, results) => {
            if (err) return reject(err);
            resolve(results[0]);
        });
    });
};

// Delete template
exports.deleteTemplate = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM templates WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return resolve(false);
            resolve(true);
        });
    });
};

// Filter templates (with pagination and search)
exports.filterTemplates = ({ page, limit, search }) => {
    return new Promise((resolve, reject) => {
        const offset = (parseInt(page) - 1) * parseInt(limit);
        const searchTerm = `%${search}%`;

        const countSql = 'SELECT COUNT(*) AS total FROM templates WHERE name LIKE ?';
        const dataSql = 'SELECT * FROM templates WHERE name LIKE ? ORDER BY id DESC LIMIT ? OFFSET ?';

        db.query(countSql, [searchTerm], (err, countResult) => {
            if (err) return reject(err);

            const total = countResult[0].total;

            db.query(dataSql, [searchTerm, parseInt(limit), offset], (err2, rows) => {
                if (err2) return reject(err2);

                resolve({
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    data: rows
                });
            });
        });
    });
};

// Update template status (enable/disable)
exports.updateTemplateStatus = (id, isActive) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE templates SET isActive = ? WHERE id = ?';
        db.query(sql, [isActive, id], (err, result) => {
            if (err) return reject(err);
            if (result.affectedRows === 0) return resolve(null);

            db.query('SELECT * FROM templates WHERE id = ?', [id], (err2, rows) => {
                if (err2) return reject(err2);
                resolve(rows[0]);
            });
        });
    });
};

// Get all templates (id + name only)
exports.getAllTemplatesSimple = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, name FROM templates ORDER BY id DESC';
        db.query(sql, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
