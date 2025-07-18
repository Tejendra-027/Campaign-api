const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// LOGIN
exports.login = async ({ email, mobile, password }) => {
    return new Promise((resolve, reject) => {
        if ((!email && !mobile) || !password) {
            return reject({ status: 400, message: 'Email or mobile and password are required' });
        }

        let query = '';
        let param = '';
        if (email) {
            query = 'SELECT * FROM user WHERE email = ? LIMIT 1';
            param = email;
        } else {
            query = 'SELECT * FROM user WHERE mobile = ? LIMIT 1';
            param = mobile;
        }

        db.query(query, [param], async (err, results) => {
            if (err) return reject({ status: 500, message: 'Database error', error: err });
            if (results.length === 0) return reject({ status: 401, message: 'Invalid credentials' });

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return reject({ status: 401, message: 'Invalid credentials' });

            // Include roleId in token for admin privileges
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    mobile: user.mobile,
                    roleId: user.roleId
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            const { password: pwd, ...userWithoutPassword } = user;
            resolve({ token, user: userWithoutPassword });
        });
    });
};

// REGISTER
exports.register = async ({ name, email, mobileCountryCode, mobile, password, roleId }) => {
    if (!name || !email || !password) {
        throw { status: 400, message: 'Name, email, and password are required' };
    }

    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
            if (err) return reject({ status: 500, message: 'Database error', error: err });
            if (results.length > 0) return reject({ status: 409, message: 'User already exists' });

            bcrypt.hash(password, 10, (err, hash) => {
                if (err) return reject({ status: 500, message: 'Error hashing password', error: err });

                db.query(
                    'INSERT INTO user (name, email, mobileCountryCode, mobile, password, roleId) VALUES (?, ?, ?, ?, ?, ?)',
                    [name, email, mobileCountryCode, mobile, hash, roleId],
                    (err, result) => {
                        if (err) return reject({ status: 500, message: 'Database error', error: err });
                        resolve({ message: 'User registered successfully' });
                    }
                );
            });
        });
    });
};

// DELETE USER
exports.deleteUser = async (userId) => {
    return new Promise((resolve, reject) => {
        if (!userId) {
            return reject({ status: 400, message: 'User ID is required' });
        }

        db.query('DELETE FROM user WHERE id = ?', [userId], (err, result) => {
            if (err) return reject({ status: 500, message: 'Database error', error: err });
            if (result.affectedRows === 0) return reject({ status: 404, message: 'User not found' });

            resolve({ message: 'User deleted successfully' });
        });
    });
};
