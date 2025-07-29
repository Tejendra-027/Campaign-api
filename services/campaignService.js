const db = require('../models/db');

// ✅ Add a new campaign
exports.addCampaign = (data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO campaigns (
        name, channel, startDate, emailFrom,
        audienceListId, templateId, \`to\`, cc, bcc,
        repeatType, repeatEvery, repeatOn, repeatEndsOn,
        isRepeat, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.name,
      data.channel,
      data.startDate,
      data.emailFrom,
      data.audienceListId,
      data.templateId,
      data.to || '',
      data.cc || '',
      data.bcc || '',
      data.repeatType || 'none',
      data.repeatEvery || 0,
      data.repeatOn || '',
      data.repeatEndsOn || null,
      Boolean(data.isRepeat),
      data.status || 'Draft'
    ];

    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve({ id: result.insertId, ...data });
    });
  });
};

// ✅ Get campaigns with pagination + optional search
exports.getCampaigns = ({ page = 1, limit = 10, search = '' }) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const searchQuery = `%${search}%`;

    const countSql = `SELECT COUNT(*) AS total FROM campaigns WHERE isDeleted = FALSE AND name LIKE ?`;
    const listSql = `
      SELECT * FROM campaigns
      WHERE isDeleted = FALSE AND name LIKE ?
      ORDER BY createdAt DESC
      LIMIT ? OFFSET ?
    `;

    db.query(countSql, [searchQuery], (err, countResult) => {
      if (err) return reject(err);
      const totalCount = countResult[0].total;

      db.query(listSql, [searchQuery, parseInt(limit), parseInt(offset)], (err, rows) => {
        if (err) return reject(err);
        resolve({ campaigns: rows, totalCount });
      });
    });
  });
};

// ✅ Get single campaign by ID
exports.getCampaignById = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      'SELECT * FROM campaigns WHERE id = ? AND isDeleted = FALSE',
      [id],
      (err, rows) => {
        if (err) return reject(err);
        if (!rows.length) return resolve(null);
        resolve(rows[0]);
      }
    );
  });
};

// ✅ Update campaign
exports.updateCampaign = (id, data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE campaigns SET
        name = ?, channel = ?, startDate = ?, emailFrom = ?,
        audienceListId = ?, templateId = ?, \`to\` = ?, cc = ?, bcc = ?,
        repeatType = ?, repeatEvery = ?, repeatOn = ?, repeatEndsOn = ?,
        isRepeat = ?, status = ?
      WHERE id = ? AND isDeleted = FALSE
    `;
    const values = [
      data.name,
      data.channel,
      data.startDate,
      data.emailFrom,
      data.audienceListId,
      data.templateId,
      data.to || '',
      data.cc || '',
      data.bcc || '',
      data.repeatType || 'none',
      data.repeatEvery || 0,
      data.repeatOn || '',
      data.repeatEndsOn || null,
      Boolean(data.isRepeat),
      data.status || 'Draft',
      id
    ];

    db.query(sql, values, (err, result) => {
      if (err) return reject(err);
      resolve({ id, ...data });
    });
  });
};

// ✅ Soft delete campaign
exports.deleteCampaign = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE campaigns SET isDeleted = TRUE WHERE id = ?',
      [id],
      (err, result) => {
        if (err) return reject(err);
        resolve(true);
      }
    );
  });
};

// ✅ Toggle status (Draft ↔ Published)
exports.toggleStatus = (id, status) => {
  return new Promise((resolve, reject) => {
    db.query(
      'UPDATE campaigns SET status = ? WHERE id = ? AND isDeleted = FALSE',
      [status, id],
      (err, result) => {
        if (err) return reject(err);
        resolve(true);
      }
    );
  });
};

// ✅ Copy campaign (_copy_1 added)
exports.copyCampaign = (id) => {
  return new Promise((resolve, reject) => {
    const getSql = 'SELECT * FROM campaigns WHERE id = ? AND isDeleted = FALSE';
    db.query(getSql, [id], (err, rows) => {
      if (err) return reject(err);
      if (!rows.length) return reject(new Error('Campaign not found'));

      const original = rows[0];
      const copyName = `${original.name}_copy_1`;

      const copy = {
        ...original,
        name: copyName,
        repeatEndsOn: original.repeatEndsOn || null
      };

      delete copy.id;
      delete copy.createdAt;
      delete copy.updatedAt;

      const insertSql = `
        INSERT INTO campaigns (
          name, channel, startDate, emailFrom,
          audienceListId, templateId, \`to\`, cc, bcc,
          repeatType, repeatEvery, repeatOn, repeatEndsOn,
          isRepeat, status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        copy.name,
        copy.channel,
        copy.startDate,
        copy.emailFrom,
        copy.audienceListId,
        copy.templateId,
        copy.to || '',
        copy.cc || '',
        copy.bcc || '',
        copy.repeatType || 'none',
        copy.repeatEvery || 0,
        copy.repeatOn || '',
        copy.repeatEndsOn,
        Boolean(copy.isRepeat),
        copy.status || 'Draft'
      ];

      db.query(insertSql, values, (err, result) => {
        if (err) return reject(err);
        resolve({ id: result.insertId, ...copy });
      });
    });
  });
};
