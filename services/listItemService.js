// services/listItemService.js
const db  = require('../models/db');
const fs  = require('fs');
const csv = require('csv-parser');

/* ------------------------------------------------------------------ */
/* Filter list‑items  → returns { rows, total }                    */
/* ------------------------------------------------------------------ */
exports.filterListItems = ({ page = 1, limit = 10, search = '', listId }) => {
  page  = Number(page);
  limit = Number(limit);
  const offset = (page - 1) * limit;

  /* --- build WHERE clause once --- */
  let where   = 'WHERE 1=1';
  const parms = [];

  if (search) {
    where += ' AND (email LIKE ? OR name LIKE ?)';
    parms.push(`%${search}%`, `%${search}%`);
  }
  if (listId) {
    where += ' AND listId = ?';
    parms.push(listId);
  }

  /* --- main rows query --- */
  const rowsSql   = `SELECT * FROM list_item ${where} LIMIT ? OFFSET ?`;
  const rowsParms = [...parms, limit, offset];

  /* --- count query (no LIMIT/OFFSET) --- */
  const cntSql   = `SELECT COUNT(*) AS total FROM list_item ${where}`;
  const cntParms = parms;

  return new Promise((resolve, reject) => {
    db.query(rowsSql, rowsParms, (err, rows) => {
      if (err) return reject(err);
      db.query(cntSql, cntParms, (cntErr, cntRes) => {
        if (cntErr) return reject(cntErr);
        const total = cntRes[0]?.total ?? 0;
        resolve({ rows, total });
      });
    });
  });
};

/* ------------------------------------------------------------------ */
/* Add single list‑item                                             */
/* ------------------------------------------------------------------ */
exports.addListItem = ({ listId, email, name, variables }) =>
  new Promise((resolve, reject) => {
    db.query(
      'INSERT INTO list_item (listId, email, name, variables) VALUES (?, ?, ?, ?)',
      [listId, email, name, JSON.stringify(variables)],
      (err, r) => (err ? reject(err) : resolve(r.insertId))
    );
  });

/* ------------------------------------------------------------------ */
/* Update list‑item                                                */
/* ------------------------------------------------------------------ */
exports.updateListItem = (id, { listId, email, name, variables }) => {
  const fields = [];
  const vals   = [];

  if (listId !== undefined) { fields.push('listId=?'); vals.push(listId); }
  if (email  !== undefined)  { fields.push('email=?'); vals.push(email); }
  if (name   !== undefined)  { fields.push('name=?');  vals.push(name);  }
  if (variables !== undefined) {
    fields.push('variables=?');
    vals.push(JSON.stringify(variables));
  }
  if (!fields.length) return Promise.reject(new Error('No fields to update'));

  vals.push(id);
  const sql = `UPDATE list_item SET ${fields.join(', ')} WHERE id=?`;

  return new Promise((resolve, reject) => {
    db.query(sql, vals, (e, r) => (e ? reject(e) : resolve(r)));
  });
};

/* ------------------------------------------------------------------ */
/* Get detail                                                      */
/* ------------------------------------------------------------------ */
exports.getListItemDetail = (id) =>
  new Promise((resolve, reject) => {
    db.query('SELECT * FROM list_item WHERE id = ?', [id], (e, r) =>
      e ? reject(e) : resolve(r[0])
    );
  });

/* ------------------------------------------------------------------ */
/* CSV upload  – respects defaultListId                            */
/* ------------------------------------------------------------------ */
exports.uploadCsv = (file, defaultListId = null) =>
  new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file uploaded'));

    const rows = [];
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (row) => {
        const name   = row.Name  || row.name;
        const email  = row.Email || row.email;
        const listId = row.listId || row.ListId || defaultListId;
        if (!name || !email || !listId) return;  // skip invalid

        const vars = {};
        for (const k in row) {
          if (!['name','Name','email','Email','listId','ListId'].includes(k)) {
            vars[k] = row[k];
          }
        }
        rows.push([listId, email, name, Object.keys(vars).length ? JSON.stringify(vars) : null]);
      })
      .on('end', () => {
        if (!rows.length) return resolve({ inserted: 0 });
        db.query(
          'INSERT INTO list_item (listId, email, name, variables) VALUES ?',
          [rows],
          (e, r) => (e ? reject(e) : resolve({ inserted: r.affectedRows }))
        );
      })
      .on('error', reject);
  });

/* ------------------------------------------------------------------ */
/* Delete list‑item                                               */
/* ------------------------------------------------------------------ */
exports.deleteListItem = (id) =>
  new Promise((resolve, reject) => {
    db.query('DELETE FROM list_item WHERE id = ?', [id], (e, r) =>
      e ? reject(e) : resolve(r.affectedRows > 0)
    );
  });
