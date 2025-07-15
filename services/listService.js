const db = require('../models/db');

/* ──────────────────────────────────────────────────────────────────────────────
   📄 Filter / paginate Lists
   – returns: { rows: [ … ], total, page, limit }
   – works with/without “search”
────────────────────────────────────────────────────────────────────────────── */
exports.filterLists = ({ page = 1, limit = 10, search = '' }) => {
  page  = Number(page);
  limit = Number(limit);
  const offset = (page - 1) * limit;

  /* Build WHERE clause once */
  let  where  = 'WHERE 1=1';
  const args  = [];

  if (search.trim()) {
    where += ' AND name LIKE ?';
    args.push(`%${search.trim()}%`);
  }

  /* 1️⃣  main‑page query                                        */
  const dataSql   = `
    SELECT id, name, createdDate, modifiedDate
      FROM list
      ${where}
      ORDER BY id DESC
      LIMIT ? OFFSET ?`;
  const dataArgs  = args.concat([limit, offset]);

  /* 2️⃣  count query                                            */
  const countSql  = `SELECT COUNT(*) AS total FROM list ${where}`;

  return new Promise((resolve, reject) => {
    /* Run both queries in parallel */
    let rows, total;

    db.query(dataSql,  dataArgs, (err, results) => {
      if (err) return reject(err);
      rows = results;
      if (total !== undefined) resolve({ rows, total, page, limit });
      else totalQuery();             // wait for count
    });

    function totalQuery () {
      db.query(countSql, args, (err, countRes) => {
        if (err) return reject(err);
        total = countRes[0].total;
        if (rows !== undefined) resolve({ rows, total, page, limit });
      });
    }
  });
};


/* ──────────────────────────────────────────────────────────────────────────────
   ➕ Add List
────────────────────────────────────────────────────────────────────────────── */
exports.addList = ({ name }) =>
  new Promise((resolve, reject) => {
    db.query('INSERT INTO list (name) VALUES (?)', [name], (err, res) =>
      err ? reject(err) : resolve(res.insertId)
    );
  });


/* ──────────────────────────────────────────────────────────────────────────────
   ✏️ Update List
────────────────────────────────────────────────────────────────────────────── */
exports.updateList = (id, { name }) =>
  new Promise((resolve, reject) => {
    db.query('UPDATE list SET name = ? WHERE id = ?', [name, id], (err, res) =>
      err ? reject(err) : resolve(res)
    );
  });


/* ──────────────────────────────────────────────────────────────────────────────
   🔍 Get Single List
────────────────────────────────────────────────────────────────────────────── */
exports.getListDetail = id =>
  new Promise((resolve, reject) => {
    db.query('SELECT * FROM list WHERE id = ?', [id], (err, res) =>
      err ? reject(err) : resolve(res[0])
    );
  });


/* ──────────────────────────────────────────────────────────────────────────────
   🗑️  Delete List  (cascades to list_item first)
────────────────────────────────────────────────────────────────────────────── */
exports.deleteList = async id => {
  try {
    // 1. delete related items
    await new Promise((res, rej) =>
      db.query('DELETE FROM list_item WHERE listId = ?', [id], err =>
        err ? rej(err) : res()
      )
    );

    // 2. delete the list itself
    return await new Promise((res, rej) =>
      db.query('DELETE FROM list WHERE id = ?', [id], (err, result) =>
        err ? rej(err) : res(result.affectedRows > 0)
      )
    );
  } catch (e) {
    throw e;
  }
};
