const db = require('../models/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.login = async ({ email, password }) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM user WHERE email = ?', [email], async (err, results) => {
            if (err) return reject({ status: 500, message: 'Database error', error: err });
            if (results.length === 0) return reject({ status: 401, message: 'Invalid email or password' });

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return reject({ status: 401, message: 'Invalid email or password' });

            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            const { password: pwd, ...userWithoutPassword } = user;
            resolve({ token, user: userWithoutPassword });
        });
    });
};

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
}